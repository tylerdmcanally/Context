import { RSS_SOURCES } from '@/config/rss-sources';
import { BiasRating } from '@/types/story';

export function getSourceByName(name: string) {
  return RSS_SOURCES.find(source => source.name === name);
}

export function getSourcesByBias(bias: BiasRating) {
  return RSS_SOURCES.filter(source => source.bias === bias);
}

export function getSourcesByTier(tier: number) {
  return RSS_SOURCES.filter(source => source.tier === tier);
}

export function getAllSources() {
  return RSS_SOURCES;
}

export function getBiasDistribution(sources: typeof RSS_SOURCES) {
  const distribution = {
    left: 0,
    'lean-left': 0,
    center: 0,
    'lean-right': 0,
    right: 0,
  };
  
  sources.forEach(source => {
    distribution[source.bias]++;
  });
  
  return distribution;
}

