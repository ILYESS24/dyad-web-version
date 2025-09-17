import { useQuery } from "@tanstack/react-query";
import { IpcClient } from "@/ipc/ipc_client";
import type { LanguageModel } from "@/ipc/ipc_types";
import { isWeb } from "@/utils/environment";

/**
 * Fetches all available language models grouped by their provider IDs.
 *
 * @returns TanStack Query result object for the language models organized by provider.
 */
export function useLanguageModelsByProviders() {
  const ipcClient = IpcClient.getInstance();

  return useQuery<Record<string, LanguageModel[]>, Error>({
    queryKey: ["language-models-by-providers"],
    queryFn: async () => {
      try {
        return await ipcClient.getLanguageModelsByProviders();
      } catch (error) {
        // ALWAYS return mock models in browser environment - FORCE IT!
        const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';
        if (isBrowser) {
          console.log('Using mock language models in web environment due to API error');
          return {
            openai: [
              {
                id: 'gpt-4o',
                name: 'GPT-4o',
                description: 'Most capable model with vision capabilities',
                maxTokens: 128000,
                costPerToken: 0.00003,
                contextWindow: 128000,
                supportsImages: true,
                supportsFunctionCalling: true,
                providerId: 'openai',
                modelType: 'chat' as const,
                isLocal: false,
              },
              {
                id: 'gpt-4o-mini',
                name: 'GPT-4o Mini',
                description: 'Faster and more affordable GPT-4o',
                maxTokens: 128000,
                costPerToken: 0.0000015,
                contextWindow: 128000,
                supportsImages: true,
                supportsFunctionCalling: true,
                providerId: 'openai',
                modelType: 'chat' as const,
                isLocal: false,
              },
              {
                id: 'gpt-3.5-turbo',
                name: 'GPT-3.5 Turbo',
                description: 'Fast and efficient model',
                maxTokens: 4096,
                costPerToken: 0.000002,
                contextWindow: 4096,
                supportsImages: false,
                supportsFunctionCalling: true,
                providerId: 'openai',
                modelType: 'chat' as const,
                isLocal: false,
              },
            ],
            anthropic: [
              {
                id: 'claude-3-5-sonnet-20241022',
                name: 'Claude 3.5 Sonnet',
                description: 'Most capable Claude model',
                maxTokens: 8192,
                costPerToken: 0.000015,
                contextWindow: 200000,
                supportsImages: true,
                supportsFunctionCalling: true,
                providerId: 'anthropic',
                modelType: 'chat' as const,
                isLocal: false,
              },
              {
                id: 'claude-3-haiku-20240307',
                name: 'Claude 3 Haiku',
                description: 'Fast and lightweight Claude model',
                maxTokens: 4096,
                costPerToken: 0.000001,
                contextWindow: 200000,
                supportsImages: true,
                supportsFunctionCalling: true,
                providerId: 'anthropic',
                modelType: 'chat' as const,
                isLocal: false,
              },
            ],
            google: [
              {
                id: 'gemini-1.5-flash',
                name: 'Gemini 1.5 Flash',
                description: 'Fast and efficient Google model',
                maxTokens: 8192,
                costPerToken: 0.00000075,
                contextWindow: 1000000,
                supportsImages: true,
                supportsFunctionCalling: true,
                providerId: 'google',
                modelType: 'chat' as const,
                isLocal: false,
              },
              {
                id: 'gemini-1.5-pro',
                name: 'Gemini 1.5 Pro',
                description: 'Most capable Google model',
                maxTokens: 8192,
                costPerToken: 0.0000035,
                contextWindow: 2000000,
                supportsImages: true,
                supportsFunctionCalling: true,
                providerId: 'google',
                modelType: 'chat' as const,
                isLocal: false,
              },
            ],
          };
        }
        throw error;
      }
    },
  });
}
