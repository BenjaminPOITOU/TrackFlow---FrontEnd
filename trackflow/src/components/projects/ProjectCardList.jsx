import ProjectCard from "./ProjectCard";





export default function ProjectCardList({ userId, projects }) {
  if (!projects) {
    return null;
  }

  if (projects.length === 0) {
    return (
      <p className="text-center text-muted-foreground mt-10">
        Aucun projet à afficher.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4 md:p-6">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} userId ={userId}/>
      ))}
    </div>
  );
}
