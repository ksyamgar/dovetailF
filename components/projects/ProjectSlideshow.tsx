'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Project } from '@/types/project';

interface ProjectSlideshowProps {
  projects: Project[];
  autoPlayInterval?: number; // in milliseconds, default 7500
}

export const ProjectSlideshow: React.FC<ProjectSlideshowProps> = ({
  projects,
  autoPlayInterval = 7500
}) => {
  // Only display published projects with images
  const slides = projects.filter(
    (p) => p.published !== false && (p.heroImage || p.videoUrl)
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);

  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const touchStartX = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const currentSlide = slides[currentIndex];
  const totalSlides = slides.length;

  // Change to specific slide
  const goToSlide = useCallback((index: number) => {
    setCurrentIndex((prev) => {
      const nextIndex = (index + slides.length) % slides.length;
      return nextIndex;
    });
    setProgress(0);
  }, [slides.length]);

  const nextSlide = useCallback(() => {
    goToSlide(currentIndex + 1);
  }, [currentIndex, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide(currentIndex - 1);
  }, [currentIndex, goToSlide]);

  // Autoplay and progress bar handling
  useEffect(() => {
    if (!isPlaying || totalSlides <= 1) {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
      return;
    }

    const step = 50; // update progress every 50ms
    const increment = (step / autoPlayInterval) * 100;

    progressTimerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          nextSlide();
          return 0;
        }
        return prev + increment;
      });
    }, step);

    return () => {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, [isPlaying, totalSlides, autoPlayInterval, nextSlide]);

  // Manage video playback for current slide
  useEffect(() => {
    videoRefs.current.forEach((vid, idx) => {
      if (!vid) return;
      if (idx === currentIndex) {
        vid.currentTime = 0;
        const playPromise = vid.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => setIsVideoPlaying(true))
            .catch(() => {
              // Autoplay policy prevented playback, keep muted fallback
              setIsVideoPlaying(false);
            });
        }
      } else {
        vid.pause();
      }
    });
  }, [currentIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prevSlide, nextSlide]);

  // Touch swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) nextSlide();
      else prevSlide();
    }
    touchStartX.current = null;
  };

  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    const activeVideo = videoRefs.current[currentIndex];
    if (activeVideo) {
      const newMuted = !activeVideo.muted;
      activeVideo.muted = newMuted;
      setIsMuted(newMuted);
    }
  };

  const toggleVideoPlayback = (e: React.MouseEvent) => {
    e.stopPropagation();
    const activeVideo = videoRefs.current[currentIndex];
    if (activeVideo) {
      if (activeVideo.paused) {
        activeVideo.play();
        setIsVideoPlaying(true);
      } else {
        activeVideo.pause();
        setIsVideoPlaying(false);
      }
    }
  };

  if (!slides || slides.length === 0) return null;

  return (
    <section
      ref={containerRef}
      className="sleek-slideshow-container"
      aria-label="Featured Projects Slideshow"
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Top Hairline Progress Bar */}
      <div className="slideshow-progress-track">
        <div
          className="slideshow-progress-bar"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Main Slides Track */}
      <div className="slideshow-viewport">
        {slides.map((project, idx) => {
          const isActive = idx === currentIndex;
          const hasVideo = Boolean(project.videoUrl);

          return (
            <div
              key={project.id || idx}
              className={`slideshow-slide ${isActive ? 'is-active' : ''}`}
              aria-hidden={!isActive}
            >
              {/* Background Media: Video or High-Res Image */}
              <div className="slideshow-media-wrap">
                {hasVideo ? (
                  <video
                    ref={(el) => {
                      videoRefs.current[idx] = el;
                    }}
                    src={project.videoUrl}
                    poster={project.videoPoster || project.heroImage}
                    muted={isMuted}
                    loop
                    playsInline
                    preload={isActive ? 'auto' : 'metadata'}
                    className="slideshow-video"
                  />
                ) : (
                  <img
                    src={project.heroImage}
                    alt={project.name}
                    className="slideshow-image"
                    loading={idx === 0 ? 'eager' : 'lazy'}
                  />
                )}

                {/* Cinematic Architectural Vignette & Gradient Overlays */}
                <div className="slideshow-vignette" />
                <div className="slideshow-gradient-bottom" />
              </div>

              {/* In-Slide Meta & Content */}
              <div className="slideshow-content-layer">
                <div className="slideshow-inner-grid">
                  {/* Left Column: Project Identity & Synopsis */}
                  <div className="slideshow-meta-info">
                    {/* Typology Badge & Indicators */}
                    <div className="slideshow-eyebrow">
                      <span
                        className="slideshow-dot"
                        style={{ backgroundColor: project.color || 'var(--ink)' }}
                      />
                      <span className="slideshow-cat">
                        {project.category.toUpperCase()}
                      </span>
                      <span className="slideshow-sep">/</span>
                      <span className="slideshow-year">{project.year}</span>
                      {project.alt && (
                        <>
                          <span className="slideshow-sep">/</span>
                          <span className="slideshow-alt">{project.alt}</span>
                        </>
                      )}
                      {hasVideo && (
                        <span className="slideshow-video-tag">
                          <svg
                            width="9"
                            height="9"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            style={{ marginRight: '4px' }}
                          >
                            <polygon points="5 3 19 12 5 21 5 3" />
                          </svg>
                          MOTION REEL
                        </span>
                      )}
                    </div>

                    {/* Project Headline */}
                    <h2 className="slideshow-title">
                      <Link href={`/projects/${project.slug}`} tabIndex={isActive ? 0 : -1}>
                        {project.name}
                      </Link>
                    </h2>

                    {/* Location & Typology Line */}
                    <div className="slideshow-location-row">
                      <span>{project.location}</span>
                      <span className="slideshow-bullet">▪</span>
                      <span>{project.type}</span>
                    </div>

                    {/* Project Lead Statement */}
                    {project.lead && (
                      <p className="slideshow-lead-text">
                        &ldquo;{project.lead}&rdquo;
                      </p>
                    )}

                    {/* ACTION BUTTONS WITH DIRECT LINKS */}
                    <div className="slideshow-cta-group">
                      {/* Primary Button: Link to Project Detail Page */}
                      <Link
                        href={`/projects/${project.slug}`}
                        className="slideshow-btn slideshow-btn-primary"
                        tabIndex={isActive ? 0 : -1}
                      >
                        <span>EXPLORE PROJECT</span>
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <polyline points="12 5 19 12 12 19" />
                        </svg>
                      </Link>

                      {/* Secondary Action: External Link or Case Study */}
                      {project.externalLink && (
                        <a
                          href={project.externalLink.url}
                          target={project.externalLink.url.startsWith('http') ? '_blank' : '_self'}
                          rel="noopener noreferrer"
                          className="slideshow-btn slideshow-btn-secondary"
                          tabIndex={isActive ? 0 : -1}
                        >
                          <span>{project.externalLink.label}</span>
                          <svg
                            width="10"
                            height="10"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                            <polyline points="15 3 21 3 21 9" />
                            <line x1="10" y1="14" x2="21" y2="3" />
                          </svg>
                        </a>
                      )}

                      {/* Video Sound and Playback Toggle Buttons if slide has video */}
                      {hasVideo && (
                        <div className="slideshow-video-controls">
                          <button
                            type="button"
                            onClick={toggleSound}
                            className="slideshow-icon-btn"
                            title={isMuted ? 'Turn Sound On' : 'Mute Sound'}
                            aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                          >
                            {isMuted ? (
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                                <line x1="23" y1="9" x2="17" y2="15" />
                                <line x1="17" y1="9" x2="23" y2="15" />
                              </svg>
                            ) : (
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                              </svg>
                            )}
                            <span>{isMuted ? 'MUTED' : 'AUDIO ON'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={toggleVideoPlayback}
                            className="slideshow-icon-btn"
                            title={isVideoPlaying ? 'Pause Video' : 'Play Video'}
                            aria-label={isVideoPlaying ? 'Pause Video' : 'Play Video'}
                          >
                            {isVideoPlaying ? (
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                <rect x="6" y="4" width="4" height="16" />
                                <rect x="14" y="4" width="4" height="16" />
                              </svg>
                            ) : (
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                <polygon points="5 3 19 12 5 21 5 3" />
                              </svg>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Top Right Counter & Pause/Play Indicator */}
      <div className="slideshow-header-panel">
        <span className="slideshow-counter">
          <strong className="counter-current">
            {String(currentIndex + 1).padStart(2, '0')}
          </strong>
          <span className="counter-sep">/</span>
          <span className="counter-total">
            {String(totalSlides).padStart(2, '0')}
          </span>
        </span>

        <button
          type="button"
          onClick={() => setIsPlaying((prev) => !prev)}
          className="slideshow-autoplay-toggle"
          title={isPlaying ? 'Pause Auto-advance' : 'Resume Auto-advance'}
          aria-label={isPlaying ? 'Pause Auto-advance' : 'Resume Auto-advance'}
        >
          {isPlaying ? 'PAUSE' : 'PLAY'}
        </button>
      </div>

      {/* Side Arrow Navigation */}
      <div className="slideshow-arrow-controls">
        <button
          type="button"
          className="slideshow-nav-arrow arrow-prev"
          onClick={prevSlide}
          aria-label="Previous project slide"
          title="Previous slide"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <button
          type="button"
          className="slideshow-nav-arrow arrow-next"
          onClick={nextSlide}
          aria-label="Next project slide"
          title="Next slide"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      {/* SLEEK PROJECT THUMBNAILS NAVIGATION BAR (AT BOTTOM) */}
      <div className="slideshow-thumbnails-strip-wrap">
        <div className="slideshow-thumbnails-strip" role="tablist" aria-label="Project Thumbnails">
          {slides.map((proj, idx) => {
            const isSelected = idx === currentIndex;
            const hasVideo = Boolean(proj.videoUrl);

            return (
              <button
                key={proj.id || idx}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => goToSlide(idx)}
                className={`thumb-card ${isSelected ? 'is-active' : ''}`}
                title={`Go to ${proj.name}`}
              >
                <div className="thumb-img-box">
                  <img
                    src={proj.heroImage || proj.videoPoster}
                    alt={proj.name}
                    className="thumb-img"
                  />
                  {hasVideo && (
                    <span className="thumb-video-icon" title="Contains motion video">
                      <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                    </span>
                  )}
                  <span className="thumb-index">{String(idx + 1).padStart(2, '0')}</span>
                </div>
                <div className="thumb-info">
                  <span className="thumb-name">{proj.name}</span>
                  <span className="thumb-cat">{proj.category}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
