import { NextResponse } from "next/server"

const mockFunctions = [
  { id: "f1", name: "COUNT" },
  { id: "f2", name: "SUM" },
  { id: "f3", name: "AVG" },
  { id: "f4", name: "MAX" },
  { id: "f5", name: "MIN" },
]

export async function GET() {
  return NextResponse.json(mockFunctions)
}
