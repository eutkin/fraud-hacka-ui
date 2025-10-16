import {NextResponse} from "next/server"
import {v4 as uuidv4} from "uuid";

const mockRules = [
  {
    id: "r1a2b3c4-d5e6-f7g8-h9i0-j1k2l3m4n5o6",
    name: "Блокировка подозрительных транзакций",
    priority: 1,
    recommended_action: "DENY",
    condition: {
      type: "node",
      id: "root1",
      logic: "AND",
      children: [
        {
          type: "leaf",
          id: "leaf1",
          left: ":Сумма транзакции:",
          operator: ">",
          right: "10000",
        },
        {
          type: "leaf",
          id: "leaf2",
          left: ":Канал:",
          operator: "=",
          right: '"WEB"',
        },
      ],
    },
  },
  {
    id: "r2b3c4d5-e6f7-g8h9-i0j1-k2l3m4n5o6p7",
    name: "Проверка множественных попыток",
    priority: 2,
    recommended_action: "REVIEW",
    condition: {
      type: "node",
      id: "root2",
      logic: "OR",
      children: [
        {
          type: "leaf",
          id: "leaf3",
          left: ":Количество попыток:",
          operator: ">",
          right: "5",
        },
        {
          type: "leaf",
          id: "leaf4",
          left: ":Тип события:",
          operator: "=",
          right: '"FAILED_LOGIN"',
        },
      ],
    },
  },
  {
    id: "r3c4d5e6-f7g8-h9i0-j1k2-l3m4n5o6p7q8",
    name: "Разрешение стандартных операций",
    priority: 3,
    recommended_action: "ALLOW",
    condition: {
      type: "node",
      id: "root3",
      logic: "AND",
      children: [
        {
          type: "leaf",
          id: "leaf5",
          left: ":Сумма транзакции:",
          operator: "<",
          right: "1000",
        },
      ],
    },
  },
]

export async function GET() {
  return NextResponse.json(mockRules)
}

export async function POST(request: Request) {
  const body = await request.json()
  const newId = uuidv4()
  mockRules.push({
    id: newId,
    ...body
  })
  return NextResponse.json({success: true, id: newId})
}
