import Anthropic from '@anthropic-ai/sdk';
import { buildStoryPrompt, buildCandidateSummaryPrompt } from './prompts';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function generateStory(
  articles: Array<{ title: string; source: string; content: string; bias: string }>,
  headline: string
): Promise<string> {
  const prompt = buildStoryPrompt(articles, headline);
  
  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4000,
    messages: [
      { role: 'user', content: prompt }
    ],
  });
  
  return message.content[0].type === 'text' ? message.content[0].text : '';
}

export async function generateCandidateSummary(
  articles: Array<{ title: string; source: string; bias: string }>
): Promise<string> {
  const prompt = buildCandidateSummaryPrompt(articles);
  
  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 800,
    messages: [
      { role: 'user', content: prompt }
    ],
  });
  
  return message.content[0].type === 'text' ? message.content[0].text : '';
}

