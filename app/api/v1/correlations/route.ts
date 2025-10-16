import { NextResponse } from "next/server"
import {v4 as uuidv4} from "uuid"

const mockCorrelations = [
  {
    id: "c1a2b3c4-d5e6-f7g8-h9i0-j1k2l3m4n5o6",
    name: "Количество транзакций за час",
    calculation_function: "COUNT",
    corr_attribute: "5e6f7g8h-9i0j-1k2l-3m4n-o5p6q7r8s9t0", // Идентификатор клиента
    time_window_seconds: 3600,
  },
  {
    id: "c2b3c4d5-e6f7-g8h9-i0j1-k2l3m4n5o6p7",
    name: "Средняя сумма за день",
    calculation_function: "AVG",
    corr_attribute: "6f7g8h9i-0j1k-2l3m-4n5o-p6q7r8s9t0u1", // Номер счета получателя
    time_window_seconds: 86400,
  },
  {
    id: "c3c4d5e6-f7g8-h9i0-j1k2-l3m4n5o6p7q8",
    name: "Максимальная сумма",
    calculation_function: "MAX",
    corr_attribute: "7g8h9i0j-1k2l-3m4n-5o6p-q7r8s9t0u1v2", // Идентификатор устройства
    time_window_seconds: 7200,
  },
]

export async function GET() {
  return NextResponse.json(mockCorrelations)
}

export async function POST(request: Request) {
  const body = await request.json()
  const newId = uuidv4()
  mockCorrelations.push({ id: newId,
    ...body})
  console.log("Create new correlations", {id : newId, ...body})
  return NextResponse.json({ success: true, id: newId })
}
