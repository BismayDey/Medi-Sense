import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 },
      );
    }

    const systemMessage = {
      role: 'system',
      content: `You are HealthAI, a friendly and supportive personal health assistant.
  Provide **brief and to-the-point** responses (1-3 sentences max).
  
  ## HealthTrack AI Assistance
  
  Welcome! I can assist you with:
  - **Health Tracking**: Get insights on your daily vitals, activity levels, sleep patterns, and nutrition.
  - **AI Diagnostics**: Check for early signs of skin diseases, diabetes risks, and heart conditions.
  - **Mental Health Support**: Talk to me for stress management, emotional well-being, and relaxation techniques.
  - **Emergency Assistance**: Need quick first aid guidance or emergency support? I'm here to help.
  - **Personalized Health Advice**: Get tailored recommendations on diet, exercise, and lifestyle improvements.
  - **Smart Entertainment & Meal Planning**: Let me suggest movies, music, or meal plans based on your mood and health needs.
  
  Your job is to give **concise** health tips, self-care advice, and encourage users to seek medical attention when needed.
  Be **warm, empathetic, and informative**, but avoid medical diagnoses or excessive details.

  **Always respond in English. Do not use any other language.** 

  If the user asks about specific topics, suggest visiting the relevant pages with relevant information:
  - **Skin Disease** → AI-Powered Diagnostics
  - **Mental Health** → Mental Health Support
  - **Emergency Help** → Emergency Assistance
  - **Entertainment** → AI-Powered Entertainment
  - **Meal Planning** → Smart Meal Planning

  Just type your concern, and I'll do my best to assist you!`,
    };

    const openRouterResponse = await fetch(
      `https://openrouter.ai/api/v1/chat/completions`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemma-3-1b-it:free',
          messages: [systemMessage, { role: 'user', content: message }],
          max_tokens: 100,
        }),
      },
    );

    if (!openRouterResponse.ok) {
      throw new Error(`OpenRouter API Error: ${openRouterResponse.statusText}`);
    }

    const data = await openRouterResponse.json();
    let reply =
      data.choices?.[0]?.message?.content ||
      "I'm here to help! Can you tell me more about your concern?";

    const keywordLinks: { [key: string]: string } = {
      'rash|acne|eczema|psoriasis|skin infection|itchy skin|skin disease':
        '/diagnostics',
      'stress|anxiety|depression|mental health|therapy|counseling|mood': '/AI',
      'emergency|urgent help|first aid|CPR|accident|choking|burn': '/emergency',
      'movie|music|entertainment|relax|bored|fun|watch|listen': '/msrecom',
      'diet|nutrition|meal plan|healthy food|what to eat|calories|recipe':
        '/meal',
    };

    for (const [keywords, link] of Object.entries(keywordLinks)) {
      const regex = new RegExp(`\\b(${keywords})\\b`, 'i');
      if (regex.test(message)) {
        reply += `\n\nFor more details, visit our page👉 **[Click Here](${link})**.`;
        break;
      }
    }

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 },
    );
  }
}
