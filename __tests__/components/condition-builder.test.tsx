import { conditionToText } from "@/components/condition-builder"
import type { ConditionNode, ConditionLeaf } from "@/lib/types"

describe("conditionToText", () => {
  it("should convert a simple leaf to text", () => {
    const leaf: ConditionLeaf = {
      type: "leaf",
      id: "1",
      left: ":Канал:",
      operator: "=",
      right: '"WEB"',
    }

    const result = conditionToText(leaf)
    expect(result).toBe(':Канал: = "WEB"')
  })

  it("should convert a node with AND logic to text", () => {
    const node: ConditionNode = {
      type: "node",
      id: "root",
      logic: "AND",
      children: [
        {
          type: "leaf",
          id: "1",
          left: ":Канал:",
          operator: "=",
          right: '"WEB"',
        },
        {
          type: "leaf",
          id: "2",
          left: ":Сумма:",
          operator: ">",
          right: "1000",
        },
      ],
    }

    const result = conditionToText(node)
    expect(result).toContain(':Канал: = "WEB"')
    expect(result).toContain("AND")
    expect(result).toContain(":Сумма: > 1000")
  })

  it("should convert a node with OR logic to text", () => {
    const node: ConditionNode = {
      type: "node",
      id: "root",
      logic: "OR",
      children: [
        {
          type: "leaf",
          id: "1",
          left: ":Тип:",
          operator: "=",
          right: '"A"',
        },
        {
          type: "leaf",
          id: "2",
          left: ":Тип:",
          operator: "=",
          right: '"B"',
        },
      ],
    }

    const result = conditionToText(node)
    expect(result).toContain(':Тип: = "A"')
    expect(result).toContain("OR")
    expect(result).toContain(':Тип: = "B"')
  })

  it("should handle nested nodes", () => {
    const node: ConditionNode = {
      type: "node",
      id: "root",
      logic: "AND",
      children: [
        {
          type: "node",
          id: "nested",
          logic: "OR",
          children: [
            {
              type: "leaf",
              id: "1",
              left: ":A:",
              operator: "=",
              right: "1",
            },
            {
              type: "leaf",
              id: "2",
              left: ":B:",
              operator: "=",
              right: "2",
            },
          ],
        },
        {
          type: "leaf",
          id: "3",
          left: ":C:",
          operator: "=",
          right: "3",
        },
      ],
    }

    const result = conditionToText(node)
    expect(result).toContain("OR")
    expect(result).toContain("AND")
  })
})
