import { NextResponse } from 'next/server';
import { generateCandidates } from '@/lib/story/selector';
import { adminDb } from '@/lib/firebase-admin';
import { getTodayDateString } from '@/lib/utils/date';

export async function POST(req: Request) {
  try {
    const candidates = await generateCandidates();
    
    const today = getTodayDateString();
    await adminDb.collection('storyCandidates').doc(today).set({
      date: today,
      candidates,
      generatedAt: new Date(),
      selectedCandidate: null,
    }, { merge: true });
    
    return NextResponse.json({ success: true, candidates });
  } catch (error) {
    console.error('Failed to generate candidates:', error);
    return NextResponse.json(
      { error: 'Failed to generate candidates' },
      { status: 500 }
    );
  }
}

