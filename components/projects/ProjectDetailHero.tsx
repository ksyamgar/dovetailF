'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { Project } from '@/types/project';

interface ProjectDetailHeroProps {
  project: Project;
}

export const ProjectDetailHero: React.FC<ProjectDetailHeroProps> = ({ project }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scrollYOffset, setScrollYOffset] = useState(0);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const frameRef = useRef<HTMLDivElement>(null);

  // Close modal on Escape key
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsModalOpen(false);
    }
  }, []);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isModalOpen, handleKeyDown]);

  // Scroll parallax effect
  useEffect(() => {
    let rafId: number;
    const handleScroll = () => {
      rafId = requestAnimationFrame(() => {
        if (!frameRef.current) return;
        const rect = frameRef.current.getBoundingClientRect();
        const viewportH = window.innerHeight;
        // Check if the hero element is in or near viewport
        if (rect.bottom > 0 && rect.top < viewportH) {
          const elementCenter = rect.top + rect.height / 2;
          const viewportCenter = viewportH / 2;
          const diff = elementCenter - viewportCenter;
          // Smooth parallax shift
          setScrollYOffset(diff * 0.08);
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  // Mouse move parallax
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!frameRef.current) return;
    const rect = frameRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5; // -0.5 to 0.5
    setMouseOffset({ x: x * 14, y: y * 10 });
  };

  const handleMouseLeave = () => {
    setMouseOffset({ x: 0, y: 0 });
  };

  const openLightbox = () => setIsModalOpen(true);
  const closeLightbox = () => setIsModalOpen(false);

  return (
    <>
      <div className="project-detail-hero">
        {/* Main Architectural Hero Frame */}
        <div
          ref={frameRef}
          className="project-hero-frame"
          onClick={openLightbox}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          role="button"
          tabIndex={0}
          aria-label={`View full resolution image of ${project.name}`}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              openLightbox();
            }
          }}
        >
          {/* Parallax Track Layer */}
          <div
            className="project-hero-parallax-track"
            style={{
              transform: `translate3d(${mouseOffset.x}px, ${scrollYOffset + mouseOffset.y}px, 0)`,
            }}
          >
            <Image
              src={project.heroImage}
              alt={project.name}
              fill
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1440px) 94vw, 1400px"
              className="project-hero-img project-hero-img--animated"
            />
          </div>

          {/* Subtle Atmospheric Light Shimmer */}
          <div className="project-hero-ambient-shimmer" />

          {/* Frosted Glass Floating Badge */}
          <div className="project-hero-badge">
            <span
              className="project-hero-badge-dot"
              style={{ backgroundColor: project.color || '#43A047' }}
            />
            <span className="project-hero-badge-text">
              {project.category}
            </span>
            <span className="project-hero-badge-sep">•</span>
            <span className="project-hero-badge-loc">
              {project.location}
            </span>
          </div>

          {/* Interactive Affordance Pill */}
          <div className="project-hero-expand-btn">
            <svg
              className="project-hero-expand-icon"
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 3 21 3 21 9" />
              <polyline points="9 21 3 21 3 15" />
              <line x1="21" y1="3" x2="14" y2="10" />
              <line x1="3" y1="21" x2="10" y2="14" />
            </svg>
            <span>EXPAND VIEW</span>
          </div>
        </div>

        {/* Technical Architectural Caption Strip */}
        <div className="project-hero-caption-strip">
          <div className="caption-strip-left">
            <span className="caption-strip-num">FIG. 01</span>
            <span className="caption-strip-title">
              {project.name} — Primary Elevation & Context
            </span>
          </div>
          <div className="caption-strip-right">
            <span>
              {project.lat && project.lng
                ? `${project.lat.toFixed(4)}° N, ${project.lng.toFixed(4)}° E`
                : project.location}
            </span>
            {project.alt && (
              <>
                <span className="caption-strip-sep">•</span>
                <span>ALT. {project.alt}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Fullscreen Architectural Lightbox Modal */}
      {isModalOpen && (
        <div
          className="project-hero-modal-backdrop"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="project-hero-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="project-hero-modal-header">
              <div className="modal-header-meta">
                <span
                  className="modal-cat-dot"
                  style={{ backgroundColor: project.color || '#43A047' }}
                />
                <span className="modal-project-name">{project.name}</span>
                <span className="modal-sep">/</span>
                <span className="modal-loc">{project.location}</span>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={closeLightbox}
                aria-label="Close image viewer"
              >
                <span>CLOSE [ESC]</span>
                <span className="modal-close-icon">✕</span>
              </button>
            </div>

            {/* Modal Image Display */}
            <div className="project-hero-modal-body">
              <Image
                src={project.heroImage}
                alt={project.name}
                width={1920}
                height={1200}
                className="modal-full-img"
                priority
              />
            </div>

            {/* Modal Footer */}
            <div className="project-hero-modal-footer">
              <span className="modal-footer-caption">
                Primary Documentation • {project.year} • {project.type}
              </span>
              <span className="modal-footer-coords">
                {project.lat && project.lng
                  ? `${project.lat.toFixed(4)}° N, ${project.lng.toFixed(4)}° E`
                  : ''}
                {project.alt ? ` • ${project.alt}` : ''}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
