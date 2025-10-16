"use client"

import { useState } from "react"
import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { AppHeader } from "@/components/app-header"
import { AppFooter } from "@/components/app-footer"
import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ConditionBuilder } from "@/components/condition-builder"
import { ActionBadge } from "@/components/action-badge"
import { fetchAttributes, createRule } from "@/lib/api"
import type { ConditionNode } from "@/lib/types"
import { v4 as uuidv4 } from "uuid"
import { ArrowLeft } from "lucide-react"

export default function CreateRulePage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [name, setName] = useState("")
  const [priority, setPriority] = useState("")
  const [recommendedAction, setRecommendedAction] = useState<"ALLOW" | "DENY" | "REVIEW">("ALLOW")
  const [condition, setCondition] = useState<ConditionNode>({
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
  })

  const { data: attributes = [] } = useQuery({
    queryKey: ["attributes"],
    queryFn: () => fetchAttributes(),
  })

  const createMutation = useMutation({
    mutationFn: createRule,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["rules"]})
      router.push("/rules")
    },
  })

  const handleSave = () => {
    createMutation.mutate({
      name,
      priority: Number.parseInt(priority),
      recommended_action: recommendedAction,
      condition,
    })
  }

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen flex-col">
        <AppHeader />
        <main className="flex-1 container py-6 max-w-4xl">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => router.push("/rules")}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-3xl font-bold">Создание Правила</h1>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Общая информация</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-base">
                    Имя
                  </Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority" className="text-base">
                    Приоритет
                  </Label>
                  <Input
                    id="priority"
                    type="number"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    placeholder="1"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="action" className="text-base">
                    Рекомендуемое действие
                  </Label>
                  <Select value={recommendedAction} onValueChange={(val) => setRecommendedAction(val as any)}>
                    <SelectTrigger id="action">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALLOW">
                        <div className="flex items-center">
                          <ActionBadge action="ALLOW" />
                        </div>
                      </SelectItem>
                      <SelectItem value="DENY">
                        <div className="flex items-center">
                          <ActionBadge action="DENY" />
                        </div>
                      </SelectItem>
                      <SelectItem value="REVIEW">
                        <div className="flex items-center">
                          <ActionBadge action="REVIEW" />
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Условие сработки</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label className="text-base">Условие сработки</Label>
                  <div className="mt-2">
                    <ConditionBuilder value={condition} onChange={setCondition} attributes={attributes} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button variant="outline" onClick={() => router.push("/rules")}>
                Отменить
              </Button>
              <Button onClick={handleSave}>Сохранить</Button>
            </div>
          </div>
        </main>
        <AppFooter />
      </div>
    </ProtectedRoute>
  )
}
