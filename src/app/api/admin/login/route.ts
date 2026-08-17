import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { signAdminToken, setAdminSessionCookie } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    const admin = await prisma.adminUser.findUnique({
      where: { username },
    });

    let isValid = false;
    let adminPayload = { username: 'admin', id: 'admin-1', name: 'System Admin' };

    if (admin) {
      isValid = await bcrypt.compare(password, admin.passwordHash);
      if (isValid) {
        adminPayload = { username: admin.username, id: admin.id, name: admin.name };
      }
    } else if (
      username === (process.env.ADMIN_USERNAME || 'admin') &&
      password === (process.env.ADMIN_PASSWORD || 'admin123')
    ) {
      isValid = true;
    }

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    const token = await signAdminToken(adminPayload);
    await setAdminSessionCookie(token);

    return NextResponse.json({
      success: true,
      message: 'Logged in successfully',
      user: adminPayload,
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
