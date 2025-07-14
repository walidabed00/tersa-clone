import { SiGithub, SiX } from '@icons-pack/react-simple-icons';
import type { OAuthStrategy } from '@clerk/nextjs';

export const socialProviders: {
  name: string;
  icon: typeof SiGithub;
  id: OAuthStrategy;
}[] = [
  {
    name: 'Github',
    icon: SiGithub,
    id: 'oauth_github',
  },
  {
    name: 'Twitter',
    icon: SiX,
    id: 'oauth_twitter',
  },
];
