'use client';

import { Button } from '@/components/ui/button';
import { handleError } from '@/lib/error/handle';
import { socialProviders } from '@/lib/social';
import { useSignIn, type OAuthStrategy } from '@clerk/nextjs';
import { useState } from 'react';

export const SocialAuth = () => {
  const [isLoading, setIsLoading] = useState(false);

  const { signIn, isLoaded } = useSignIn();

  const handleSocialLogin = async (provider: OAuthStrategy) => {
    if (!isLoaded) return;
    setIsLoading(true);
    try {
      await signIn?.authenticateWithRedirect({
        strategy: provider,
        redirectUrl: '/auth/oauth',
        redirectUrlComplete: '/',
      });
    } catch (error: unknown) {
      handleError('Error logging in with social provider', error);
      setIsLoading(false);
    }
  };

  return (
    <div
      className="grid gap-3"
      style={{
        gridTemplateColumns: `repeat(${socialProviders.length}, 1fr)`,
      }}
    >
      {socialProviders.map((provider) => (
        <Button
          key={provider.id}
          variant="outline"
          className="border"
          size="lg"
          disabled={isLoading}
          onClick={() => handleSocialLogin(provider.id)}
        >
          <provider.icon size={16} />
          <span className="sr-only">Continue with {provider.name}</span>
        </Button>
      ))}
    </div>
  );
};
