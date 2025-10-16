"use client"

import {useState} from "react"
import {Button} from "@/components/ui/button"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Input} from "@/components/ui/input"
import type {ConditionNode, ConditionLeaf, Attribute} from "@/lib/types"
import {Plus, Trash2} from "lucide-react"
import {v4 as uuidv4} from "uuid"

interface ConditionBuilderProps {
  value: ConditionNode
  onChange: (value: ConditionNode) => void
  attributes: Attribute[]
  readOnly?: boolean
}

export function ConditionBuilder({value, onChange, attributes, readOnly = false}: ConditionBuilderProps) {
  const [depth, setDepth] = useState(0)

  const addCondition = (node: ConditionNode) => {
    const newLeaf: ConditionLeaf = {
      type: "leaf",
      id: uuidv4(),
      left: "",
      operator: "=",
      right: "",
    }
    const updated = {...node, children: [...node.children, newLeaf]}
    onChange(updateNode(value, node.id, updated))
  }

  const addGroup = (node: ConditionNode) => {
    if (depth >= 5) return // Max depth limit

    const newGroup: ConditionNode = {
      type: "node",
      id: uuidv4(),
      logic: "AND",
      children: [
        {
          type: "leaf",
          id: uuidv4(),
          left: "",
          operator: "=",
          right: "",
        },
      ],
    }
    const updated = {...node, children: [...node.children, newGroup]}
    onChange(updateNode(value, node.id, updated))
  }

  const removeItem = (parentNode: ConditionNode, itemId: string) => {
    const updated = {...parentNode, children: parentNode.children.filter((child) => child.id !== itemId)}
    onChange(updateNode(value, parentNode.id, updated))
  }

  const toggleLogic = (node: ConditionNode) => {
    const updated = {...node, logic: node.logic === "AND" ? ("OR" as const) : ("AND" as const)}
    onChange(updateNode(value, node.id, updated))
  }

  const updateLeaf = (leaf: ConditionLeaf, field: keyof ConditionLeaf, val: string) => {
    const updated = {...leaf, [field]: val}
    onChange(updateNode(value, leaf.id, updated))
  }

  const updateNode = (
    root: ConditionNode,
    targetId: string,
    newValue: ConditionNode | ConditionLeaf,
  ): ConditionNode => {
    if (root.id === targetId) {
      return newValue as ConditionNode
    }

    return {
      ...root,
      children: root.children.map((child) => {
        if (child.id === targetId) {
          return newValue
        }
        if (child.type === "node") {
          return updateNode(child, targetId, newValue)
        }
        return child
      }),
    }
  }

  const renderNode = (node: ConditionNode, currentDepth: number, parentNode?: ConditionNode) => {
    const showLogic = node.children.length > 1

    return (
      <div key={node.id} className="space-y-2 rounded-lg border p-4">
        <div className="flex items-center gap-2">
          {!readOnly && (
            <>
              <Button type="button" variant="outline" size="sm" onClick={() => addCondition(node)}>
                <Plus className="h-4 w-4 mr-1"/>
                Условие
              </Button>
              {currentDepth < 5 && (
                <Button type="button" variant="outline" size="sm" onClick={() => addGroup(node)}>
                  <Plus className="h-4 w-4 mr-1"/>
                  Группа
                </Button>
              )}
            </>
          )}
          {parentNode && !readOnly && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeItem(parentNode, node.id)}
              className="ml-auto"
            >
              <Trash2 className="h-4 w-4"/>
            </Button>
          )}
        </div>

        <div className="space-y-2 pl-4">
          {node.children.map((child, index) => (
            <div key={child.id}>
              {showLogic && index > 0 && (
                <div className="flex items-center py-2">
                  <Button
                    type="button"
                    variant={node.logic === "AND" ? "default" : "secondary"}
                    size="sm"
                    onClick={() => !readOnly && toggleLogic(node)}
                    disabled={readOnly}
                    className="shrink-0 w-16"
                  >
                    {node.logic}
                  </Button>
                </div>
              )}
              <div className="flex-1">
                {child.type === "leaf" ? renderLeaf(child, node) : renderNode(child, currentDepth + 1, node)}
              </div>
            </div>
            ))}
        </div>
      </div>
    )
  }

  const renderLeaf = (leaf: ConditionLeaf, parentNode: ConditionNode) => {
    const selectedAttr = attributes.find((attr) => `:${attr.name}:` === leaf.left)
    const validateRight = (value: string): boolean => {
      if (!selectedAttr) return true
      if (selectedAttr.type === "int") return /^-?\d+$/.test(value) || value === ""
      if (selectedAttr.type === "float") return /^-?\d*\.?\d*$/.test(value) || value === ""
      return true
    }

    return (
      <div key={leaf.id} className="flex items-center gap-2 rounded border bg-muted/50 p-2">
        <Select
          value={leaf.left}
          onValueChange={(val) => !readOnly && updateLeaf(leaf, "left", val)}
          disabled={readOnly}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Атрибут"/>
          </SelectTrigger>
          <SelectContent>
            {attributes.map((attr) => (
              <SelectItem key={attr.id} value={`:${attr.name}:`}>
                {attr.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={leaf.operator}
          onValueChange={(val) => !readOnly && updateLeaf(leaf, "operator", val as any)}
          disabled={readOnly}
        >
          <SelectTrigger className="w-[100px]">
            <SelectValue/>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="=">=</SelectItem>
            <SelectItem value="!=">!=</SelectItem>
            <SelectItem value=">">{">"}</SelectItem>
            <SelectItem value="<">{"<"}</SelectItem>
          </SelectContent>
        </Select>

        <Input
          value={leaf.right}
          onChange={(e) => {
            if (!readOnly && validateRight(e.target.value)) {
              updateLeaf(leaf, "right", e.target.value)
            }
          }}
          placeholder="Значение"
          className="w-[200px]"
          disabled={readOnly}
        />

        {!readOnly && (
          <Button type="button" variant="ghost" size="sm" onClick={() => removeItem(parentNode, leaf.id)}>
            <Trash2 className="h-4 w-4"/>
          </Button>
        )}
      </div>
    )
  }

  return <div className="space-y-4">{renderNode(value, depth)}</div>
}

export function conditionToText(condition: ConditionNode | ConditionLeaf, indent = 0): string {
  const prefix = "  ".repeat(indent)

  if (condition.type === "leaf") {
    return `${prefix}${condition.left} ${condition.operator} ${condition.right}`
  }

  const lines: string[] = []
  condition.children.forEach((child, index) => {
    if (index > 0) {
      lines.push(`${prefix}${condition.logic}`)
    }
    lines.push(conditionToText(child, indent))
  })

  return lines.join("\n")
}
