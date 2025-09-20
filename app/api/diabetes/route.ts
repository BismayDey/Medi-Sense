import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const apiData = await req.json();

  try {
    const response = await fetch(
      'https://api-for-diabetes-and-heart-disease.onrender.com/predict/diabetes',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData),
      },
    );

    if (!response.ok) {
      throw new Error('External API request failed');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in /api/diabetes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch diabetes data' },
      { status: 500 },
    );
  }
}
