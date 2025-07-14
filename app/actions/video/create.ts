'use server';

import { getSubscribedUser } from '@/lib/auth';
import { database } from '@/lib/database';
import { parseError } from '@/lib/error/parse';
import { videoModels } from '@/lib/models/video';
import { trackCreditUsage } from '@/lib/stripe';
import { uploadFile } from '@/lib/upload';
import type { Edge, Node, Viewport } from '@xyflow/react';
import { nanoid } from 'nanoid';

type GenerateVideoActionProps = {
  modelId: string;
  prompt: string;
  images: {
    url: string;
    type: string;
  }[];
  nodeId: string;
  projectId: string;
};

export const generateVideoAction = async ({
  modelId,
  prompt,
  images,
  nodeId,
  projectId,
}: GenerateVideoActionProps): Promise<
  | {
      nodeData: object;
    }
  | {
      error: string;
    }
> => {
  try {
    const user = await getSubscribedUser();
    const model = videoModels[modelId];

    if (!model) {
      throw new Error('Model not found');
    }

    const provider = model.providers[0];

    let firstFrameImage = images.at(0)?.url;

    if (firstFrameImage && process.env.NODE_ENV !== 'production') {
      const response = await fetch(firstFrameImage);
      const blob = await response.blob();
      const uint8Array = new Uint8Array(await blob.arrayBuffer());
      const base64 = Buffer.from(uint8Array).toString('base64');

      firstFrameImage = `data:${images.at(0)?.type};base64,${base64}`;
    }

    const url = await provider.model.generate({
      prompt,
      imagePrompt: firstFrameImage,
      duration: 5,
      aspectRatio: '16:9',
    });

    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();

    await trackCreditUsage({
      action: 'generate_video',
      cost: provider.getCost({ duration: 5 }),
    });

    const downloadUrl = await uploadFile(
      user.id,
      new File([arrayBuffer], `${nanoid()}.mp4`, { type: 'video/mp4' })
    );

    const project = await database.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new Error('Project not found');
    }

    const content = project.content as {
      nodes: Node[];
      edges: Edge[];
      viewport: Viewport;
    };

    const existingNode = content.nodes.find((n) => n.id === nodeId);

    if (!existingNode) {
      throw new Error('Node not found');
    }

    const newData = {
      ...(existingNode.data ?? {}),
      updatedAt: new Date().toISOString(),
      generated: {
        url: downloadUrl,
        type: 'video/mp4',
      },
    };

    const updatedNodes = content.nodes.map((existingNode) => {
      if (existingNode.id === nodeId) {
        return {
          ...existingNode,
          data: newData,
        };
      }

      return existingNode;
    });

    await database.project.update({
      where: { id: projectId },
      data: { content: { ...content, nodes: updatedNodes } },
    });

    return {
      nodeData: newData,
    };
  } catch (error) {
    const message = parseError(error);

    return { error: message };
  }
};
