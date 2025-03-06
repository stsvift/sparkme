import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const themeId = searchParams.get('themeId')

    if (themeId) {
      const cards = await prisma.card.findMany({
        where: { theme_id: themeId },
        include: { theme: true },
      })
      return NextResponse.json(cards)
    }

    const cards = await prisma.card.findMany({
      include: { theme: true },
    })
    return NextResponse.json(cards)
  } catch (error) {
    console.error('Cards GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch cards' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json()
    console.log('Received card data:', json)

    if (!json.question || !json.theme_id || !json.hint) {
      return NextResponse.json(
        { error: 'Question, hint and theme_id are required' }, 
        { status: 400 }
      )
    }

    const card = await prisma.card.create({
      data: {
        question: json.question,
        hint: json.hint,
        theme_id: json.theme_id,
        used: false
      },
      include: {
        theme: true
      }
    })

    console.log('Created card:', card)
    return NextResponse.json(card)
  } catch (error: any) {
    console.error('Cards POST error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create card' }, 
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const json = await request.json()
    const { id, ...updateData } = json
    const data = await prisma.card.update({
      where: { id },
      data: updateData
    })
    return NextResponse.json(data)
  } catch (error) {
    console.error('Cards PUT error:', error)
    return NextResponse.json(
      { error: 'Failed to update card' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    await prisma.card.delete({
      where: { id }
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Cards DELETE error:', error)
    return NextResponse.json({ error: 'Failed to delete card' }, { status: 500 })
  }
}