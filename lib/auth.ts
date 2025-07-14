// lib/auth.ts
import { database } from "./database";
import { env } from "./env";
import { getCredits } from "@/app/actions/credits/get";
import { auth } from "@clerk/nextjs/server"; // Use server import

export const currentUserProfile = async () => {
  const { userId } = await auth();
  if (!userId) return null;

  let userProfile = await database.profile.findUnique({
    where: { id: userId },
  });

  if (!userProfile) {
    userProfile = await database.profile.create({
      data: { id: userId },
    });
  }

  return userProfile;
};

export const getSubscribedUser = async () => {
  const { userId } = await auth();
  if (!userId) throw new Error("Create an account to use AI features.");

  const profile = await currentUserProfile();
  if (!profile) throw new Error("User profile not found");
  if (!profile.subscriptionId) {
    throw new Error("Claim your free AI credits to use this feature.");
  }

  const credits = await getCredits();

  if ("error" in credits) {
    throw new Error(credits.error);
  }

  if (
    profile.productId === env.STRIPE_HOBBY_PRODUCT_ID &&
    credits.credits <= 0
  ) {
    throw new Error(
      "Sorry, you have no credits remaining! Please upgrade for more credits."
    );
  }

  return profile;
};
