import Link from "next/link";

import { books } from "@/content/books";
import { education } from "@/content/education";
import { experience } from "@/content/experience";
import { profile } from "@/content/profile";
import { featuredProjects } from "@/content/projects";
import { skills } from "@/content/skills";

export default function Home() {
  return (
    <main>
      <h1>{profile.name}</h1>
      <p>{profile.title}</p>
      <p>{profile.summary}</p>
      <ul>
        <li>
          <a href={`mailto:${profile.email}`}>{profile.email}</a>
        </li>
        <li>
          <a href={profile.linkedinUrl}>LinkedIn</a>
        </li>
      </ul>

      <h2>Experience</h2>
      <ul>
        {experience.map((item) => (
          <li key={`${item.company}-${item.role}`}>
            <p>
              {item.dates.start} – {item.dates.end ?? "Present"}
            </p>
            <h3>
              {item.companyUrl ? (
                <a href={item.companyUrl}>{item.company}</a>
              ) : (
                item.company
              )}
            </h3>
            <p>{item.role}</p>
            <ul>
              {item.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
            <ul>
              {item.tech.map((tech) => (
                <li key={tech}>{tech}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>

      <h2>Education</h2>
      <ul>
        {education.map((item) => (
          <li key={`${item.institution}-${item.degree}`}>
            <p>
              {item.dates.start} – {item.dates.end ?? "Present"}
            </p>
            <h3>{item.institution}</h3>
            <p>
              {item.degree}
              {item.classification ? `, ${item.classification}` : ""}
            </p>
            {item.highlights ? (
              <ul>
                {item.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            ) : null}
          </li>
        ))}
      </ul>

      <h2>
        <Link href="/projects">Projects</Link>
      </h2>
      <ul>
        {featuredProjects.map((project) => (
          <li key={project.slug}>
            <h3>{project.name}</h3>
            <p>{project.blurb}</p>
            {project.liveUrl ? <a href={project.liveUrl}>Live</a> : null}
            {project.repoUrl ? <a href={project.repoUrl}>Source</a> : null}
          </li>
        ))}
      </ul>

      <h2>Skills</h2>
      {skills.map((group) => (
        <div key={group.label}>
          <h3>{group.label}</h3>
          <ul>
            {group.skills.map((skill) => (
              <li key={skill.name}>{skill.name}</li>
            ))}
          </ul>
        </div>
      ))}

      <h2>
        <Link href="/books">Books</Link>
      </h2>
      <ul>
        {books.map((book) => (
          <li key={book.title}>
            {book.title} — {book.author}
          </li>
        ))}
      </ul>
    </main>
  );
}