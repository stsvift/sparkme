import { ThemeGrid } from "@/components/theme-grid"
import { PageHeader } from "@/components/page-header"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader title="sparkme!" description="Выберите тему для увлекательной беседы" />
      <ThemeGrid />
    </div>
  )
}

