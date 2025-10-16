"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { login, storeUser } from "@/lib/auth"
import { useAuthStore } from "@/lib/store"

export function LoginForm() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()
  const setUser = useAuthStore((state) => state.setUser)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const user = login(username, password)
    if (user) {
      storeUser(user)
      setUser(user)
      router.push("/attributes")
    } else {
      setError("Неверное имя пользователя или пароль")
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Вход в систему</CardTitle>
        <CardDescription>Антифрод система</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Имя пользователя</Label>
            <Input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Пароль</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full">
            Войти
          </Button>
        </form>
        <div className="mt-4 text-sm text-muted-foreground">
          <p>Тестовые данные:</p>
          <p>Логин: testuser</p>
          <p>Пароль: testpass123</p>
        </div>
      </CardContent>
    </Card>
  )
}
