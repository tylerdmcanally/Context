import { BiasRating } from '@/types/story';

export interface RSSSource {
  name: string;
  url: string;
  bias: BiasRating;
  tier: number;
}

export const RSS_SOURCES: RSSSource[] = [
  // Tier 1: Wire Services (Center)
  {
    name: 'Reuters World',
    url: 'https://www.reuters.com/rssfeed/worldNews',
    bias: 'center',
    tier: 1
  },
  {
    name: 'Reuters US',
    url: 'https://www.reuters.com/rssfeed/domesticNews',
    bias: 'center',
    tier: 1
  },
  {
    name: 'AP Top News',
    url: 'https://apnews.com/apf-topnews',
    bias: 'center',
    tier: 1
  },
  
  // Tier 2: Major Outlets (Slight Left Lean)
  {
    name: 'BBC News',
    url: 'http://feeds.bbci.co.uk/news/rss.xml',
    bias: 'center',
    tier: 2
  },
  {
    name: 'NPR News',
    url: 'https://feeds.npr.org/1001/rss.xml',
    bias: 'lean-left',
    tier: 2
  },
  {
    name: 'Guardian US',
    url: 'https://www.theguardian.com/us-news/rss',
    bias: 'left',
    tier: 2
  },
  {
    name: 'NYT Homepage',
    url: 'https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml',
    bias: 'lean-left',
    tier: 2
  },
  
  // Tier 2: Major Outlets (Slight Right Lean)
  {
    name: 'WSJ World',
    url: 'https://feeds.a.dj.com/rss/RSSWorldNews.xml',
    bias: 'lean-right',
    tier: 2
  },
  {
    name: 'Fox News',
    url: 'http://feeds.foxnews.com/foxnews/politics',
    bias: 'right',
    tier: 2
  },
  
  // Tier 3: Political Coverage
  {
    name: 'Politico',
    url: 'https://www.politico.com/rss/politics08.xml',
    bias: 'center',
    tier: 3
  },
  {
    name: 'The Hill',
    url: 'https://thehill.com/rss/syndicator/19109',
    bias: 'center',
    tier: 3
  },
  
  // Tier 3: Analysis (Left)
  {
    name: 'The Atlantic',
    url: 'https://www.theatlantic.com/feed/all/',
    bias: 'lean-left',
    tier: 3
  },
  
  // Tier 3: Analysis (Right)
  {
    name: 'National Review',
    url: 'https://www.nationalreview.com/feed/',
    bias: 'right',
    tier: 3
  },
  
  // International
  {
    name: 'Al Jazeera',
    url: 'https://www.aljazeera.com/xml/rss/all.xml',
    bias: 'center',
    tier: 2
  },
];

