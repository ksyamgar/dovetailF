import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getAllProjects, getProjectBySlug } from '@/lib/data/projects';

interface ProjectDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const projects = await getAllProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: ProjectDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: 'Project Not Found' };

  return {
    title: `${project.name} — Dovetail Architecture`,
    description: project.lead,
    openGraph: {
      title: project.name,
      description: project.lead,
      images: [project.heroImage],
    },
  };
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="project-detail-container">
      {/* Back Navigation */}
      <nav className="project-detail-nav">
        <Link href="/projects" className="project-detail-back-link">
          &larr; BACK TO ALL PROJECTS
        </Link>
      </nav>

      {/* Header Info */}
      <header className="project-detail-header">
        <div className="project-detail-meta-pill">
          <span
            className="project-meta-category"
            style={{ color: project.color }}
          >
            ● {project.category.toUpperCase()}
          </span>
          <span className="project-meta-sep">|</span>
          <span className="project-meta-year">{project.year}</span>
        </div>

        <h1 className="project-detail-title">{project.name}</h1>
        <p className="project-detail-subtitle">
          {project.type} — {project.location}
        </p>
      </header>

      {/* Hero Image */}
      <div className="project-detail-hero">
        <Image
          src={project.heroImage}
          alt={project.name}
          width={1400}
          height={800}
          priority
          className="project-hero-img"
        />
      </div>

      {/* Two Column Layout: Specifications + Quote (Left) & Summary (Right) */}
      <div className="project-text-grid">
        {/* Left: Spec Sheet + Quote */}
        <aside className="project-specs-aside">
          <h2 className="project-specs-heading">ARCHITECTURAL SPECIFICATIONS</h2>

          <div className="project-specs-list">
            <div className="project-spec-item">
              <span className="project-spec-label">LOCATION</span>
              <span className="project-spec-value">{project.location}</span>
            </div>
            <div className="project-spec-item">
              <span className="project-spec-label">COORDINATES</span>
              <span className="project-spec-value">
                {project.lat.toFixed(4)}° N, {project.lng.toFixed(4)}° E
              </span>
            </div>
            <div className="project-spec-item">
              <span className="project-spec-label">ALTITUDE</span>
              <span className="project-spec-value">{project.alt}</span>
            </div>
            {project.siteArea && (
              <div className="project-spec-item">
                <span className="project-spec-label">SITE AREA</span>
                <span className="project-spec-value">{project.siteArea}</span>
              </div>
            )}
            {project.structure && (
              <div className="project-spec-item">
                <span className="project-spec-label">STRUCTURAL SYSTEM</span>
                <span className="project-spec-value">{project.structure}</span>
              </div>
            )}
          </div>

          {/* Quote placed below specifications */}
          {project.lead && (
            <div className="project-specs-quote">
              <blockquote className="project-quote-text">
                &ldquo;{project.lead}&rdquo;
              </blockquote>
            </div>
          )}
        </aside>

        {/* Right: Narrative Summary */}
        <div className="project-narrative-col">
          <div className="project-narrative-body">
            {project.description}
          </div>
        </div>
      </div>

      {/* Image Gallery (Centered with full mobile width and zero overflow) */}
      {project.images && project.images.length > 0 && (
        <section className="project-gallery-section">
          <h2 className="project-gallery-heading">
            PROJECT GALLERY & FIELD DOCUMENTATION
          </h2>
          <div className="project-gallery-grid">
            {project.images.map((imgSrc, i) => (
              <div key={i} className="project-gallery-item">
                <Image
                  src={imgSrc}
                  alt={`${project.name} documentation ${i + 1}`}
                  width={800}
                  height={550}
                  loading="lazy"
                  className="project-gallery-img"
                />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
