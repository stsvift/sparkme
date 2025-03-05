import Link from "next/link"
import { Button } from "@/components/ui/button"

interface PageHeaderProps {
  title: string
  description?: string
  backLink?: string
  backLinkText?: string
}

export function PageHeader({ title, description, backLink, backLinkText }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 pb-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">{title}</h1>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
      </div>

      {backLink && (
        <Button variant="link" className="px-0" asChild>
          <Link href={backLink}>← {backLinkText || "Назад"}</Link>
        </Button>
      )}
    </div>
  )
}

