'use server';

import { currentUser } from '@/lib/auth';
import { database } from '@/lib/database';
import { parseError } from '@/lib/error/parse';

export const deleteProjectAction = async (
  projectId: string
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
      throw new Error('You need to be logged in to delete a project!');
    }

    const result = await database.project.deleteMany({
      where: { id: projectId, userId: user.id },
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
