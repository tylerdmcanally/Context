export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function validateStoryContent(content: string): { valid: boolean; error?: string } {
  if (!content || content.trim().length === 0) {
    return { valid: false, error: 'Story content cannot be empty' };
  }
  
  const wordCount = content.trim().split(/\s+/).length;
  
  if (wordCount < 1000) {
    return { valid: false, error: 'Story must be at least 1000 words' };
  }
  
  if (wordCount > 5000) {
    return { valid: false, error: 'Story cannot exceed 5000 words' };
  }
  
  return { valid: true };
}

export function validateBookmarkNote(note: string): { valid: boolean; error?: string } {
  if (note.length > 100) {
    return { valid: false, error: 'Bookmark note cannot exceed 100 characters' };
  }
  
  return { valid: true };
}

