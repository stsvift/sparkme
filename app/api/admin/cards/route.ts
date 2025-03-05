import { NextResponse } from 'next/server'
import { getCards, createCard, updateCard, deleteCard } from '@/app/lib/data'

export async function GET() {
  try {
    const data = await getCards()
    return NextResponse.json(data || [])
  } catch (error) {
    console.error('Cards GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch cards' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json()
    console.log('Received data:', json) // Add this line
    
    if (!json.question || !json.theme_id) {
      return NextResponse.json(
        { error: 'Question and theme_id are required' }, 
        { status: 400 }
      )
    }

    const data = await createCard({
      question: json.question,
      hint: json.hint || null,
      theme_id: json.theme_id,
      used: false
    })

    console.log('Created card:', data) // Add this line
    return NextResponse.json(data)
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
    const data = await updateCard(id, updateData)
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

    await deleteCard(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Cards DELETE error:', error)
    return NextResponse.json({ error: 'Failed to delete card' }, { status: 500 })
  }
}