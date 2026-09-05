import { NextResponse } from 'next/server';
import { trackTrainLive } from '@/lib/railkit';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const trainNumber = searchParams.get('train');
    const date = searchParams.get('date') || 'today';

    if (!trainNumber) {
      return NextResponse.json(
        { success: false, error: 'Train number is required (5 digits, e.g. 12952).' },
        { status: 400 }
      );
    }

    const result = await trackTrainLive(trainNumber, date);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Live tracking request failed: ' + error.message },
      { status: 500 }
    );
  }
}
