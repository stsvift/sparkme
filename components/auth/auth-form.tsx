
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { signIn, signUp } from "@/app/lib/actions/auth"

export function AuthForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (isSignUp) {
        await signUp(email, password)
        toast({
          title: "Регистрация успешна",
          description: "Проверьте вашу почту для подтверждения аккаунта",
        })
      } else {
        await signIn(email, password)
        router.refresh()
        router.push("/")
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: isSignUp ? "Не удалось зарегистрироваться" : "Неверный email или пароль",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="p-6 w-full max-w-sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            required
          />
          <Input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            required
          />
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Загрузка..." : isSignUp ? "Зарегистрироваться" : "Войти"}
        </Button>
        <Button
          type="button"
          variant="link"
          className="w-full"
          onClick={() => setIsSignUp(!isSignUp)}
          disabled={isLoading}
        >
          {isSignUp ? "Уже есть аккаунт? Войти" : "Нет аккаунта? Зарегистрироваться"}
        </Button>
      </form>
    </Card>
  )
}