import React from 'react';
import Link from 'next/link';
import { Project } from '@/types/project';

interface ProjectCardProps {
  project: Project;
  viewMode?: 'grid-big' | 'grid-small' | 'list';
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, viewMode = 'grid-small' }) => {
  const isNew = project.year === '2026' || project.year === '2024';

  if (viewMode === 'list') {
    return (
      <Link
        href={`/projects/${project.slug}`}
        className="project-list-row"
        role="listitem"
        data-category={project.category}
      >
        <div className="list-img-wrap">
          <img
            src={project.heroImage}
            alt={project.name}
            loading="lazy"
          />
          {isNew && <span className="card-new-badge" style={{ fontSize: '8px', padding: '2px 5px' }}>NEW</span>}
        </div>

        <div className="list-title-cell">
          <div className="list-name">{project.name}</div>
          <div className="list-cat-badge">
            <span
              className="card-dot"
              style={{ '--dot-color': project.color } as React.CSSProperties}
            />
            <span>{project.category.toUpperCase()}</span>
          </div>
        </div>

        <div className="list-meta-cell list-loc-cell">
          <span className="list-label">LOCATION</span>
          <span className="list-val">{project.location}</span>
        </div>

        <div className="list-meta-cell list-type-cell">
          <span className="list-label">TYPOLOGY</span>
          <span className="list-val">{project.type}</span>
        </div>

        <div className="list-meta-cell list-year-cell">
          <span className="list-label">YEAR</span>
          <span className="list-val">{project.year}</span>
        </div>

        <div className="list-action-cell">
          <span>EXPLORE</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/projects/${project.slug}`}
      className={`project-card-kkaa ${viewMode === 'grid-big' ? 'card-big' : 'card-small'}`}
      role="listitem"
      data-category={project.category}
    >
      <div className="card-img-wrap">
        {isNew && <span className="card-new-badge">NEW</span>}
        <img
          src={project.heroImage}
          alt={project.name}
          loading="lazy"
        />
      </div>
      <div className="card-meta-row">
        <span className="card-loc">{project.location.toUpperCase()}</span>
        <span className="card-year">{project.year}</span>
      </div>
      <div className="card-title-row">
        <span
          className="card-dot"
          style={{ '--dot-color': project.color } as React.CSSProperties}
          title={project.category}
        ></span>
        <h3 className="card-title">{project.name}</h3>
      </div>
      <div className="card-typology">{project.type}</div>
      {viewMode === 'grid-big' && project.lead && (
        <p className="card-lead-excerpt">&ldquo;{project.lead}&rdquo;</p>
      )}
    </Link>
  );
};
