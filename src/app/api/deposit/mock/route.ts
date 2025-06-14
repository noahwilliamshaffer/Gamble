import { NextRequest, NextResponse } from 'next/server';
import { createMockDepositHistory } from '@/lib/userUtils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    await createMockDepositHistory(userId);

    return NextResponse.json(
      { 
        success: true, 
        message: 'Mock deposit history created successfully'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error creating mock deposits:', error);
    return NextResponse.json(
      { error: 'Failed to create mock deposit history' },
      { status: 500 }
    );
  }
} 