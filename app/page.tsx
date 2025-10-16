"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { LoginForm } from "@/components/login-form"
import { useAuthStore } from "@/lib/store"

export default function HomePage() {
  const user = useAuthStore((state) => state.user)
  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.push("/attributes")
    }
  }, [user, router])

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <LoginForm />
    </div>
  )
}
