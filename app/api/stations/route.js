import { NextResponse } from 'next/server';
import { findStation, POPULAR_STATIONS } from '@/lib/stations-data';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query) {
      // Return top 15 popular stations if no query
      return NextResponse.json({
        success: true,
        stations: POPULAR_STATIONS.slice(0, 15)
      });
    }

    const matches = findStation(query);
    return NextResponse.json({
      success: true,
      stations: matches.slice(0, 10)
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to search stations: ' + error.message },
      { status: 500 }
    );
  }
}
