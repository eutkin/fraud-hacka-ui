"use client"

import { useState, useMemo } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {useRouter, useSearchParams} from "next/navigation"
import { AppHeader } from "@/components/app-header"
import { AppFooter } from "@/components/app-footer"
import { ProtectedRoute } from "@/components/protected-route"
import { DataTable, type Column } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { fetchCorrelations, deleteCorrelation, fetchAttributes } from "@/lib/api"
import type { Correlation } from "@/lib/types"
import { Plus, Trash2 } from "lucide-react"

export default function CorrelationsPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [nameFilter, setNameFilter] = useState("")
  const [functionFilter, setFunctionFilter] = useState("")

  const { data: correlations = [] } = useQuery({
    queryKey: ["correlations"],
    queryFn: fetchCorrelations,
    refetchInterval: 15000, // Auto-refresh every 15 seconds
  })

  const { data: attributes = [] } = useQuery({
    queryKey: ["attributes"],
    queryFn: () => fetchAttributes(),
  })

  // Create attribute map for enrichment
  const attributeMap = useMemo(() => {
    const map = new Map<string, string>()
    attributes.forEach((attr) => {
      map.set(attr.id, attr.name)
    })
    return map
  }, [attributes])

  const deleteMutation = useMutation({
    mutationFn: deleteCorrelation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["correlations"] })
    },
  })

  const filteredData = correlations.filter(
    (item) =>
      item.name.toLowerCase().includes(nameFilter.toLowerCase()) &&
      item.calculation_function.toLowerCase().includes(functionFilter.toLowerCase()),
  )

  const columns: Column<Correlation>[] = [
    {
      key: "name",
      label: "Имя",
      sortable: true,
    },
    {
      key: "calculation_function",
      label: "Функция расчета",
      sortable: false,
    },
    {
      key: "corr_attribute",
      label: "Атрибут корреляции",
      render: (value: string) => attributeMap.get(value) || value,
    },
  ]

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen flex-col">
        <AppHeader />
        <main className="flex-1 py-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">Журнал Корреляции</h1>
              <Button onClick={() => router.push("/correlations/create")}>
                <Plus className="h-4 w-4 mr-2" />
                Создать
              </Button>
            </div>

            <div className="flex gap-4">
              <Input
                placeholder="Фильтр по имени"
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)}
                className="max-w-xs"
              />
              <Input
                placeholder="Фильтр по функции"
                value={functionFilter}
                onChange={(e) => setFunctionFilter(e.target.value)}
                className="max-w-xs"
              />
            </div>

            <DataTable
              data={filteredData}
              columns={columns}
              zebra
              onRowClick={(row) => router.push(`/correlations/${row.id}`)}
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
