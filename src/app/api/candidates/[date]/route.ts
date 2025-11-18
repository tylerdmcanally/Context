import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function GET(
  req: Request,
  { params }: { params: { date: string } }
) {
  try {
    const { date } = params;
    
    const candidatesDoc = await adminDb
      .collection('storyCandidates')
      .doc(date)
      .get();
    
    if (!candidatesDoc.exists) {
      return NextResponse.json(
        { error: 'No candidates found for this date' },
        { status: 404 }
      );
    }
    
    const data = candidatesDoc.data();
    return NextResponse.json({
      success: true,
      candidates: data?.candidates || [],
      selectedCandidate: data?.selectedCandidate || null,
      generatedAt: data?.generatedAt,
    });
  } catch (error) {
    console.error('Failed to get candidates:', error);
    return NextResponse.json(
      { error: 'Failed to get candidates' },
      { status: 500 }
    );
  }
}

