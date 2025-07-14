import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { auth, clerkClient, redirectToSignIn } from "@clerk/nextjs/server";
import Link from "next/link";

export const Header = async () => {
  const { userId } = await auth();
  if (!userId) return redirectToSignIn();

  const user = await clerkClient.users.getUser(userId);

  return (
    <header className="flex items-center justify-between px-8">
      <Link href="/" className="flex items-center gap-2">
        <Logo className="h-6 w-auto" />
        <span className="font-medium text-xl tracking-tight">Tersa</span>
      </Link>
      <div className="flex items-center gap-2">
        <Button variant="link" asChild className="text-muted-foreground">
          <Link href="/pricing">Pricing</Link>
        </Button>
        {user ? (
          <Button variant="outline" asChild>
            <Link href="/">Go to app</Link>
          </Button>
        ) : (
          <>
            <Button variant="outline" asChild>
              <Link href="/auth/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/sign-up">Sign up</Link>
            </Button>
          </>
        )}
      </div>
    </header>
  );
};
