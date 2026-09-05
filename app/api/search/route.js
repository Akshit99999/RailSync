import { NextResponse } from 'next/server';
import { findTrainsBetween } from '@/lib/railkit';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    const date = searchParams.get('date') || '';

    if (!from || !to) {
      return NextResponse.json(
        { success: false, error: 'Please specify both source (from) and destination (to) station codes.' },
        { status: 400 }
      );
    }

    const result = await findTrainsBetween(from, to, date);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Train search failed: ' + error.message },
      { status: 500 }
    );
  }
}
