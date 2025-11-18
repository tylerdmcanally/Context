// Server-side article fetcher for use in API routes and Cloud Functions
// This version doesn't rely on browser APIs like DOMParser

export async function fetchArticleContentServer(url: string): Promise<string | null> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ContextBot/1.0)',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }
    
    const html = await response.text();
    
    // Basic regex-based extraction (simplified)
    // In production, use a proper HTML parser like cheerio or a service like Mercury Web Parser
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    if (bodyMatch) {
      const body = bodyMatch[1];
      // Remove script and style tags
      const cleaned = body
        .replace(/<script[\s\S]*?<\/script>/gi, '')
        .replace(/<style[\s\S]*?<\/style>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      
      return cleaned;
    }
    
    return null;
    
  } catch (error) {
    console.error(`Failed to fetch content for ${url}:`, error);
    return null;
  }
}

export async function fetchMultipleArticlesServer(urls: string[]): Promise<Map<string, string>> {
  const contentMap = new Map<string, string>();
  
  // Fetch in parallel with rate limiting
  const batchSize = 5;
  for (let i = 0; i < urls.length; i += batchSize) {
    const batch = urls.slice(i, i + batchSize);
    
    const promises = batch.map(async (url) => {
      const content = await fetchArticleContentServer(url);
      if (content) {
        contentMap.set(url, content);
      }
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    });
    
    await Promise.all(promises);
  }
  
  return contentMap;
}

