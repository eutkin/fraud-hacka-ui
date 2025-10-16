import { render, screen, fireEvent } from "@testing-library/react"
import { DataTable, type Column } from "@/components/data-table"
import { jest } from "@jest/globals" // Added import for jest

interface TestData {
  id: string
  name: string
  value: number
}

const mockData: TestData[] = [
  { id: "1", name: "Item 1", value: 100 },
  { id: "2", name: "Item 2", value: 200 },
  { id: "3", name: "Item 3", value: 150 },
]

const columns: Column<TestData>[] = [
  { key: "id", label: "ID" },
  { key: "name", label: "Name", sortable: true },
  { key: "value", label: "Value", sortable: true },
]

describe("DataTable", () => {
  it("should render table with data", () => {
    render(<DataTable data={mockData} columns={columns} />)

    expect(screen.getByText("Item 1")).toBeInTheDocument()
    expect(screen.getByText("Item 2")).toBeInTheDocument()
    expect(screen.getByText("Item 3")).toBeInTheDocument()
  })

  it("should render empty state when no data", () => {
    render(<DataTable data={[]} columns={columns} />)
    expect(screen.getByText("Нет данных")).toBeInTheDocument()
  })

  it("should apply zebra striping when enabled", () => {
    const { container } = render(<DataTable data={mockData} columns={columns} zebra />)
    const rows = container.querySelectorAll("tbody tr")

    expect(rows[1]).toHaveClass("bg-muted/50")
  })

  it("should call onRowClick when row is clicked", () => {
    const handleRowClick = jest.fn()
    render(<DataTable data={mockData} columns={columns} onRowClick={handleRowClick} />)

    const firstRow = screen.getByText("Item 1").closest("tr")
    if (firstRow) {
      fireEvent.click(firstRow)
      expect(handleRowClick).toHaveBeenCalledWith(mockData[0])
    }
  })

  it("should sort data when sortable column header is clicked", () => {
    render(<DataTable data={mockData} columns={columns} />)

    const nameHeader = screen.getByText("Name").closest("button")
    if (nameHeader) {
      fireEvent.click(nameHeader)

      const rows = screen.getAllByRole("row")
      expect(rows[1]).toHaveTextContent("Item 1")
    }
  })
})
