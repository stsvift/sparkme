import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  const themes = await prisma.theme.findMany()
  return NextResponse.json(themes)
}

export async function POST(request: Request) {
  const theme = await request.json()
  const newTheme = await prisma.theme.create({
    data: theme
  })
  return NextResponse.json(newTheme)
}

export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  
  if (!id) {
    return new NextResponse('ID is required', { status: 400 })
  }

  const updateData = await request.json()
  
  try {
    const updatedTheme = await prisma.theme.update({
      where: { id },
      data: updateData
    })
    
    return NextResponse.json(updatedTheme)
  } catch (error) {
    console.error('Error updating theme:', error)
    return new NextResponse('Failed to update theme', { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  
  if (!id) {
    return new NextResponse('ID is required', { status: 400 })
  }
  
  await prisma.theme.delete({
    where: { id }
  })
  
  return new NextResponse(null, { status: 204 })
}
