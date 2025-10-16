"use client"

import { useQuery } from "@tanstack/react-query"
import { useParams, useRouter } from "next/navigation"
import { AppHeader } from "@/components/app-header"
import { AppFooter } from "@/components/app-footer"
import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { ActionBadge } from "@/components/action-badge"
import { ConditionBuilder } from "@/components/condition-builder"
import { fetchRules, fetchAttributes } from "@/lib/api"
import { ArrowLeft } from "lucide-react"

export default function RuleCardPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const { data: rules = [] } = useQuery({
    queryKey: ["rules"],
    queryFn: fetchRules,
  })

  const { data: attributes = [] } = useQuery({
    queryKey: ["attributes"],
    queryFn: () => fetchAttributes(),
  })

  const rule = rules.find((r) => r.id === id)

  if (!rule) {
    return (
      <ProtectedRoute>
        <div className="flex min-h-screen flex-col">
          <AppHeader />
          <main className="flex-1 container py-6">
            <p>Правило не найдено</p>
          </main>
          <AppFooter />
        </div>
      </ProtectedRoute>
    )
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
              <h1 className="text-3xl font-bold">Карточка Правила</h1>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Общая информация</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-base font-semibold">Имя</Label>
                    <p className="text-sm text-muted-foreground">{rule.name}</p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-base font-semibold">Приоритет</Label>
                    <p className="text-sm text-muted-foreground">{rule.priority}</p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-base font-semibold">Рекомендуемое действие</Label>
                    <div className="mt-1">
                      <ActionBadge action={rule.recommended_action} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Условие сработки</CardTitle>
              </CardHeader>
              <CardContent>
                <ConditionBuilder value={rule.condition} onChange={() => {}} attributes={attributes} readOnly />
              </CardContent>
            </Card>
          </div>
        </main>
        <AppFooter />
      </div>
    </ProtectedRoute>
  )
}
