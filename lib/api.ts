import type { Attribute, Correlation, CorrelationFunction, Rule, Transaction } from "./types"

const API_BASE = "/api/v1"

export async function fetchAttributes(corrOnly?: boolean): Promise<Attribute[]> {
  const url = corrOnly ? `${API_BASE}/attributes?corr=true` : `${API_BASE}/attributes`
  const response = await fetch(url)
  if (!response.ok) throw new Error("Failed to fetch attributes")
  return response.json()
}

export async function fetchCorrelations(): Promise<Correlation[]> {
  const response = await fetch(`${API_BASE}/correlations`)
  if (!response.ok) throw new Error("Failed to fetch correlation attributes")
  return response.json()
}

export async function deleteCorrelation(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/correlations/${id}`, {
    method: "DELETE",
  })
  if (!response.ok) throw new Error("Failed to delete correlation attribute")
}

export async function createCorrelation(data: Omit<Correlation, "id">): Promise<void> {
  const response = await fetch(`${API_BASE}/correlations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error("Failed to create correlation attribute")
}

export async function fetchCorrelationFunctions(): Promise<CorrelationFunction[]> {
  const response = await fetch(`${API_BASE}/correlation_functions`)
  if (!response.ok) throw new Error("Failed to fetch correlation functions")
  return response.json()
}

export async function fetchRules(): Promise<Rule[]> {
  const response = await fetch(`${API_BASE}/rules`)
  if (!response.ok) throw new Error("Failed to fetch rules")
  return response.json()
}

export async function deleteRule(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/rules/${id}`, {
    method: "DELETE",
  })
  if (!response.ok) throw new Error("Failed to delete rule")
}

export async function createRule(data: Omit<Rule, "id">): Promise<void> {
  const response = await fetch(`${API_BASE}/rules`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error("Failed to create rule")
}

export async function fetchTransactions(): Promise<Transaction[]> {
  const response = await fetch(`${API_BASE}/transactions`)
  if (!response.ok) throw new Error("Failed to fetch transactions")
  return response.json()
}
