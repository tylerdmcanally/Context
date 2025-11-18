import { NextResponse } from 'next/server';
import { adminDb } from './firebase-admin';

/**
 * Standard API error response
 */
export function apiError(message: string, status: number = 500) {
  return NextResponse.json(
    { success: false, error: message },
    { status }
  );
}

/**
 * Standard API success response
 */
export function apiSuccess<T>(data?: T) {
  return NextResponse.json({ success: true, ...(data && { data }) });
}

/**
 * Validate required fields in request body
 */
export function validateBody<T extends Record<string, any>>(
  body: any,
  requiredFields: (keyof T)[]
): { valid: false; error: NextResponse } | { valid: true; data: T } {
  const missing = requiredFields.filter(field => !body[field]);
  
  if (missing.length > 0) {
    return {
      valid: false,
      error: apiError(`Missing required fields: ${missing.join(', ')}`, 400)
    };
  }
  
  return { valid: true, data: body as T };
}

/**
 * Get user document from Firestore
 */
export async function getUserDoc(userId: string) {
  const userDoc = await adminDb.collection('users').doc(userId).get();
  if (!userDoc.exists) {
    return null;
  }
  return { id: userDoc.id, ...userDoc.data() };
}
