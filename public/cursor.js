// Global Interactive Architectural Compass Cursor for all pages
(function() {
  function initGlobalCursor() {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    let cursor = document.querySelector('#site-cursor') || document.querySelector('#map-cursor');
    
    if (!cursor) {
      cursor = document.createElement('div');
      cursor.className = 'interactive-map-cursor';
      cursor.id = 'site-cursor';
      cursor.setAttribute('aria-hidden', 'true');
      cursor.innerHTML = `
        <div class="cursor-symbol-wrap">
          <img src="/mouseicon.svg" alt="Compass Cursor" class="cursor-svg-icon" />
          <span class="cursor-center-point"></span>
        </div>
      `;
      document.body.appendChild(cursor);
    } else {
      if (cursor.parentElement !== document.body) {
        document.body.appendChild(cursor);
      }
      const oldTag = cursor.querySelector('#cursor-info-tag, .cursor-info-tag');
      if (oldTag) oldTag.remove();
    }

    let isVisible = false;

    const updatePosition = (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';

      if (!isVisible) {
        cursor.classList.add('is-visible');
        isVisible = true;
      }
    };

    window.addEventListener('mousemove', updatePosition, { passive: true });

    window.addEventListener('mouseenter', () => {
      cursor.classList.add('is-visible');
      isVisible = true;
    });

    document.addEventListener('mouseleave', () => {
      cursor.classList.remove('is-visible', 'is-hovering-link', 'is-hovering-pin', 'is-hovering-img');
      isVisible = false;
    });

    window.addEventListener('mousedown', () => {
      cursor.classList.add('is-clicking');
    });

    window.addEventListener('mouseup', () => {
      cursor.classList.remove('is-clicking');
    });

    document.addEventListener('mouseover', (e) => {
      const target = e.target;
      if (!target) return;

      if (target.closest('.map-pin')) {
        cursor.classList.add('is-hovering-pin');
        cursor.classList.remove('is-hovering-link', 'is-hovering-img');
        return;
      }

      if (
        target.closest('.project-card-kkaa') ||
        target.closest('.related-card') ||
        target.closest('a') ||
        target.closest('button') ||
        target.closest('.legend-item') ||
        target.closest('[role="button"]') ||
        target.closest('label') ||
        target.closest('input') ||
        target.closest('.map-control-toggle') ||
        target.closest('.map-discipline')
      ) {
        cursor.classList.add('is-hovering-link');
        cursor.classList.remove('is-hovering-pin', 'is-hovering-img');
        return;
      }

      if (target.closest('.kkaa-photo-item') || target.closest('.kkaa-hero-image-wrap')) {
        cursor.classList.add('is-hovering-img');
        cursor.classList.remove('is-hovering-pin', 'is-hovering-link');
        return;
      }

      cursor.classList.remove('is-hovering-link', 'is-hovering-pin', 'is-hovering-img');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGlobalCursor);
  } else {
    initGlobalCursor();
  }
})();

