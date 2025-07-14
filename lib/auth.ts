import { getCredits } from "@/app/actions/credits/get";
import { database } from "./database";
import { env } from "./env";
import { currentUser as clerkCurrentUser } from "@clerk/nextjs/server";

export const currentUser = async () => {
  return await clerkCurrentUser();
};

export const currentUserProfile = async () => {
  const user = await currentUser();

  if (!user) {
    throw new Error("User not found");
  }

  let userProfile = await database.profile.findUnique({
    where: { id: user.id },
  });

  if (!userProfile && user.email) {
    userProfile = await database.profile.create({
      data: { id: user.id },
    });
  }

  return userProfile;
};

export const getSubscribedUser = async () => {
  const user = await currentUser();

  if (!user) {
    throw new Error("Create an account to use AI features.");
  }

  const profile = await currentUserProfile();

  if (!profile) {
    throw new Error("User profile not found");
  }

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

  return user;
};
