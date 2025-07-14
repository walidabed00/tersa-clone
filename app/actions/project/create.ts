'use server';

import { currentUser } from '@/lib/auth';
import { database } from '@/lib/database';
import { parseError } from '@/lib/error/parse';
import { transcriptionModels } from '@/lib/models/transcription';
import { visionModels } from '@/lib/models/vision';

const defaultTranscriptionModel = Object.entries(transcriptionModels).find(
  ([_, model]) => model.default
);

const defaultVisionModel = Object.entries(visionModels).find(
  ([_, model]) => model.default
);

if (!defaultTranscriptionModel) {
  throw new Error('No default transcription model found');
}

if (!defaultVisionModel) {
  throw new Error('No default vision model found');
}

export const createProjectAction = async (
  name: string,
  welcomeProject?: boolean
): Promise<
  | {
      id: string;
    }
  | {
      error: string;
    }
> => {
  try {
    const user = await currentUser();

    if (!user) {
      throw new Error('You need to be logged in to create a project!');
    }

    const project = await database.project.create({
      data: {
        name,
        userId: user.id,
        transcriptionModel: defaultTranscriptionModel[0],
        visionModel: defaultVisionModel[0],
        welcomeProject,
      },
      select: { id: true },
    });

    return { id: project.id };
  } catch (error) {
    const message = parseError(error);

    return { error: message };
  }
};
