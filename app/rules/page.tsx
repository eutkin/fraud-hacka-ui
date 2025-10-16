"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { AppHeader } from "@/components/app-header"
import { AppFooter } from "@/components/app-footer"
import { ProtectedRoute } from "@/components/protected-route"
import { DataTable, type Column } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ActionBadge } from "@/components/action-badge"
import { conditionToText } from "@/components/condition-builder"
import { fetchRules, deleteRule } from "@/lib/api"
import type { Rule } from "@/lib/types"
import { Plus, Trash2 } from "lucide-react"

export default function RulesPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [nameFilter, setNameFilter] = useState("")

  const { data: rules = [] } = useQuery({
    queryKey: ["rules"],
    queryFn: fetchRules,
  })

  const deleteMutation = useMutation({
    mutationFn: deleteRule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rules"] })
    },
  })

  // Sort by priority (always)
  const sortedRules = [...rules].sort((a, b) => a.priority - b.priority)

  const filteredData = sortedRules.filter((item) => item.name.toLowerCase().includes(nameFilter.toLowerCase()))

  const columns: Column<Rule>[] = [
    {
      key: "priority",
      label: "Приоритет",
    },
    {
      key: "recommended_action",
      label: "Рекомендуемое действие",
      render: (value: "ALLOW" | "DENY" | "REVIEW") => <ActionBadge action={value} />,
    },
    {
      key: "name",
      label: "Имя",
    },
    {
      key: "condition",
      label: "Условие сработки",
      render: (value) => <pre className="text-xs whitespace-pre-wrap font-mono max-w-md">{conditionToText(value)}</pre>,
    },
  ]

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen flex-col">
        <AppHeader />
        <main className="flex-1 container py-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">Журнал Правил</h1>
              <Button onClick={() => router.push("/rules/create")}>
                <Plus className="h-4 w-4 mr-2" />
                Создать
              </Button>
            </div>

            <Input
              placeholder="Фильтр по имени"
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
              className="max-w-xs"
            />

            <DataTable
              data={filteredData}
              columns={columns}
              zebra
              onRowClick={(row) => router.push(`/rules/${row.id}`)}
              actions={(row) => (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteMutation.mutate(row.id)
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            />
          </div>
        </main>
        <AppFooter />
      </div>
    </ProtectedRoute>
  )
}
