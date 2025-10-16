import { fetchAttributes, fetchCorrelations, fetchRules, fetchTransactions } from "@/lib/api"
import jest from "jest"

global.fetch = jest.fn()

describe("API functions", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("fetchAttributes", () => {
    it("should fetch all attributes", async () => {
      const mockAttributes = [{ id: "1", name: "Attr 1", type: "string", corr: true }]
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockAttributes,
      })

      const result = await fetchAttributes()
      expect(result).toEqual(mockAttributes)
      expect(global.fetch).toHaveBeenCalledWith("/api/v1/attributes")
    })

    it("should fetch correlation attributes only", async () => {
      const mockAttributes = [{ id: "1", name: "Attr 1", type: "string", corr: true }]
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockAttributes,
      })

      const result = await fetchAttributes(true)
      expect(result).toEqual(mockAttributes)
      expect(global.fetch).toHaveBeenCalledWith("/api/v1/attributes?corr=true")
    })

    it("should throw error on failed fetch", async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
      })

      await expect(fetchAttributes()).rejects.toThrow("Failed to fetch attributes")
    })
  })

  describe("fetchCorrelationAttributes", () => {
    it("should fetch correlation attributes", async () => {
      const mockData = [{ id: "1", name: "Corr 1", calculation_function: "COUNT", corr_attribute: true }]
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      })

      const result = await fetchCorrelations()
      expect(result).toEqual(mockData)
      expect(global.fetch).toHaveBeenCalledWith("/api/v1/corr_attributes")
    })
  })

  describe("fetchRules", () => {
    it("should fetch rules", async () => {
      const mockRules = [
        {
          id: "1",
          name: "Rule 1",
          priority: 1,
          recommended_action: "ALLOW",
          condition: { type: "node", id: "root", logic: "AND", children: [] },
        },
      ]
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockRules,
      })

      const result = await fetchRules()
      expect(result).toEqual(mockRules)
      expect(global.fetch).toHaveBeenCalledWith("/api/v1/rules")
    })
  })

  describe("fetchTransactions", () => {
    it("should fetch transactions", async () => {
      const mockTransactions = [{ id: "1", timestamp: "2025-01-16T10:00:00Z" }]
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockTransactions,
      })

      const result = await fetchTransactions()
      expect(result).toEqual(mockTransactions)
      expect(global.fetch).toHaveBeenCalledWith("/api/v1/transactions")
    })
  })
})
