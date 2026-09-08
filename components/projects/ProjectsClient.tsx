'use client';

import React, { useState, useMemo } from 'react';
import { Project, ProjectCategory } from '@/types/project';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { ProjectSlideshow } from '@/components/projects/ProjectSlideshow';

interface ProjectsClientProps {
  initialProjects: Project[];
}

interface CategoryItem {
  key: 'ALL' | ProjectCategory;
  label: string;
}

const CATEGORIES: CategoryItem[] = [
  { key: 'ALL', label: 'All' },
  { key: 'Conservation', label: 'Conservation' },
  { key: 'Residential', label: 'Residential' },
  { key: 'Hospitality', label: 'Hospitality' },
  { key: 'Interiors', label: 'Interiors' },
  { key: 'Planning', label: 'Planning' },
  { key: 'Public', label: 'Public' }
];

export const ProjectsClient: React.FC<ProjectsClientProps> = ({ initialProjects }) => {
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | ProjectCategory>('ALL');
  const [viewMode, setViewMode] = useState<'grid-big' | 'grid-small' | 'list'>('grid-small');
  const [currentPage, setCurrentPage] = useState(1);
  const PROJECTS_PER_PAGE = 12;

  // Dynamic portfolio statistics (auto-updates when any new project is added)
  const stats = useMemo(() => {
    const total = initialProjects.length;

    // Unique typologies / categories
    const typologies = new Set(
      initialProjects.map((p) => p.category?.trim()).filter(Boolean)
    ).size;

    // Unique states / regional territories
    const states = new Set(
      initialProjects.map((p) => {
        if (p.state && p.state.trim()) return p.state.trim().toLowerCase();
        const loc = (p.location || '').toLowerCase();
        if (loc.includes('ladakh')) return 'ladakh';
        if (loc.includes('h.p.') || loc.includes('himachal') || loc.includes('kangra')) return 'himachal pradesh';
        if (loc.includes('u.k.') || loc.includes('uttarakhand')) return 'uttarakhand';
        return (p.country || 'himachal pradesh').toLowerCase();
      }).filter(Boolean)
    ).size;

    return { total, typologies, states };
  }, [initialProjects]);

  // Dynamic counts per category
  const categoryCounts = useMemo(() => {
    const map: Record<string, number> = {};
    initialProjects.forEach((p) => {
      if (p.category) {
        map[p.category] = (map[p.category] || 0) + 1;
      }
    });
    return map;
  }, [initialProjects]);

  const filteredProjects = useMemo(() => {
    if (selectedCategory === 'ALL') return initialProjects;
    return initialProjects.filter((p) => p.category === selectedCategory);
  }, [initialProjects, selectedCategory]);

  const totalPages = Math.ceil(filteredProjects.length / PROJECTS_PER_PAGE);

  // Paginated projects (after 12 projects, rest in pagination on next clicks)
  const paginatedProjects = useMemo(() => {
    const start = (currentPage - 1) * PROJECTS_PER_PAGE;
    return filteredProjects.slice(start, start + PROJECTS_PER_PAGE);
  }, [filteredProjects, currentPage]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    const el = document.getElementById('projects-filter-bar');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCategorySelect = (catKey: 'ALL' | ProjectCategory) => {
    setSelectedCategory(catKey);
    setCurrentPage(1);
  };

  const slideshowProjects = useMemo(() => {
    const featured = initialProjects.filter((p) => p.featured || p.videoUrl);
    return featured.length > 0 ? featured : initialProjects;
  }, [initialProjects]);

  const startIndex = (currentPage - 1) * PROJECTS_PER_PAGE;
  const endIndex = Math.min(currentPage * PROJECTS_PER_PAGE, filteredProjects.length);
  const showingText = filteredProjects.length > PROJECTS_PER_PAGE
    ? `SHOWING ${startIndex + 1}–${endIndex} OF ${filteredProjects.length} PROJECTS`
    : `SHOWING ${filteredProjects.length} OF ${initialProjects.length} PROJECTS`;

  return (
    <div className="projects-page-wrapper" style={{ maxWidth: '1600px', margin: '0 auto', padding: '0 48px 80px' }}>
      {/* HERO SECTION WITH TOP RIGHT DYNAMIC STATISTICS */}
      <section className="projects-hero" style={{ padding: '120px 0 48px' }}>
        <div className="projects-hero-left">
          <div className="projects-hero-eyebrow">Dovetail Architecture · Portfolio</div>
          <h1 className="projects-hero-title">Work<br />& Projects</h1>
          <p className="projects-hero-desc">
            A practice rooted in the Himalayas — spanning conservation of heritage structures, sensitive residential design, public spaces and cultural landscapes across altitudes from 800m to 3,500m.
          </p>
        </div>

        <div className="projects-hero-right">
          <div className="projects-hero-stats" role="region" aria-label="Practice Statistics">
            <div className="stat-item">
              <span className="stat-num" id="stat-total">{stats.total}</span>
              <span className="stat-label">Total Projects</span>
            </div>
            <div className="stat-item">
              <span className="stat-num" id="stat-typologies">{stats.typologies}</span>
              <span className="stat-label">Typologies</span>
            </div>
            <div className="stat-item">
              <span className="stat-num" id="stat-states">{stats.states}</span>
              <span className="stat-label">States</span>
            </div>
          </div>
        </div>
      </section>

      {/* SLEEK TOP MULTIMEDIA FEATURED SLIDESHOW */}
      <div className="projects-slideshow-section" style={{ margin: '36px 0 54px' }}>
        <ProjectSlideshow projects={slideshowProjects} />
      </div>

      {/* FILTER & RESULTS BAR */}
      <div
        id="projects-filter-bar"
        className="category-filter-row"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          margin: '40px 0 32px'
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.key;
            const count = cat.key === 'ALL' ? initialProjects.length : categoryCounts[cat.key] || 0;
            return (
              <button
                key={cat.key}
                onClick={() => handleCategorySelect(cat.key)}
                style={{
                  fontFamily: 'var(--mono)',
                  fontSize: '11px',
                  letterSpacing: '0.12em',
                  padding: '8px 16px',
                  borderRadius: '2px',
                  border: isActive ? '1px solid var(--ink)' : '1px solid var(--line)',
                  backgroundColor: isActive ? 'var(--ink)' : 'transparent',
                  color: isActive ? '#ffffff' : 'var(--ink)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>{cat.label.toUpperCase()}</span>
                <span style={{ fontSize: '9px', opacity: isActive ? 0.85 : 0.6 }}>({count})</span>
              </button>
            );
          })}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', letterSpacing: '0.12em', color: 'var(--muted)', textTransform: 'uppercase' }}>
            {showingText}
          </div>

          {/* VIEW TOGGLE: BIG GRID, SMALL GRID, LIST VIEW */}
          <div className="pfilter-view-toggle" role="group" aria-label="Project Layout View Toggle">
            {/* BIG THUMBNAILS GRID (2-COL) */}
            <button
              type="button"
              className={`view-btn ${viewMode === 'grid-big' ? 'active' : ''}`}
              onClick={() => setViewMode('grid-big')}
              title="Large Thumbnails Grid"
              aria-label="Large Thumbnails Grid"
            >
              <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor">
                <rect x="1" y="2" width="6" height="12" rx="1" />
                <rect x="9" y="2" width="6" height="12" rx="1" />
              </svg>
            </button>

            {/* SMALL THUMBNAILS GRID (3/4-COL) */}
            <button
              type="button"
              className={`view-btn ${viewMode === 'grid-small' ? 'active' : ''}`}
              onClick={() => setViewMode('grid-small')}
              title="Small Thumbnails Grid"
              aria-label="Small Thumbnails Grid"
            >
              <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor">
                <rect x="1" y="1" width="3.5" height="3.5" rx="0.5" />
                <rect x="6.25" y="1" width="3.5" height="3.5" rx="0.5" />
                <rect x="11.5" y="1" width="3.5" height="3.5" rx="0.5" />
                <rect x="1" y="6.25" width="3.5" height="3.5" rx="0.5" />
                <rect x="6.25" y="6.25" width="3.5" height="3.5" rx="0.5" />
                <rect x="11.5" y="6.25" width="3.5" height="3.5" rx="0.5" />
                <rect x="1" y="11.5" width="3.5" height="3.5" rx="0.5" />
                <rect x="6.25" y="11.5" width="3.5" height="3.5" rx="0.5" />
                <rect x="11.5" y="11.5" width="3.5" height="3.5" rx="0.5" />
              </svg>
            </button>

            {/* LIST VIEW */}
            <button
              type="button"
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              title="List View"
              aria-label="List View"
            >
              <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor">
                <rect x="1" y="2" width="3.5" height="3" rx="0.5" />
                <rect x="6" y="2.75" width="9" height="1.5" rx="0.5" />
                <rect x="1" y="6.5" width="3.5" height="3" rx="0.5" />
                <rect x="6" y="7.25" width="9" height="1.5" rx="0.5" />
                <rect x="1" y="11" width="3.5" height="3" rx="0.5" />
                <rect x="6" y="11.75" width="9" height="1.5" rx="0.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* PROJECTS GRID / LIST */}
      <div className={`project-grid-kkaa view-${viewMode}`} role="list">
        {paginatedProjects.map((project) => (
          <ProjectCard key={project.id} project={project} viewMode={viewMode} />
        ))}
      </div>

      {/* PAGINATION CONTROLS (comes after 12 projects) */}
      {totalPages > 1 && (
        <nav id="pagination-controls" aria-label="Projects pagination">
          <button
            type="button"
            className="page-btn"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            aria-label="Previous page"
          >
            ← PREV
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              type="button"
              className={`page-btn num-btn ${pageNum === currentPage ? 'active' : ''}`}
              onClick={() => handlePageChange(pageNum)}
              aria-current={pageNum === currentPage ? 'page' : undefined}
            >
              {pageNum}
            </button>
          ))}
          <button
            type="button"
            className="page-btn"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            aria-label="Next page"
          >
            NEXT →
          </button>
        </nav>
      )}
    </div>
  );
};
