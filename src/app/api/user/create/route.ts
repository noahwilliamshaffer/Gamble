import { NextRequest, NextResponse } from 'next/server';
import { createUserRecord } from '@/lib/userUtils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { uid, email, phoneNumber, displayName } = body;

    if (!uid) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const user = await createUserRecord(uid, email, phoneNumber, displayName);

    return NextResponse.json(
      { 
        success: true, 
        user: {
          uid: user.uid,
          email: user.email,
          phoneNumber: user.phoneNumber,
          displayName: user.displayName,
          bitcoinAddress: user.bitcoinAddress,
          ethereumAddress: user.ethereumAddress,
          createdAt: user.createdAt,
          lastLoginAt: user.lastLoginAt
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user record' },
      { status: 500 }
    );
  }
} 