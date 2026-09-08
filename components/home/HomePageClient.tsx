'use client';

import React, { useState, useMemo } from 'react';
import { Project } from '@/types/project';
import { testProjectFilterMatch } from '@/lib/data/projects';
import { ProjectMap } from '@/components/map/ProjectMap';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { Preloader } from '@/components/ui/Preloader';

interface HomePageClientProps {
  projects: Project[];
}

interface FilterItem {
  key: string;
  label: string;
  color?: string;
}

interface FilterGroup {
  key: string;
  label: string;
  items: FilterItem[];
}

const FILTER_GROUPS: FilterGroup[] = [
  {
    key: 'use',
    label: 'USE',
    items: [
      { key: 'Hospitality', label: 'HOSPITALITY', color: '#E53935' },
      { key: 'Residential', label: 'RESIDENTIAL', color: '#FBC02D' },
      { key: 'Conservation', label: 'CONSERVATION', color: '#43A047' },
      { key: 'Interiors', label: 'INTERIORS', color: '#8E24AA' },
      { key: 'Public', label: 'PUBLIC / SCHOOL', color: '#1E88E5' },
      { key: 'Planning', label: 'PLANNING / GHAT', color: '#FB8C00' }
    ]
  },
  {
    key: 'locations',
    label: 'LOCATIONS',
    items: [
      { key: 'himachal', label: 'HIMACHAL PRADESH' },
      { key: 'ladakh', label: 'LADAKH' },
      { key: 'uttarakhand', label: 'UTTARAKHAND' }
    ]
  },
  {
    key: 'area',
    label: 'AREA',
    items: [
      { key: 'mountain', label: 'MOUNTAIN (>1500m)' },
      { key: 'valley', label: 'VALLEY' }
    ]
  },
  {
    key: 'others',
    label: 'OTHERS',
    items: [
      { key: 'completed', label: 'COMPLETED' },
      { key: 'ongoing', label: 'ONGOING' }
    ]
  },
  {
    key: 'size',
    label: 'SIZE',
    items: [
      { key: 'size-100', label: '< 100 m²' },
      { key: 'size-500', label: '< 500 m²' },
      { key: 'size-1000', label: '< 1,000 m²' },
      { key: 'size-2000', label: '< 2,000 m²' },
      { key: 'size-gt-2000', label: '> 2,000 m²' }
    ]
  }
];

