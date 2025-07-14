import { createProjectAction } from "@/app/actions/project/create";
import { currentUserProfile } from "@/lib/auth";
import { getAuthData } from "@/lib/auth-utils";
import { database } from "@/lib/database";
import { auth, clerkClient, redirectToSignIn } from "@clerk/nextjs/server";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Tersa",
  description: "Create and share AI workflows",
};

export const maxDuration = 800; // 13 minutes

const Projects = async () => {
  const { userId } = await getAuthData(); // Use centralized helper
  if (!userId) return redirectToSignIn();

  const user = await clerkClient.users.getUser(userId);

  const profile = await currentUserProfile();

  if (!profile?.onboardedAt) {
    return redirect("/welcome");
  }

  let project = await database.project.findFirst({
    where: { userId: profile.id },
  });

  if (!project) {
    const newProject = await createProjectAction(userId, "Untitled Project");

    if ("error" in newProject) {
      throw new Error(newProject.error);
    }

    const newFetchedProject = await database.project.findUnique({
      where: { id: newProject.id },
    });

    if (!newFetchedProject) {
      throw new Error("Failed to create project");
    }

    project = newFetchedProject;
  }

  redirect(`/projects/${project.id}`);
};

export default Projects;
