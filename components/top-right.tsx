import { currentUserProfile } from '@/lib/auth';
import { database } from '@/lib/database';
import Link from 'next/link';
import { Suspense } from 'react';
import { CreditCounter } from './credits-counter';
import { Menu } from './menu';
import { Button } from './ui/button';

type TopRightProps = {
  id: string;
};

export const TopRight = async ({ id }: TopRightProps) => {
  const profile = await currentUserProfile();
  const project = await database.project.findUnique({
    where: { id },
  });

  if (!profile || !project) {
    return null;
  }

  return (
    <div className="absolute top-16 right-0 left-0 z-[50] m-4 flex items-center gap-2 sm:top-0 sm:left-auto">
      {profile.subscriptionId ? (
        <div className="flex items-center rounded-full border bg-card/90 p-3 drop-shadow-xs backdrop-blur-sm">
          <Suspense
            fallback={
              <p className="text-muted-foreground text-sm">Loading...</p>
            }
          >
            <CreditCounter />
          </Suspense>
        </div>
      ) : (
        <div className="flex items-center rounded-full border bg-card/90 p-0.5 drop-shadow-xs backdrop-blur-sm">
          <Button className="rounded-full" size="lg" asChild>
            <Link href="/pricing">Claim your free AI credits</Link>
          </Button>
        </div>
      )}
      <div className="flex items-center rounded-full border bg-card/90 p-1 drop-shadow-xs backdrop-blur-sm">
        <Menu />
      </div>
    </div>
  );
};
