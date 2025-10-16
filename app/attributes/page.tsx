"use client"

import { useQuery } from "@tanstack/react-query"
import { AppHeader } from "@/components/app-header"
import { AppFooter } from "@/components/app-footer"
import { ProtectedRoute } from "@/components/protected-route"
import { DataTable, type Column } from "@/components/data-table"
import { fetchAttributes } from "@/lib/api"
import type { Attribute } from "@/lib/types"
import { CheckCircle2, XCircle } from "lucide-react"

const columns: Column<Attribute>[] = [
  {
    key: "id",
    label: "ID",
  },
  {
    key: "name",
    label: "Имя",
    sortable: true,
  },
  {
    key: "type",
    label: "Тип",
  },
  {
    key: "corr",
    label: "Атрибут Корреляции",
    sortable: true,
    render: (value: boolean) =>
      value ? (
        <CheckCircle2 className="h-5 w-5 text-green-600" />
      ) : (
        <XCircle className="h-5 w-5 text-muted-foreground" />
      ),
  },
]

export default function AttributesPage() {
  const { data: attributes = [], isLoading } = useQuery({
    queryKey: ["attributes"],
    queryFn: async function() : Promise<Attribute[]> {
      return await fetchAttributes(false)
    },
  })

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen flex-col">
        <AppHeader />
        <main className="flex-1 py-6">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold">Журнал Атрибутов</h1>
            {isLoading ? (
              <div className="flex items-center justify-center py-8 ">
                <p className="text-muted-foreground">Загрузка...</p>
              </div>
            ) : (
              <DataTable data={attributes} columns={columns} zebra />
            )}
          </div>
        </main>
        <AppFooter />
      </div>
    </ProtectedRoute>
  )
}
