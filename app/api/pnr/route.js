import { NextResponse } from 'next/server';
import { getPNRDetails } from '@/lib/railkit';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const pnr = searchParams.get('pnr');

    if (!pnr) {
      return NextResponse.json(
        { success: false, error: '10-digit PNR number is required.' },
        { status: 400 }
      );
    }

    const result = await getPNRDetails(pnr);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'PNR query failed: ' + error.message },
      { status: 500 }
    );
  }
}
