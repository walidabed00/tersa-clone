"use server";

import { database } from "@/lib/database";
import { parseError } from "@/lib/error/parse";
import { auth, clerkClient, redirectToSignIn } from "@clerk/nextjs/server";
import type { Prisma } from "@prisma/client";

export const updateProfileAction = async (
  userId: string,
  data: Prisma.ProfileUpdateInput
): Promise<
  | {
      success: true;
    }
  | {
      error: string;
    }
> => {
  try {
    const { userId } = await auth(); // ✅ safe use of headers() in the right context
    if (!userId) return redirectToSignIn();

    const user = await clerkClient.users.getUser(userId);

    if (!user) {
      throw new Error("You need to be logged in to update your profile!");
    }

    await database.profile.update({
      where: { id: userId },
      data,
    });

    return { success: true };
  } catch (error) {
    const message = parseError(error);

    return { error: message };
  }
};
