import { useQuery } from "@tanstack/react-query";
import { IpcClient } from "@/ipc/ipc_client";
import type { LanguageModelProvider } from "@/ipc/ipc_types";
import { useSettings } from "./useSettings";
import { cloudProviders } from "@/lib/schemas";
import { isWeb } from "@/utils/environment";

export function useLanguageModelProviders() {
  const ipcClient = IpcClient.getInstance();
  const { settings, envVars } = useSettings();

  const queryResult = useQuery<LanguageModelProvider[], Error>({
    queryKey: ["languageModelProviders"],
    queryFn: async () => {
      try {
        return await ipcClient.getLanguageModelProviders();
      } catch (error) {
        // ALWAYS return mock providers in browser environment - FORCE IT!
        const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';
        if (isBrowser) {
          console.log('Using mock language model providers in web environment due to API error');
          return [
            {
              id: 'openai',
              name: 'OpenAI',
              hasFreeTier: false,
              websiteUrl: 'https://openai.com',
              gatewayPrefix: 'openai',
              type: 'cloud' as const,
              envVarName: 'OPENAI_API_KEY',
            },
            {
              id: 'anthropic',
              name: 'Anthropic',
              hasFreeTier: false,
              websiteUrl: 'https://anthropic.com',
              gatewayPrefix: 'anthropic',
              type: 'cloud' as const,
              envVarName: 'ANTHROPIC_API_KEY',
            },
            {
              id: 'google',
              name: 'Google',
              hasFreeTier: true,
              websiteUrl: 'https://ai.google.dev',
              gatewayPrefix: 'google',
              type: 'cloud' as const,
              envVarName: 'GOOGLE_API_KEY',
            },
          ];
        }
        throw error;
      }
    },
  });

  const isProviderSetup = (provider: string) => {
    const providerSettings = settings?.providerSettings[provider];
    if (queryResult.isLoading) {
      return false;
    }
    if (providerSettings?.apiKey?.value) {
      return true;
    }
    const providerData = queryResult.data?.find((p) => p.id === provider);
    if (providerData?.envVarName && envVars[providerData.envVarName]) {
      return true;
    }
    return false;
  };

  const isAnyProviderSetup = () => {
    // In web environment, always consider providers as setup to avoid blocking UI
    if (isWeb()) {
      return true;
    }
    return cloudProviders.some((provider) => isProviderSetup(provider));
  };

  return {
    ...queryResult,
    isProviderSetup,
    isAnyProviderSetup,
  };
}