export const HomePageClient: React.FC<HomePageClientProps> = ({ projects }) => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const PROJECTS_PER_PAGE = 9;
  const [currentPage, setCurrentPage] = useState(1);

  // Dynamic filtered projects list
  const filteredProjects = useMemo(() => {
    if (!activeFilter) return projects;
    return projects.filter((p) => testProjectFilterMatch(p, activeFilter));
  }, [projects, activeFilter]);

  // Total pages
  const totalPages = Math.ceil(filteredProjects.length / PROJECTS_PER_PAGE);

  // 9 projects per page in 3x3 grid
  const paginatedProjects = useMemo(() => {
    const start = (currentPage - 1) * PROJECTS_PER_PAGE;
    return filteredProjects.slice(start, start + PROJECTS_PER_PAGE);
  }, [filteredProjects, currentPage]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    const element = document.getElementById('work');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Compute live project counts for every filter item
  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    FILTER_GROUPS.forEach((group) => {
      group.items.forEach((item) => {
        map[item.key] = projects.filter((p) => testProjectFilterMatch(p, item.key)).length;
      });
    });
    return map;
  }, [projects]);

  // Determine which parent group is active (if any)
  const activeGroupKey = useMemo(() => {
    if (!activeFilter) return null;
    for (const group of FILTER_GROUPS) {
      if (group.items.some((item) => item.key === activeFilter)) {
        return group.key;
      }
    }
    return null;
  }, [activeFilter]);

  // Display metadata for active badge
  const activeFilterInfo = useMemo(() => {
    if (!activeFilter) return null;
    for (const group of FILTER_GROUPS) {
      const match = group.items.find((item) => item.key === activeFilter);
      if (match) return match;
    }
    return { key: activeFilter, label: activeFilter.toUpperCase() };
  }, [activeFilter]);

  const handleFilterClick = (filterKey: string) => {
    setCurrentPage(1);
    if (filterKey === 'all' || activeFilter === filterKey) {
      setActiveFilter(null);
    } else {
      setActiveFilter(filterKey);
    }
    setOpenDropdown(null);
  };

  return (
    <>
      {/* PRELOADER WITH APPROVED CONTOUR ANIMATION */}
      <Preloader isMapReady={mapLoaded} />

      {/* HERO MAP SECTION */}
      <section
        className="hero-map-section"
        id="map-section"
        aria-label="Interactive Himalayan Topographic Map and Practice Overview"
      >
        <ProjectMap
          projects={projects}
          onMapLoaded={() => setMapLoaded(true)}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
      </section>

      {/* WORK / PROJECT GRID (KKAA STYLE) */}
      <section className="work-section" id="work">
        <div className="kkaa-section-title-wrap">
          {/* Header Row: Left North Indicator Circle + Centered PROJECTS Title */}
          <div className="kkaa-title-row">
            <div className="kkaa-title-north-icon" aria-hidden="true" title="True North">
              <svg
                width="28"
                height="28"
                viewBox="0 0 200 200"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="projects-north-icon"
              >
                <circle cx="100" cy="100" r="95" stroke="currentColor" strokeWidth="2.5" />
                <line x1="100" y1="5" x2="100" y2="195" stroke="currentColor" strokeWidth="2.5" />
                <polyline
                  points="195 100 100 5 5 100"
                  stroke="currentColor"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                  strokeLinejoin="bevel"
                />
                <circle cx="100" cy="100" r="6" fill="currentColor" />
              </svg>
            </div>
            <h2 className="kkaa-section-title">PROJECTS</h2>
          </div>

          {/* Filter Bar */}
          <div className="kkaa-filter-bar" role="navigation" aria-label="Project Filters">
            {/* ALL */}
            <div className="filter-group">
              <button
                className={`filter-btn ${!activeFilter ? 'active' : ''}`}
                onClick={() => handleFilterClick('all')}
              >
                ALL
              </button>
            </div>

            {/* DROPDOWN GROUPS: USE, LOCATIONS, AREA, OTHERS, SIZE */}
            {FILTER_GROUPS.map((group) => {
              const isGroupActive = activeGroupKey === group.key;
              const isDropdownOpen = openDropdown === group.key;

              return (
                <div
                  key={group.key}
                  className={`filter-group has-dropdown ${isDropdownOpen ? 'is-open' : ''}`}
                  onMouseEnter={() => setOpenDropdown(group.key)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <button
                    className={`filter-btn ${isGroupActive ? 'active' : ''}`}
                    onClick={() =>
                      setOpenDropdown((prev) => (prev === group.key ? null : group.key))
                    }
                    aria-haspopup="true"
                    aria-expanded={isDropdownOpen}
                  >
                    {group.label}
                  </button>

                  <div className="filter-dropdown" role="menu">
                    {group.items.map((item) => {
                      const isItemActive = activeFilter === item.key;
                      const itemCount = counts[item.key] ?? 0;

                      return (
                        <button
                          key={item.key}
                          className={`dropdown-item ${isItemActive ? 'active' : ''}`}
                          onClick={() => handleFilterClick(item.key)}
                          role="menuitem"
                        >
                          <span className="item-label-wrap" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {item.color && (
                              <span
                                style={{
                                  width: '6px',
                                  height: '6px',
                                  borderRadius: '50%',
                                  background: item.color,
                                  display: 'inline-block',
                                  flexShrink: 0
                                }}
                              />
                            )}
                            <span className="item-label">{item.label}</span>
                          </span>
                          <span className="item-count">{itemCount}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Filter Notification Badge */}
          {activeFilter && activeFilterInfo && (
            <div className="active-filter-badge" style={{ marginTop: '16px' }}>
              {activeFilterInfo.color && (
                <span
                  className="filter-dot"
                  style={{ background: activeFilterInfo.color }}
                />
              )}
              <span>
                FILTERED: <strong>{activeFilterInfo.label}</strong> ({filteredProjects.length})
              </span>
              <button
                className="clear-filter-btn"
                onClick={() => {
                  setActiveFilter(null);
                  setCurrentPage(1);
                }}
                title="Show all projects"
              >
                SHOW ALL ({projects.length}) ✕
              </button>
            </div>
          )}
        </div>

        {/* Dynamic Project Grid (3x3 grid = 9 projects per page) */}
        {filteredProjects.length > 0 ? (
          <>
            <div className="project-grid-kkaa" id="project-list" role="list">
              {paginatedProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>

            {/* Pagination Controls */}
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
          </>
        ) : (
          <div
            style={{
              textAlign: 'center',
              padding: '60px 20px',
              fontFamily: 'var(--mono)',
              fontSize: '11px',
              letterSpacing: '0.12em',
              color: 'var(--muted)'
            }}
          >
            <p>NO PROJECTS FOUND MATCHING THIS FILTER</p>
            <button
              className="clear-filter-btn"
              onClick={() => setActiveFilter(null)}
              style={{
                marginTop: '16px',
                borderLeft: 'none',
                paddingLeft: 0,
                textDecoration: 'underline',
                fontSize: '10px'
              }}
            >
              SHOW ALL PROJECTS ({projects.length})
            </button>
          </div>
        )}
      </section>
    </>
  );
};
