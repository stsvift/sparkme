import { cn } from "@/lib/utils"

interface ResponsiveContainerProps {
  children: React.ReactNode
  className?: string
  fullWidth?: boolean
}

export function ResponsiveContainer({
  children,
  className,
  fullWidth = false,
}: ResponsiveContainerProps) {
  return (
    <div
      className={cn(
        "w-full px-4 sm:px-6 lg:px-8",
        !fullWidth && "container mx-auto max-w-7xl",
        className
      )}
    >
      {children}
    </div>
  )
}
