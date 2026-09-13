import { NextResponse } from 'next/server';
import { getStationLiveBoard } from '@/lib/railkit';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const station = searchParams.get('station');
    const hours = parseInt(searchParams.get('hours') || '2', 10);
    const customApiKey = request.headers.get('x-railkit-api-key') || searchParams.get('apiKey') || '';

    if (!station) {
      return NextResponse.json(
        { success: false, error: 'Station code is required (e.g. NDLS, CSMT, HWH).' },
        { status: 400 }
      );
    }

    const result = await getStationLiveBoard(station, hours, customApiKey);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Station board query failed: ' + error.message },
      { status: 500 }
    );
  }
}
