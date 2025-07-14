'use server';

import { currentUser } from '@/lib/auth';
import { database } from '@/lib/database';
import { parseError } from '@/lib/error/parse';
import type { Prisma } from '@prisma/client';

export const updateProjectAction = async (
  projectId: string,
  data: Prisma.ProjectUpdateInput
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
      throw new Error('You need to be logged in to update a project!');
    }

    const result = await database.project.updateMany({
      where: { id: projectId, userId: user.id },
      data: { ...data, updatedAt: new Date() },
    });

    if (result.count === 0) {
      throw new Error('Project not found');
    }

    return { success: true };
  } catch (error) {
    const message = parseError(error);

    return { error: message };
  }
};
