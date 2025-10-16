"use client"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface TimeWindowInputProps {
  value: number // Value in seconds
  onChange: (seconds: number) => void
  readOnly?: boolean
}

export function TimeWindowInput({ value, onChange, readOnly = false }: TimeWindowInputProps) {
  // Convert seconds to appropriate unit
  const getDisplayValue = () => {
    if (value % 86400 === 0) return { value: value / 86400, unit: "days" }
    if (value % 3600 === 0) return { value: value / 3600, unit: "hours" }
    if (value % 60 === 0) return { value: value / 60, unit: "minutes" }
    return { value, unit: "seconds" }
  }

  const { value: displayValue, unit } = getDisplayValue()

  const handleValueChange = (newValue: string) => {
    const num = Number.parseInt(newValue) || 0
    const multiplier = unit === "days" ? 86400 : unit === "hours" ? 3600 : unit === "minutes" ? 60 : 1
    onChange(num * multiplier)
  }

  const handleUnitChange = (newUnit: string) => {
    const currentValue = displayValue
    const multiplier = newUnit === "days" ? 86400 : newUnit === "hours" ? 3600 : newUnit === "minutes" ? 60 : 1
    onChange(currentValue * multiplier)
  }

  return (
    <div className="flex gap-2 items-end">
      <div className="space-y-4">
        <Label>От текущего события</Label>
        <Input className="w-32"
          type="number"
          min="0"
          value={displayValue}
          onChange={(e) => handleValueChange(e.target.value)}
          disabled={readOnly}
        />
      </div>
      <Select value={unit} onValueChange={handleUnitChange} disabled={readOnly}>
        <SelectTrigger className="w-[140px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="seconds">Секунды</SelectItem>
          <SelectItem value="minutes">Минуты</SelectItem>
          <SelectItem value="hours">Часы</SelectItem>
          <SelectItem value="days">Дни</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
