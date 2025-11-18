export async function fetchArticleContent(url: string): Promise<string | null> {
  try {
    // Use a simple fetch approach - in production, you might want to use a service
    // like Mercury Web Parser or similar for better article extraction
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ContextBot/1.0)',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }
    
    const html = await response.text();
    
    // Basic content extraction - in production, use a proper HTML parser
    // This is a simplified version that extracts text from common article containers
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Try to find article content in common containers
    const article = doc.querySelector('article') || 
                   doc.querySelector('[role="article"]') ||
                   doc.querySelector('.article-content') ||
                   doc.querySelector('.post-content') ||
                   doc.querySelector('main');
    
    if (article) {
      // Remove script and style elements
      const scripts = article.querySelectorAll('script, style');
      scripts.forEach(el => el.remove());
      
      return article.textContent || article.innerText || '';
    }
    
    // Fallback: return body text
    const body = doc.body;
    if (body) {
      const scripts = body.querySelectorAll('script, style, nav, header, footer');
      scripts.forEach(el => el.remove());
      return body.textContent || body.innerText || '';
    }
    
    return null;
    
  } catch (error) {
    console.error(`Failed to fetch content for ${url}:`, error);
    return null;
  }
}

export async function fetchMultipleArticles(urls: string[]): Promise<Map<string, string>> {
  const contentMap = new Map<string, string>();
  
  // Fetch in parallel with rate limiting
  const batchSize = 5;
  for (let i = 0; i < urls.length; i += batchSize) {
    const batch = urls.slice(i, i + batchSize);
    
    const promises = batch.map(async (url) => {
      const content = await fetchArticleContent(url);
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

// Server-side version for Node.js environments (Cloud Functions)
export async function fetchArticleContentServer(url: string): Promise<string | null> {
  try {
    // For server-side, we'll need to use a different approach
    // This is a placeholder - you might want to use a service like Mercury Web Parser API
    // or implement proper HTML parsing with cheerio or similar
    
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
    // In production, use a proper HTML parser
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

