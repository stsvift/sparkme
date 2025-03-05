import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  const { username, password } = body;

  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    // Устанавливаем cookie с более длительным сроком действия
    cookies().set('admin-session', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 дней
    });

    return NextResponse.json({ success: true });
  }

  return NextResponse.json(
    { success: false, message: 'Invalid credentials' },
    { status: 401 }
  );
}
