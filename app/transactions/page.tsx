"use client"

import {useMemo, useState} from "react"
import {useQuery} from "@tanstack/react-query"
import {useRouter} from "next/navigation"
import {AppHeader} from "@/components/app-header"
import {AppFooter} from "@/components/app-footer"
import {ProtectedRoute} from "@/components/protected-route"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {fetchTransactions, fetchAttributes} from "@/lib/api"
import {IdCard} from "lucide-react";
import {FilterInput} from "@/components/filter-input";
import {Button} from "@/components/ui/button";
import {FieldWithCopy} from "@/components/field-with-copy";

export default function TransactionsPage() {
  const router = useRouter()

  const [filters, setFilters] = useState<Record<string, string>>({})

  const {data: allAttributes = []} = useQuery({
    queryKey: ["attributes"],
    queryFn: () => fetchAttributes(),
  })

  const {data: corrAttributes = []} = useQuery({
    queryKey: ["attributes", "corr"],
    queryFn: () => fetchAttributes(true),
  })

  const {data: transactions = []} = useQuery({
    queryKey: ["transactions"],
    queryFn: fetchTransactions,
    refetchInterval: 15000,
  })

  const attributeMap = useMemo(() => {
    const map = new Map<string, string>()
    allAttributes.forEach((attr) => {
      map.set(attr.id, attr.name)
    })
    return map
  }, [allAttributes])

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      return Object.entries(filters).every(([key, filterValue]) => {
        if (!filterValue) return true
        const value = String(transaction[key] || "").toLowerCase()
        return value.includes(filterValue.toLowerCase())
      })
    })
  }, [transactions, filters])

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen flex-col">
        <AppHeader/>
        <main className="flex-1 container py-6">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold">Журнал Транзакций</h1>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead key="action-543251">
                      <div className="space-y-2">
                        <div>Карточка</div>
                      </div>
                    </TableHead>
                    <TableHead>
                      <FilterInput
                        value={filters["id"] || ""}
                        onChange={(newValue) => setFilters({...filters, id: newValue})}
                        label="ID"
                        placeholder="Фильтр..."
                      />
                    </TableHead>
                    <TableHead>
                      <FilterInput
                        value={filters["timestamp"] || ""}
                        onChange={(newValue) => setFilters({...filters, timestamp: newValue})}
                        label="Время проведения транзакции"
                        placeholder="Фильтр..."
                      />
                    </TableHead>
                    {corrAttributes.slice(0, 3).map((attr) => (
                      <TableHead key={attr.id}>
                        <FilterInput
                          value={filters[attr.id] || ""}
                          onChange={(newValue) => setFilters({...filters, [attr.id]: newValue})}
                          label={attr.name}
                          placeholder="Фильтр..."
                        />
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6 + corrAttributes.length} className="h-24 text-center">
                        Нет данных
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTransactions.map((transaction, index) => (
                      <TableRow
                        key={transaction.id}
                        className={`hover:bg-accent/50 ${index % 2 === 1 ? "bg-muted/50" : ""}`}
                      >
                        <TableCell>
                          <div className="relative cursor-pointer">
                            <Button className="cursor-pointer"
                                    onClick={() => router.push(`/transactions/${transaction.id}`)}>
                              <IdCard size={48}/>
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-s">
                          <FieldWithCopy textToCopy={transaction.id}/>
                        </TableCell>
                        <TableCell>{new Date(transaction.timestamp).toLocaleString("ru-RU")}</TableCell>
                        {corrAttributes.slice(0, 3).map((attr) => (
                          <TableCell key={attr.id} className="max-w-[200px] truncate">
                            {String(transaction[attr.id] ?? "-")}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </main>
        <AppFooter/>
      </div>
    </ProtectedRoute>
  )
}
