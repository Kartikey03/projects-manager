import { getManagers, getProjectsWithStats } from "@/lib/queries";
import { ProjectsBoard } from "@/components/ProjectsBoard";

export default async function ProjectsPage() {
  const [projects, managers] = await Promise.all([
    getProjectsWithStats(),
    getManagers(),
  ]);
  return <ProjectsBoard projects={projects} managers={managers} />;
}
