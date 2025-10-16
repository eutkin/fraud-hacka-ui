export interface Attribute {
  id: string
  name: string
  type: "string" | "int" | "float"
  corr: boolean
  group: "О клиенте" | "Об устройстве" | "О карте" | "О получателе" | "Остальное"
}

export interface Correlation {
  id: string
  name: string
  calculation_function: string
  corr_attribute: string // Changed from boolean to string (UUID of attribute)
  time_window_seconds?: number // Added time window field
}

export interface CorrelationFunction {
  id: string
  name: string
}

export interface Rule {
  id: string
  name: string
  priority: number
  recommended_action: "ALLOW" | "DENY" | "REVIEW"
  condition: ConditionNode
}

export type ConditionNode = {
  type: "node"
  id: string
  logic: "AND" | "OR"
  children: (ConditionNode | ConditionLeaf)[]
}

export type ConditionLeaf = {
  type: "leaf"
  id: string
  left: string
  operator: ">" | "<" | "=" | "!="
  right: string
}

export type Transaction = {
  id: string
  timestamp: string
  [key: string]: string | number
}
