"use server";

import { database } from "@/lib/database";
import { parseError } from "@/lib/error/parse";
import { transcriptionModels } from "@/lib/models/transcription";
import { visionModels } from "@/lib/models/vision";

const defaultTranscriptionModel = Object.entries(transcriptionModels).find(
  ([_, model]) => model.default
);

const defaultVisionModel = Object.entries(visionModels).find(
  ([_, model]) => model.default
);

if (!defaultTranscriptionModel) {
  throw new Error("No default transcription model found");
}

if (!defaultVisionModel) {
  throw new Error("No default vision model found");
}

export const createProjectAction = async (
  userId: string,
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
    const project = await database.project.create({
      data: {
        name,
        userId,
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
