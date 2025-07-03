import ProjectCard from "./ProjectCard";

/**
 * Renders a grid of ProjectCard components.
 * This is a Server Component that receives a list of projects and maps over them.
 * @param {object} props - The component props.
 * @param {Array} props.projects - The array of project objects to display.
 * @returns {JSX.Element} A grid of project cards.
 */
export default function ProjectCardList({ projects }) {
  if (!projects || projects.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}