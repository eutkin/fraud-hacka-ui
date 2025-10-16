import { NextResponse } from "next/server"

function generateRandomString(length: number) {
  return Math.random()
    .toString(36)
    .substring(2, length + 2)
}

function generateDPAN() {
  return `4532${Math.floor(Math.random() * 1000000000000)
    .toString()
    .padStart(12, "0")}`
}

function generateBankAccount() {
  return `40817810${Math.floor(Math.random() * 1000000000000)
    .toString()
    .padStart(12, "0")}`
}

const eventTypes = ["PAYMENT", "SESSION_SIGN"]
const channels = ["WEB", "MOBILE", "ISSUER", "ACQUIRER"]

const mockTransactions = Array.from({ length: 50 }, (_, i) => {
  const timestamp = new Date(Date.now() - Math.random() * 86400000).toISOString()

  return {
    id: `t${i}-${generateRandomString(8)}`,
    timestamp,
    "06aa77f7-57fb-44dc-b229-d5dac2a1d2bd": generateRandomString(16), // Клиентский ID транзакции
    "1a2b3c4d-5e6f-7g8h-9i0j-k1l2m3n4o5p6": eventTypes[Math.floor(Math.random() * eventTypes.length)], // Тип события
    "2b3c4d5e-6f7g-8h9i-0j1k-l2m3n4o5p6q7": channels[Math.floor(Math.random() * channels.length)], // Канал
    "3c4d5e6f-7g8h-9i0j-1k2l-m3n4o5p6q7r8": timestamp, // Время совершения транзакции
    "4d5e6f7g-8h9i-0j1k-2l3m-n4o5p6q7r8s9": Math.floor(Math.random() * 10000000), // Сумма транзакции (в копейках)
    "5e6f7g8h-9i0j-1k2l-3m4n-o5p6q7r8s9t0": generateDPAN(), // Идентификатор клиента (DPAN)
    "6f7g8h9i-0j1k-2l3m-4n5o-p6q7r8s9t0u1": generateBankAccount(), // Номер счета получателя
    "7g8h9i0j-1k2l-3m4n-5o6p-q7r8s9t0u1v2": generateRandomString(32), // Идентификатор устройства
  }
})

export async function GET() {
  return NextResponse.json(mockTransactions)
}
