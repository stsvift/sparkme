"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ThemeManager } from "@/components/admin/theme-manager"
import { CardManager } from "@/components/admin/card-manager"

export function AdminTabs() {
  const [activeTab, setActiveTab] = useState("themes")

  return (
    <Tabs defaultValue="themes" value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-2 mb-8">
        <TabsTrigger value="themes">Темы</TabsTrigger>
        <TabsTrigger value="cards">Карточки</TabsTrigger>
      </TabsList>
      <TabsContent value="themes">
        <ThemeManager />
      </TabsContent>
      <TabsContent value="cards">
        <CardManager />
      </TabsContent>
    </Tabs>
  )
}

