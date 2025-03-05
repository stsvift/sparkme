import { AuthForm } from "@/components/auth/auth-form"
import { PageHeader } from "@/components/page-header"

export default function LoginPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Вход в систему"
        description="Войдите в свой аккаунт или создайте новый"
        backLink="/"
        backLinkText="На главную"
      />
      
      <div className="flex justify-center mt-8">
        <AuthForm />
      </div>
    </div>
  )
}
