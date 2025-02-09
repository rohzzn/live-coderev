import fetch from 'node-fetch';

const AI_API_KEY = process.env.AI_API_KEY || '';
const AI_API_ENDPOINT = process.env.AI_API_ENDPOINT || '';

export async function getAiSuggestions(codeSnippet: string): Promise<string> {
  if (!codeSnippet || !AI_API_ENDPOINT) {
    return 'AI service not configured or no code selected.';
  }

  const prompt = `Suggest improvements or highlight issues in the following code:\n\n${codeSnippet}\n`;

  const response = await fetch(AI_API_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${AI_API_KEY}`
    },
    body: JSON.stringify({
      prompt,
      // The exact request shape depends on your chosen AI API
    })
  });

  if (!response.ok) {
    throw new Error(`AI request failed: ${response.statusText}`);
  }

  const data = await response.json();
  // The response format depends on your AI service
  return data.result || 'No suggestions found.';
}
