import { Canvas } from '@/components/canvas';
import { Controls } from '@/components/controls';
import { Reasoning } from '@/components/reasoning';
import { SaveIndicator } from '@/components/save-indicator';
import { Toolbar } from '@/components/toolbar';
import { TopLeft } from '@/components/top-left';
import { TopRight } from '@/components/top-right';
import { currentUserProfile } from '@/lib/auth';
import { database } from '@/lib/database';
import { ProjectProvider } from '@/providers/project';
import { projects } from '@/schema';
import { eq } from 'drizzle-orm';
import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Tersa',
  description: 'Create and share AI workflows',
};

export const maxDuration = 800; // 13 minutes

type ProjectProps = {
  params: Promise<{
    projectId: string;
  }>;
};

const Project = async ({ params }: ProjectProps) => {
  const { projectId } = await params;
  const profile = await currentUserProfile();

  if (!profile) {
    return null;
  }

  if (!profile.onboardedAt) {
    return redirect('/welcome');
  }

  const project = await database.query.projects.findFirst({
    where: eq(projects.id, projectId),
  });

  if (!project) {
    notFound();
  }

  return (
    <div className="flex h-screen w-screen items-stretch overflow-hidden">
      <div className="relative flex-1">
        <ProjectProvider data={project}>
          <Canvas>
            <Controls />
            <Toolbar />
            <SaveIndicator />
          </Canvas>
        </ProjectProvider>
        <Suspense fallback={null}>
          <TopLeft id={projectId} />
        </Suspense>
        <Suspense fallback={null}>
          <TopRight id={projectId} />
        </Suspense>
      </div>
      <Reasoning />
    </div>
  );
};

export default Project;
