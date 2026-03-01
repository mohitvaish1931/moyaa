import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Chat from '@/models/Chat';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { userId, message } = body;

    // Validate input
    if (!userId || !message || message.trim() === '') {
      return NextResponse.json(
        { error: 'User ID and message are required' },
        { status: 400 }
      );
    }

    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Create and save chat message
    const chat = new Chat({
      userId,
      userName: user.name,
      userEmail: user.email,
      message: message.trim(),
      type: 'user',
    });

    await chat.save();

    return NextResponse.json(
      {
        success: true,
        chat,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Retrieve chat messages for the user
    const messages = await Chat.find({ userId })
      .sort({ createdAt: -1 })
      .populate('userId', 'email name');

    return NextResponse.json({
      success: true,
      messages,
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
