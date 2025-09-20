import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file');

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  try {
    const response = await fetch(
      'https://api-skin-disease-identifier.onrender.com/predict',
      {
        method: 'POST',
        body: formData,
      },
    );

    if (!response.ok) {
      throw new Error('External API request failed');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in /api/skin:', error);
    return NextResponse.json(
      { error: 'Failed to fetch skin disease data' },
      { status: 500 },
    );
  }
}
