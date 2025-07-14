import { createProjectAction } from "@/app/actions/project/create";
import { database } from "@/lib/database";
import { ProjectProvider } from "@/providers/project";
import type { Metadata } from "next";
import { WelcomeDemo } from "./components/welcome-demo";
import { getAuthData } from "@/lib/auth-utils";
import { redirectToSignIn } from "@clerk/nextjs";

const title = "Welcome to Tersa!";
const description =
  "Tersa is a platform for creating and sharing AI-powered projects. Let's get started by creating a flow, together.";

export const metadata: Metadata = {
  title,
  description,
};

const Welcome = async () => {
  const { userId, user } = await getAuthData(); // Use centralized auth helper

  if (!userId) return redirectToSignIn();

  let welcomeProject = await database.project.findFirst({
    where: { userId: user.id, welcomeProject: true },
  });

  if (!welcomeProject) {
    const response = await createProjectAction(userId, "Welcome", true);

    if ("error" in response) {
      return <div>Error: {response.error}</div>;
    }

    const project = await database.project.findUnique({
      where: { id: response.id },
    });

    welcomeProject = project;
  }

  if (!welcomeProject) {
    throw new Error("Failed to create welcome project");
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
