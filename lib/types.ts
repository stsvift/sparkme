export interface Theme {
  id: string
  name: string
  emoji: string
  description: string | null
  gradient_class: string
  created_at?: string
}

export interface Card {
  id: string
  question: string
  hint: string
  theme_id: string
  used: boolean
  created_at?: string
}

export interface User {
  id: string
  email: string
  isAdmin: boolean
  created_at: string
}

