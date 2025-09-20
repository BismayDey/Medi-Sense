import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    // Log the incoming request
    console.log('Incoming request headers:', req.headers);

    const body = await req.json().catch((err) => {
      console.error('JSON parse error:', err);
      throw new Error('Invalid JSON payload');
    });

    console.log('Request body:', body);

    if (!body.msg) {
      console.warn('Missing msg field in request');
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 },
      );
    }

    // Log before external API call
    console.log('Calling external API with message:', body.msg);

    const externalResponse = await fetch(
      'https://groq-chatbot-wsct.onrender.com/chat',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add any required API keys here
        },
        body: JSON.stringify({ msg: body.msg }),
      },
    );

    // Log the raw response
    const responseText = await externalResponse.text();
    console.log('External API response:', {
      status: externalResponse.status,
      headers: Object.fromEntries(externalResponse.headers.entries()),
      body: responseText,
    });

    if (!externalResponse.ok) {
      throw new Error(
        `External API error: ${externalResponse.status} ${externalResponse.statusText}`,
      );
    }

    // Try to parse JSON
    try {
      const data = JSON.parse(responseText);
      return NextResponse.json(data);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      throw new Error('Invalid JSON response from external API');
    }
  } catch (error: any) {
    console.error('FULL ERROR DETAILS:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      // Include any additional error properties
      ...error,
    });

    return NextResponse.json(
      {
        error: 'Internal Server Error',
        details:
          process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 },
    );
  }
}
