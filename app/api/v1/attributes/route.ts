import { NextResponse } from "next/server"

const mockAttributes = [
  {
    id: "06aa77f7-57fb-44dc-b229-d5dac2a1d2bd",
    name: "Клиентский ID транзакции",
    type: "string",
    corr: false,
    group: "Остальное",
  },
  {
    id: "1a2b3c4d-5e6f-7g8h-9i0j-k1l2m3n4o5p6",
    name: "Тип события",
    type: "string",
    corr: false,
    group: "Остальное",
  },
  {
    id: "2b3c4d5e-6f7g-8h9i-0j1k-l2m3n4o5p6q7",
    name: "Канал",
    type: "string",
    corr: false,
    group: "Остальное",
  },
  {
    id: "3c4d5e6f-7g8h-9i0j-1k2l-m3n4o5p6q7r8",
    name: "Время совершения транзакции",
    type: "string",
    corr: false,
    group: "Остальное",
  },
  {
    id: "4d5e6f7g-8h9i-0j1k-2l3m-n4o5p6q7r8s9",
    name: "Сумма транзакции",
    type: "int",
    corr: false,
    group: "Остальное",
  },
  {
    id: "5e6f7g8h-9i0j-1k2l-3m4n-o5p6q7r8s9t0",
    name: "Идентификатор клиента",
    type: "string",
    corr: true,
    group: "О клиенте",
  },
  {
    id: "6f7g8h9i-0j1k-2l3m-4n5o-p6q7r8s9t0u1",
    name: "Номер счета получателя",
    type: "string",
    corr: true,
    group: "О получателе",
  },
  {
    id: "7g8h9i0j-1k2l-3m4n-5o6p-q7r8s9t0u1v2",
    name: "Идентификатор устройства",
    type: "string",
    corr: true,
    group: "Об устройстве",
  },
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const corrOnly = searchParams.get("corr") === "true"

  const filtered = corrOnly ? mockAttributes.filter((attr) => attr.corr) : mockAttributes

  return NextResponse.json(filtered)
}
