"use client"

import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { useParams, useRouter } from "next/navigation"
import { AppHeader } from "@/components/app-header"
import { AppFooter } from "@/components/app-footer"
import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ActionBadge } from "@/components/action-badge"
import { fetchTransactions, fetchAttributes, fetchRules } from "@/lib/api"
import { ArrowLeft } from "lucide-react"
import type { Attribute } from "@/lib/types"

export default function TransactionCardPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const { data: transactions = [] } = useQuery({
    queryKey: ["transactions"],
    queryFn: fetchTransactions,
  })

  const { data: allAttributes = [] } = useQuery({
    queryKey: ["attributes"],
    queryFn: () => fetchAttributes(),
  })

  const { data: rules = [] } = useQuery({
    queryKey: ["rules"],
    queryFn: fetchRules,
  })

  const transaction = transactions.find((t) => t.id === id)

  const groupedAttributes = useMemo(() => {
    if (!transaction) return {}

    const groups: Record<string, Array<{ id: string; name: string; value: string; attribute: Attribute }>> = {}

    Object.entries(transaction)
      .filter(([key]) => key !== "id" && key !== "timestamp")
      .forEach(([key, value]) => {
        const attribute = allAttributes.find((attr) => attr.id === key)
        if (attribute) {
          const group = attribute.group
          if (!groups[group]) {
            groups[group] = []
          }
          groups[group].push({
            id: key,
            name: attribute.name,
            value: String(value),
            attribute,
          })
        }
      })

    return groups
  }, [transaction, allAttributes])

  const triggeredRules = useMemo(() => {
    return [...rules].sort((a, b) => a.priority - b.priority).slice(0, 3)
  }, [rules])

  if (!transaction) {
    return (
      <ProtectedRoute>
        <div className="flex min-h-screen flex-col">
          <AppHeader />
          <main className="flex-1 container py-6">
            <p>Транзакция не найдена</p>
          </main>
          <AppFooter />
        </div>
      </ProtectedRoute>
    )
  }

  const groupOrder = ["О клиенте", "Об устройстве", "О карте", "О получателе", "Остальное"]

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen flex-col">
        <AppHeader />
        <main className="flex-1 container py-6">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => router.push("/transactions")}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-3xl font-bold">Карточка Транзакции</h1>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Основная информация</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">ID транзакции</p>
                  <p className="mt-1 font-mono text-sm">{transaction.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Время сработки</p>
                  <p className="mt-1 text-sm">{new Date(transaction.timestamp).toLocaleString("ru-RU")}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Сработавшие правила</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {triggeredRules.map((rule, index) => (
                    <div
                      key={rule.id}
                      className="flex items-center justify-between rounded-lg border p-3 hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className={`text-sm ${index === 0 ? "font-bold" : ""}`}>{rule.name}</span>
                        <span className="text-xs text-muted-foreground">Приоритет: {rule.priority}</span>
                      </div>
                      <ActionBadge action={rule.recommended_action} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {groupOrder.map((groupName) => {
              const attributes = groupedAttributes[groupName]
              if (!attributes || attributes.length === 0) return null

              return (
                <Card key={groupName}>
                  <CardHeader>
                    <CardTitle>{groupName}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {attributes.map((attr) => (
                        <div key={attr.id} className="rounded-lg border p-3 space-y-1">
                          <p className="text-sm font-medium">{attr.name}</p>
                          <p className="text-sm text-muted-foreground break-all">{attr.value}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </main>
        <AppFooter />
      </div>
    </ProtectedRoute>
  )
}
