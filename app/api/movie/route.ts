import { NextRequest, NextResponse } from 'next/server';

async function fetchWithRetry(
  url: string,
  options: RequestInit,
  retries = 2,
): Promise<Response> {
  for (let i = 0; i <= retries; i++) {
    const res = await fetch(url, options);
    if (res.ok) return res;
    console.warn(`Attempt ${i + 1} failed: ${res.status}`);
    if (i < retries) await new Promise((r) => setTimeout(r, 1000)); // Wait 1s before retry
  }
  throw new Error('External API failed after retries');
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { mental_health, happiness, mood } = body;

    if (
      typeof mental_health !== 'number' ||
      typeof happiness !== 'number' ||
      typeof mood !== 'string'
    ) {
      console.error('Invalid request data:', body);
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 },
      );
    }

    const url =
      'https://song-movie-rec.onrender.com/recommendations';

    try {
      const externalRes = await fetchWithRetry(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mental_health, happiness, mood }),
      });

      const data = await externalRes.json();
      console.log('External API response:', data);

      return NextResponse.json(data);
    } catch (retryError) {
      console.error(
        'External API unreachable after retries. Returning fallback.',
      );
      // Return fallback data
      return NextResponse.json({
        songs: [
          {
            song_name: 'Mock Song A',
            genre: 'Pop',
            ytl: 'https://youtu.be/mock1',
          },
          {
            song_name: 'Mock Song B',
            genre: 'Indie',
            ytl: 'https://youtu.be/mock2',
          },
        ],
        movies: [
          {
            movie_name: 'Mock Movie A',
            genre: 'Comedy',
          },
          {
            movie_name: 'Mock Movie B',
            genre: 'Drama',
          },
        ],
      });
    }
  } catch (err) {
    console.error('Server error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
