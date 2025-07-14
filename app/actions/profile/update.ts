'use server';

import { currentUser } from '@/lib/auth';
import { database } from '@/lib/database';
import { parseError } from '@/lib/error/parse';
import type { Prisma } from '@prisma/client';

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
    const user = await currentUser();

    if (!user) {
      throw new Error('You need to be logged in to update your profile!');
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
