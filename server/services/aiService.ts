import { generateText, streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';
import { google } from '@ai-sdk/google';

export interface ChatContext {
  appId: number;
  appName: string;
  files: any;
}

export interface StreamOptions {
  message: string;
  appContext: ChatContext;
  onChunk: (chunk: string) => Promise<void>;
  onComplete: (response: string) => Promise<void>;
  onError: (error: Error) => Promise<void>;
}

export async function streamChatResponse(options: StreamOptions) {
  const { message, appContext, onChunk, onComplete, onError } = options;
  
  try {
    // Get the system prompt (simplified version of the original)
    const systemPrompt = getSystemPrompt(appContext);
    
    // Choose AI provider based on environment
    const provider = getAIProvider();
    
    const result = await streamText({
      model: provider,
      system: systemPrompt,
      prompt: message,
      maxTokens: 4000,
    });
    
    let fullResponse = '';
    
    for await (const delta of result.textStream) {
      fullResponse += delta;
      await onChunk(delta);
    }
    
    await onComplete(fullResponse);
  } catch (error) {
    await onError(error instanceof Error ? error : new Error('Unknown error'));
  }
}

function getAIProvider() {
  // Use OpenAI by default, fallback to others
  const apiKey = process.env.OPENAI_API_KEY;
  if (apiKey) {
    return openai('gpt-4o-mini');
  }
  
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  if (anthropicKey) {
    return anthropic('claude-3-5-sonnet-20241022');
  }
  
  const googleKey = process.env.GOOGLE_API_KEY;
  if (googleKey) {
    return google('gemini-1.5-flash');
  }
  
  throw new Error('No AI provider API key configured');
}

function getSystemPrompt(appContext: ChatContext): string {
  return `You are Dyad, an AI assistant that helps build web applications. You can create, modify, and manage React/TypeScript applications.

Current App Context:
- App Name: ${appContext.appName}
- App ID: ${appContext.appId}

You can respond with special tags to modify the application:

<dyad-write path="path/to/file.tsx">
// File content here
</dyad-write>

<dyad-delete path="path/to/file.tsx">
</dyad-delete>

<dyad-rename path="old/path.tsx" newPath="new/path.tsx">
</dyad-rename>

Always respond in a helpful, clear manner and use these tags when you need to create or modify application files.`;
}
