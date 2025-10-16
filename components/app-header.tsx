"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAuthStore } from "@/lib/store"
import { LogOut } from "lucide-react"

const menuItems = [
  { href: "/attributes", label: "Атрибуты" },
  { href: "/correlations", label: "Корреляция" },
  { href: "/rules", label: "Правила" },
  { href: "/transactions", label: "Транзакции" },
]

export function AppHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <nav className="flex flex-1 items-center gap-2">
          {menuItems.map((item) => (
            <Button
              key={item.href}
              variant={pathname.startsWith(item.href) ? "default" : "ghost"}
              size="sm"
              asChild
              className="font-medium"
            >
              <Link href={item.href}>{item.label}</Link>
            </Button>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          {user && <span className="text-sm text-muted-foreground mr-2">{user.username}</span>}
          <ThemeToggle />
          {user && (
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              <span className="sr-only">Выйти</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
