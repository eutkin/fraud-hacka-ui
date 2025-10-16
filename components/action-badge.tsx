import { CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface ActionBadgeProps {
  action: "ALLOW" | "DENY" | "REVIEW"
}

export function ActionBadge({ action }: ActionBadgeProps) {
  const config = {
    ALLOW: {
      icon: CheckCircle,
      label: "Разрешить",
      className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    },
    DENY: {
      icon: XCircle,
      label: "Запретить",
      className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    },
    REVIEW: {
      icon: AlertCircle,
      label: "Проверить",
      className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    },
  }

  const { icon: Icon, label, className } = config[action]

  return (
    <Badge variant="outline" className={className}>
      <Icon className="h-4 w-4 mr-1" />
      {label}
    </Badge>
  )
}
