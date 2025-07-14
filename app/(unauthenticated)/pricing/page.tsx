import { currentUserProfile } from "@/lib/auth";
import { env } from "@/lib/env";
import type { Metadata } from "next";
import { Hero } from "./components/hero";
import { auth, clerkClient, redirectToSignIn } from "@clerk/nextjs/server";

export const metadata: Metadata = {
  title: "Tersa | Pricing",
  description: "Choose a plan to get access to all features.",
};

const PricingPage = async () => {
  const { userId } = await auth(); // ✅ safe use of headers() in the right context
  if (!userId) return redirectToSignIn();

  const user = await clerkClient.users.getUser(userId);
  let currentPlan: "hobby" | "pro" | undefined;

  if (user) {
    const profile = await currentUserProfile();

    if (profile) {
      if (profile.productId === env.STRIPE_HOBBY_PRODUCT_ID) {
        currentPlan = "hobby";
      } else if (profile.productId === env.STRIPE_PRO_PRODUCT_ID) {
        currentPlan = "pro";
      }
    }
  }

  return <Hero currentPlan={currentPlan} authenticated={Boolean(user)} />;
};

export default PricingPage;
