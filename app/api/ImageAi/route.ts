import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 },
      );
    }

    const buffer = await file.arrayBuffer();
    const base64Image = Buffer.from(buffer).toString('base64');

    const openai = new OpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: process.env.OPENROUTER_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      model: 'meta-llama/llama-4-maverick:free',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'What is in this image? Describe it in detail.',
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/${
                  file.type.split('/')[1]
                };base64,${base64Image}`,
              },
            },
          ],
        },
      ],
    });
    console.log(completion);
    return NextResponse.json({ result: completion.choices[0].message.content });
  } catch (error) {
    console.error('Error processing image:', error);
    return NextResponse.json(
      { error: 'Failed to process image' },
      { status: 500 },
    );
  }
}
