'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

interface ProjectGalleryProps {
  images: string[];
  projectName: string;
}

export const ProjectGallery: React.FC<ProjectGalleryProps> = ({ images, projectName }) => {
  // Store natural aspect ratios for each image: index -> width / height
  const [aspectRatios, setAspectRatios] = useState<Record<number, number>>({});
  // Selected index for full-screen lightbox modal
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const handleImageLoad = (index: number, width: number, height: number) => {
    if (width && height) {
      const ratio = width / height;
      setAspectRatios((prev) => {
        if (prev[index] === ratio) return prev;
        return { ...prev, [index]: ratio };
      });
    }
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const nextImage = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev! + 1) % images.length);
  }, [lightboxIndex, images.length]);

  const prevImage = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev! - 1 + images.length) % images.length);
  }, [lightboxIndex, images.length]);

  // Handle keyboard navigation for modal
  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [lightboxIndex, nextImage, prevImage]);

  if (!images || images.length === 0) return null;

  return (
    <section className="project-gallery-section">
      <div className="project-gallery-header-row">
        <h2 className="project-gallery-heading">
          PROJECT GALLERY &amp; FIELD DOCUMENTATION
        </h2>
        <span className="project-gallery-count">
          {images.length} ARCHIVAL FRAMES
        </span>
      </div>

      {/* Justified Google Images style layout */}
      <div className="project-gallery-justified-wrap">
        {images.map((imgSrc, i) => {
          // Default to 1.4 if not yet loaded
          const ratio = aspectRatios[i] || 1.4;
          // Target height in px (base 280px)
          const targetHeight = 280;
          const flexBasis = Math.round(ratio * targetHeight);
          const flexGrow = Math.round(ratio * 100);

          return (
            <div
              key={i}
              className="project-gallery-item"
              style={{
                flexGrow: flexGrow,
                flexBasis: `${flexBasis}px`,
                aspectRatio: `${ratio}`,
              }}
              onClick={() => openLightbox(i)}
              role="button"
              tabIndex={0}
              aria-label={`View documentation image ${i + 1} of ${projectName}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  openLightbox(i);
                }
              }}
            >
              <Image
                src={imgSrc}
                alt={`${projectName} documentation ${i + 1}`}
                width={800}
                height={550}
                loading="lazy"
                className="project-gallery-img"
                onLoadingComplete={(e) => {
                  handleImageLoad(i, e.naturalWidth, e.naturalHeight);
                }}
              />

              {/* Hover overlay with image index & expand hint */}
              <div className="project-gallery-item-overlay">
                <span className="gallery-item-index">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="gallery-item-expand-btn">
                  <svg
                    width="14"
                    height="14"
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
                </span>
              </div>
            </div>
          );
        })}

        {/* Invisible spacer keeps last row items from awkwardly stretching too wide */}
        <div className="project-gallery-last-row-spacer" aria-hidden="true" />
      </div>

      {/* Fullscreen Lightbox Slideshow Modal */}
      {lightboxIndex !== null && (
        <div
          className="gallery-lightbox-backdrop"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="gallery-lightbox-panel"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar */}
            <div className="gallery-lightbox-topbar">
              <div className="gallery-lightbox-meta">
                <span className="gallery-lightbox-name">{projectName}</span>
                <span className="gallery-lightbox-sep">/</span>
                <span className="gallery-lightbox-num">
                  FRAME {String(lightboxIndex + 1).padStart(2, '0')} OF {String(images.length).padStart(2, '0')}
                </span>
              </div>

              <button
                type="button"
                className="gallery-lightbox-close"
                onClick={closeLightbox}
                aria-label="Close image viewer"
              >
                <span>CLOSE [ESC]</span>
                <span className="close-x">✕</span>
              </button>
            </div>

            {/* Main Stage with Prev / Next Buttons */}
            <div className="gallery-lightbox-stage">
              {images.length > 1 && (
                <button
                  type="button"
                  className="gallery-lightbox-nav gallery-lightbox-prev"
                  onClick={prevImage}
                  aria-label="Previous image"
                >
                  &#8592;
                </button>
              )}

              <div className="gallery-lightbox-img-wrap">
                <Image
                  src={images[lightboxIndex]}
                  alt={`${projectName} documentation ${lightboxIndex + 1}`}
                  width={1920}
                  height={1200}
                  className="gallery-lightbox-main-img"
                  priority
                />
              </div>

              {images.length > 1 && (
                <button
                  type="button"
                  className="gallery-lightbox-nav gallery-lightbox-next"
                  onClick={nextImage}
                  aria-label="Next image"
                >
                  &#8594;
                </button>
              )}
            </div>

            {/* Bottom Bar: Thumbnails Strip */}
            {images.length > 1 && (
              <div className="gallery-lightbox-footer">
                <div className="gallery-lightbox-thumbs">
                  {images.map((tSrc, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={`gallery-lightbox-thumb ${idx === lightboxIndex ? 'is-active' : ''}`}
                      onClick={() => setLightboxIndex(idx)}
                      aria-label={`Jump to photo ${idx + 1}`}
                    >
                      <Image
                        src={tSrc}
                        alt={`Thumb ${idx + 1}`}
                        width={60}
                        height={40}
                        className="thumb-img"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
