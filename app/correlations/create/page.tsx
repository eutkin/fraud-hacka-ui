"use client"

import {useState} from "react"
import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query"
import {useRouter} from "next/navigation"
import {AppHeader} from "@/components/app-header"
import {AppFooter} from "@/components/app-footer"
import {ProtectedRoute} from "@/components/protected-route"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Label} from "@/components/ui/label"
import {Input} from "@/components/ui/input"
import {Button} from "@/components/ui/button"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {ConditionBuilder} from "@/components/condition-builder"
import {TimeWindowInput} from "@/components/time-window-input"
import {fetchAttributes, fetchCorrelationFunctions, createCorrelation} from "@/lib/api"
import type {ConditionNode} from "@/lib/types"
import {v4 as uuidv4} from "uuid"
import {ArrowLeft} from "lucide-react"

export default function CreateCorrelationPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [name, setName] = useState("")
  const [calculationFunction, setCalculationFunction] = useState("")
  const [corrAttribute, setCorrAttribute] = useState("")
  const [timeWindowSeconds, setTimeWindowSeconds] = useState(3600)
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

  const {data: attributes = []} = useQuery({
    queryKey: ["attributes"],
    queryFn: () => fetchAttributes(),
  })

  const {data: correlations = []} = useQuery({
    queryKey: ["attributes", "corr"],
    queryFn: () => fetchAttributes(true),
  })

  const {data: functions = []} = useQuery({
    queryKey: ["correlation-functions"],
    queryFn: fetchCorrelationFunctions,
  })

  const createMutation = useMutation({
    mutationFn: createCorrelation,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["correlations"]})
      router.push("/correlations")
    },
  })

  const handleSave = () => {
    createMutation.mutate({
      name,
      calculation_function: calculationFunction,
      corr_attribute: corrAttribute,
      time_window_seconds: timeWindowSeconds,
    })
  }

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen flex-col">
        <AppHeader/>
        <main className="flex-1 container py-6 max-w-4xl">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => router.push("/correlations")}>
                <ArrowLeft className="h-5 w-5"/>
              </Button>
              <h1 className="text-3xl font-bold">Создание Атрибута Корреляции</h1>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Функция корреляции</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-base">
                    Имя
                  </Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)}/>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="function" className="text-base">
                    Функция расчета
                  </Label>
                  <Select value={calculationFunction} onValueChange={setCalculationFunction}>
                    <SelectTrigger id="function">
                      <SelectValue placeholder="Выберите функцию"/>
                    </SelectTrigger>
                    <SelectContent>
                      {functions.map((func) => (
                        <SelectItem key={func.id} value={func.name}>
                          {func.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="corr-attr" className="text-base">
                    Атрибут Корреляции
                  </Label>
                  <Select value={corrAttribute} onValueChange={setCorrAttribute}>
                    <SelectTrigger id="corr-attr">
                      <SelectValue placeholder="Выберите атрибут"/>
                    </SelectTrigger>
                    <SelectContent>
                      {correlations.map((attr) => (
                        <SelectItem key={attr.id} value={attr.id}>
                          {attr.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-base">Исторический фильтр</Label>
                  <div className="mt-2">
                    <ConditionBuilder value={condition} onChange={setCondition} attributes={attributes}/>
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
                  <TimeWindowInput value={timeWindowSeconds} onChange={setTimeWindowSeconds}/>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button variant="outline" onClick={() => router.push("/correlations")}>
                Отменить
              </Button>
              <Button onClick={handleSave}>Сохранить</Button>
            </div>
          </div>
        </main>
        <AppFooter/>
      </div>
    </ProtectedRoute>
  )
}
