// lib/auth-utils.ts
import { clerkClient } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server"; // Use server import

export const getAuthData = async () => {
  const { userId } = await auth(); // ✅ Await here
  if (!userId) return { userId: null, user: null };

  const user = await clerkClient.users.getUser(userId);
  return { userId, user };
};
