"use client"

import Avvvatars from "avvvatars-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { signOut } from "@/app/lib/actions/auth"
import { useRouter } from "next/navigation"

interface UserProfileProps {
  user: {
    email: string;
    name?: string;
    avatarStyle?: string;
    avatarShape?: string;
    avatarDisplayValue?: string;
    avatarCustomText?: string;
  }
}

export function UserProfile({ user }: UserProfileProps) {
  const router = useRouter()

  const getAvatarValue = () => {
    switch (user.avatarDisplayValue) {
      case "name":
        return user.name || user.email
      case "custom":
        return user.avatarCustomText || user.email
      default:
        return user.email
    }
  }

  const handleSignOut = async () => {
    await signOut()
    router.refresh()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0">
          <Avvvatars 
            value={getAvatarValue()}
            style={user.avatarStyle || "character"}
            size={32}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => router.push("/profile")}>
          Профиль
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSignOut}>
          Выйти
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
