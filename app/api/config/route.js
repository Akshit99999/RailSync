import { NextResponse } from 'next/server';
import { getActiveApiKey, setRuntimeApiKey } from '@/lib/railkit';

export async function GET() {
  const key = getActiveApiKey();
  const isConfigured = Boolean(key && key.length > 5);
  const maskedKey = isConfigured
    ? `${key.slice(0, 6)}••••••••${key.slice(-4)}`
    : null;

  return NextResponse.json({
    configured: isConfigured,
    maskedKey,
    mode: isConfigured ? 'RAILKIT_LIVE_MODE' : 'TELEMETRY_SIMULATOR_MODE'
  });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { apiKey } = body;

    if (!apiKey || typeof apiKey !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Valid API key string is required.' },
        { status: 400 }
      );
    }

    const trimmedKey = apiKey.trim();
    const success = setRuntimeApiKey(trimmedKey);

    return NextResponse.json({
      success,
      message: success ? 'RailKit API key activated for live session.' : 'Failed to configure API key.',
      mode: 'RAILKIT_LIVE_MODE'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
