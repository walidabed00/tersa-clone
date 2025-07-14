import { currentUserProfile } from "@/lib/auth";
import { env } from "@/lib/env";
import { PostHogIdentifyProvider } from "@/providers/posthog-provider";
import {
  type SubscriptionContextType,
  SubscriptionProvider,
} from "@/providers/subscription";
import { auth, clerkClient, redirectToSignIn } from "@clerk/nextjs/server";
import { ReactFlowProvider } from "@xyflow/react";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

type AuthenticatedLayoutProps = {
  children: ReactNode;
};

const AuthenticatedLayout = async ({ children }: AuthenticatedLayoutProps) => {
  const { userId } = await auth(); // ✅ safe use of headers() in the right context
  if (!userId) return redirectToSignIn();

  const user = await clerkClient.users.getUser(userId);

  const profile = await currentUserProfile();

  if (!profile) {
    return null;
  }

  let plan: SubscriptionContextType["plan"];

  if (profile.productId === env.STRIPE_HOBBY_PRODUCT_ID) {
    plan = "hobby";
  } else if (profile.productId === env.STRIPE_PRO_PRODUCT_ID) {
    plan = "pro";
  }

  return (
    <SubscriptionProvider
      isSubscribed={Boolean(profile.subscriptionId)}
      plan={plan}
    >
      <PostHogIdentifyProvider>
        <ReactFlowProvider>{children}</ReactFlowProvider>
      </PostHogIdentifyProvider>
    </SubscriptionProvider>
  );
};

export default AuthenticatedLayout;
