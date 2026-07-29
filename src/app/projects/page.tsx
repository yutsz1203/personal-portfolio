import { projects } from "@/content/projects";

export default function ProjectsPage() {
  return (
    <main>
      <h1>Projects</h1>
      <ul>
        {projects.map((project) => (
          <li key={project.slug}>
            <h2>{project.name}</h2>
            <p>{project.blurb}</p>
            <ul>
              {project.tech.map((tech) => (
                <li key={tech}>{tech}</li>
              ))}
            </ul>
            {project.liveUrl ? <a href={project.liveUrl}>Live</a> : null}
            {project.repoUrl ? <a href={project.repoUrl}>Source</a> : null}
          </li>
        ))}
      </ul>
    </main>
  );
}