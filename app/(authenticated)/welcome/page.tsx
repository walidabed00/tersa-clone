import { createProjectAction } from '@/app/actions/project/create';
import { currentUser } from '@/lib/auth';
import { database } from '@/lib/database';
import { ProjectProvider } from '@/providers/project';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { WelcomeDemo } from './components/welcome-demo';

const title = 'Welcome to Tersa!';
const description =
  "Tersa is a platform for creating and sharing AI-powered projects. Let's get started by creating a flow, together.";

export const metadata: Metadata = {
  title,
  description,
};

const Welcome = async () => {
  const user = await currentUser();

  if (!user) {
    return redirect('/sign-in');
  }

  let welcomeProject = await database.project.findFirst({
    where: { userId: user.id, welcomeProject: true },
  });

  if (!welcomeProject) {
    const response = await createProjectAction('Welcome', true);

    if ('error' in response) {
      return <div>Error: {response.error}</div>;
    }

    const project = await database.project.findUnique({
      where: { id: response.id },
    });

    welcomeProject = project;
  }

  if (!welcomeProject) {
    throw new Error('Failed to create welcome project');
  }

  return (
    <div className="flex flex-col gap-4">
      <ProjectProvider data={welcomeProject}>
        <WelcomeDemo title={title} description={description} />
      </ProjectProvider>
    </div>
  );
};

export default Welcome;
