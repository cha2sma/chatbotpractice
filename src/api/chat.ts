import type { ChatResponse } from '../types';

/**
 * Sends a user message to the backend chat API and returns the response.
 * The backend endpoint is expected to handle the OpenAI request.
 */
export async function fetchChat(message: string): Promise<ChatResponse> {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Chat API error: ${response.status} ${error}`);
  }

  const data = (await response.json()) as ChatResponse;
  return data;
}
