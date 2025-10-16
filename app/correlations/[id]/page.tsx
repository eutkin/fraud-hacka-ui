"use client"

import { useQuery } from "@tanstack/react-query"
import { useParams, useRouter } from "next/navigation"
import { AppHeader } from "@/components/app-header"
import { AppFooter } from "@/components/app-footer"
import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { ConditionBuilder } from "@/components/condition-builder"
import { TimeWindowInput } from "@/components/time-window-input"
import { fetchCorrelations, fetchAttributes } from "@/lib/api"
import { ArrowLeft } from "lucide-react"

export default function CorrelationCardPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const { data: correlations = [] } = useQuery({
    queryKey: ["correlations"],
    queryFn: fetchCorrelations,
  })

  const { data: attributes = [] } = useQuery({
    queryKey: ["attributes"],
    queryFn: () => fetchAttributes(),
  })

  const correlation = correlations.find((c) => c.id === id)

  const corrAttribute = attributes.find((attr) => attr.id === correlation?.corr_attribute)

  if (!correlation) {
    return (
      <ProtectedRoute>
        <div className="flex min-h-screen flex-col">
          <AppHeader />
          <main className="flex-1 container py-6">
            <p>Корреляция не найдена</p>
          </main>
          <AppFooter />
        </div>
      </ProtectedRoute>
    )
  }

  // Mock condition for display
  const mockCondition = {
    type: "node" as const,
    id: "root",
    logic: "AND" as const,
    children: [
      {
        type: "leaf" as const,
        id: "1",
        left: ":Канал:",
        operator: "=" as const,
        right: '"WEB"',
      },
    ],
  }

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen flex-col">
        <AppHeader />
        <main className="flex-1 container py-6 max-w-4xl">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => router.push("/correlations")}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-3xl font-bold">Карточка Корреляции</h1>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Общая информация</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-base">Имя</Label>
                  <p className="text-sm text-muted-foreground">{correlation.name}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Функция корреляции</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-base">Функция расчета</Label>
                  <p className="text-sm text-muted-foreground">{correlation.calculation_function}</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-base">Атрибут Корреляции</Label>
                  <p className="text-sm text-muted-foreground">{corrAttribute?.name || correlation.corr_attribute}</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-base">Исторический фильтр</Label>
                  <div className="mt-2">
                    <ConditionBuilder value={mockCondition} onChange={() => {}} attributes={attributes} readOnly />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Временное окно</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <TimeWindowInput value={correlation.time_window_seconds || 0} onChange={() => {}} readOnly />
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        <AppFooter />
      </div>
    </ProtectedRoute>
  )
}
