import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getAllProjects, getProjectBySlug } from '@/lib/data/projects';
import { ArchitectureViewer } from '@/components/viewer/ArchitectureViewer';

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
    <div className="project-detail-container" style={{ maxWidth: '1440px', margin: '100px auto 80px', padding: '0 48px' }}>
      {/* Back Navigation */}
      <nav style={{ marginBottom: '32px' }}>
        <Link
          href="/projects"
          style={{ fontFamily: 'var(--mono)', fontSize: '11px', letterSpacing: '0.12em', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
        >
          &larr; BACK TO ALL PROJECTS
        </Link>
      </nav>

      {/* Header Info */}
      <header style={{ borderBottom: '1px solid var(--line)', paddingBottom: '36px', marginBottom: '48px' }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '12px' }}>
          <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: project.color, letterSpacing: '0.1em' }}>
            ● {project.category.toUpperCase()}
          </span>
          <span style={{ color: 'var(--line)' }}>|</span>
          <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--muted)', letterSpacing: '0.1em' }}>
            {project.year}
          </span>
        </div>

        <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(44px, 5.5vw, 76px)', fontWeight: 400, lineHeight: 1.05, margin: '8px 0' }}>
          {project.name}
        </h1>
        <p style={{ fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--muted)', marginTop: '8px' }}>
          {project.type} — {project.location}
        </p>
      </header>

      {/* Hero Image */}
      <div style={{ position: 'relative', width: '100%', height: 'auto', marginBottom: '60px' }}>
        <Image
          src={project.heroImage}
          alt={project.name}
          width={1400}
          height={800}
          priority
          style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
        />
      </div>

      {/* Two Column Layout: Specifications & Narrative */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '60px', marginBottom: '80px', borderBottom: '1px solid var(--line)', paddingBottom: '60px' }}>
        {/* Left: Spec Sheet */}
        <aside style={{ borderRight: '1px solid var(--line)', paddingRight: '40px' }}>
          <h2 style={{ fontFamily: 'var(--mono)', fontSize: '11px', letterSpacing: '0.16em', color: 'var(--muted)', marginBottom: '24px' }}>
            ARCHITECTURAL SPECIFICATIONS
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', fontFamily: 'var(--mono)', fontSize: '12px' }}>
            <div>
              <div style={{ color: 'var(--muted)', marginBottom: '4px' }}>LOCATION</div>
              <div>{project.location}</div>
            </div>
            <div>
              <div style={{ color: 'var(--muted)', marginBottom: '4px' }}>COORDINATES</div>
              <div>{project.lat.toFixed(4)}° N, {project.lng.toFixed(4)}° E</div>
            </div>
            <div>
              <div style={{ color: 'var(--muted)', marginBottom: '4px' }}>ALTITUDE</div>
              <div>{project.alt}</div>
            </div>
            {project.siteArea && (
              <div>
                <div style={{ color: 'var(--muted)', marginBottom: '4px' }}>SITE AREA</div>
                <div>{project.siteArea}</div>
              </div>
            )}
            {project.structure && (
              <div>
                <div style={{ color: 'var(--muted)', marginBottom: '4px' }}>STRUCTURAL SYSTEM</div>
                <div>{project.structure}</div>
              </div>
            )}
          </div>
        </aside>

        {/* Right: Narrative Text */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          <p style={{ fontFamily: 'var(--serif)', fontSize: '24px', lineHeight: 1.5, fontStyle: 'italic', color: 'var(--ink)' }}>
            "{project.lead}"
          </p>
          <div style={{ fontSize: '15px', lineHeight: 1.95, color: '#333', whiteSpace: 'pre-line' }}>
            {project.description}
          </div>
        </div>
      </div>

      {/* 3D Model Viewer if relevant */}
      {project.featured && (
        <section style={{ marginBottom: '80px' }}>
          <ArchitectureViewer projectName={project.name} />
        </section>
      )}

      {/* Image Gallery */}
      {project.images && project.images.length > 0 && (
        <section style={{ marginTop: '60px' }}>
          <h2 style={{ fontFamily: 'var(--mono)', fontSize: '11px', letterSpacing: '0.16em', color: 'var(--muted)', marginBottom: '32px' }}>
            PROJECT GALLERY & FIELD DOCUMENTATION
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '32px' }}>
            {project.images.map((imgSrc, i) => (
              <div key={i} style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
                <Image
                  src={imgSrc}
                  alt={`${project.name} documentation ${i + 1}`}
                  width={800}
                  height={550}
                  loading="lazy"
                  style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
