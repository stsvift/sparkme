import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import type { Theme } from '@/lib/types'

const dataFilePath = path.join(process.cwd(), 'data', 'themes.json')

async function getJsonData() {
  const jsonData = await fs.readFile(dataFilePath, 'utf8')
  return JSON.parse(jsonData)
}

async function saveJsonData(data: any) {
  await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2))
}

export async function GET() {
  const data = await getJsonData()
  return NextResponse.json(data.themes)
}

export async function POST(request: Request) {
  const data = await getJsonData()
  const theme = await request.json()
  
  const newTheme = {
    id: Date.now().toString(),
    ...theme
  }
  
  data.themes.push(newTheme)
  await saveJsonData(data)
  
  return NextResponse.json(newTheme)
}

export async function PUT(request: Request) {
  const data = await getJsonData()
  const { id, ...updateData } = await request.json()
  
  const themeIndex = data.themes.findIndex((t: Theme) => t.id === id)
  if (themeIndex === -1) {
    return new NextResponse('Theme not found', { status: 404 })
  }
  
  data.themes[themeIndex] = { ...data.themes[themeIndex], ...updateData }
  await saveJsonData(data)
  
  return NextResponse.json(data.themes[themeIndex])
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  
  if (!id) {
    return new NextResponse('ID is required', { status: 400 })
  }
  
  const data = await getJsonData()
  data.themes = data.themes.filter((t: Theme) => t.id !== id)
  await saveJsonData(data)
  
  return new NextResponse(null, { status: 204 })
}
