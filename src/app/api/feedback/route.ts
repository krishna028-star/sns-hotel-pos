import { NextResponse } from 'next/server';

// Placeholder for handling feedback
// In production, save this to your database or send via email/slack
export async function POST(request: Request) {
  try {
    const { category, message, user } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Example logging. Replace with DB insert or Notification API call.
    console.log('--- NEW FEEDBACK RECEIVED ---');
    console.log(`Category: ${category}`);
    console.log(`User: ${user || 'Anonymous'}`);
    console.log(`Message: ${message}`);
    console.log('-----------------------------');

    return NextResponse.json({ success: true, message: 'Feedback submitted successfully' }, { status: 201 });
  } catch (error) {
    console.error('Feedback submission error:', error);
    return NextResponse.json({ error: 'Failed to submit feedback' }, { status: 500 });
  }
}
