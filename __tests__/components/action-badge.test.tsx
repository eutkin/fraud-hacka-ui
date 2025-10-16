import { render, screen } from "@testing-library/react"
import { ActionBadge } from "@/components/action-badge"

describe("ActionBadge", () => {
  it("should render ALLOW badge correctly", () => {
    render(<ActionBadge action="ALLOW" />)
    expect(screen.getByText("Разрешить")).toBeInTheDocument()
  })

  it("should render DENY badge correctly", () => {
    render(<ActionBadge action="DENY" />)
    expect(screen.getByText("Запретить")).toBeInTheDocument()
  })

  it("should render REVIEW badge correctly", () => {
    render(<ActionBadge action="REVIEW" />)
    expect(screen.getByText("Проверить")).toBeInTheDocument()
  })
})
