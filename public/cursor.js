// Global Interactive Architectural Compass Cursor for all pages (Hardware Accelerated)
(function() {
  function initGlobalCursor() {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    var cursor = document.querySelector('#site-cursor') || document.querySelector('#map-cursor');
    
    if (!cursor) {
      cursor = document.createElement('div');
      cursor.className = 'interactive-map-cursor';
      cursor.id = 'site-cursor';
      cursor.setAttribute('aria-hidden', 'true');
      cursor.innerHTML =
        '<div class="cursor-symbol-wrap">' +
          '<img src="/mouseicon.svg" alt="Compass Cursor" class="cursor-svg-icon" />' +
          '<span class="cursor-center-point"></span>' +
        '</div>';
      document.body.appendChild(cursor);
    } else {
      if (cursor.parentElement !== document.body) {
        document.body.appendChild(cursor);
      }
      var oldTag = cursor.querySelector('#cursor-info-tag, .cursor-info-tag');
      if (oldTag) oldTag.remove();
    }

    var isVisible = false;
    var pendingHoverTarget = null;
    var hoverRafId = null;
    var lastHoverTarget = null;

    var updatePosition = function(e) {
      cursor.style.transform = 'translate3d(' + e.clientX + 'px, ' + e.clientY + 'px, 0) translate(-50%, -50%)';

      if (!isVisible) {
        cursor.classList.add('is-visible');
        isVisible = true;
      }
    };

    window.addEventListener('mousemove', updatePosition, { passive: true });

    window.addEventListener('mouseenter', function() {
      cursor.classList.add('is-visible');
      isVisible = true;
    });

    document.addEventListener('mouseleave', function() {
      cursor.classList.remove('is-visible', 'is-hovering-link', 'is-hovering-pin', 'is-hovering-img', 'is-on-dark');
      isVisible = false;
      lastHoverTarget = null;
    });

    window.addEventListener('mousedown', function() {
      cursor.classList.add('is-clicking');
    });

    window.addEventListener('mouseup', function() {
      cursor.classList.remove('is-clicking');
    });

    var processHover = function() {
      hoverRafId = null;
      var target = pendingHoverTarget;
      if (!target || target === lastHoverTarget) return;
      lastHoverTarget = target;

      // Dark surface detection: footer, dark CTA buttons, dark drawing thumb, dark cards
      if (
        target.closest(
          'footer, .footer, #contact, .panel-cta-primary, .panel-drawing-thumb, .btn-dark, [data-theme="dark"], .bg-dark, .dark-surface'
        )
      ) {
        cursor.classList.add('is-on-dark');
      } else {
        cursor.classList.remove('is-on-dark');
      }

      if (target.closest('.map-pin, .map-cluster-pin, .city-marker')) {
        cursor.classList.add('is-hovering-pin');
        cursor.classList.remove('is-hovering-link', 'is-hovering-img');
        return;
      }

      if (
        target.closest(
          '.project-card-kkaa, .related-card, a, button, .legend-item, [role="button"], label, input, .map-control-toggle, .filter-btn, .panel-close-btn'
        )
      ) {
        cursor.classList.add('is-hovering-link');
        cursor.classList.remove('is-hovering-pin', 'is-hovering-img');
        return;
      }

      if (target.closest('.kkaa-photo-item, .kkaa-hero-image-wrap, .panel-photo-thumb, .panel-hero, .panel-drawing-thumb')) {
        cursor.classList.add('is-hovering-img');
        cursor.classList.remove('is-hovering-pin', 'is-hovering-link');
        return;
      }

      cursor.classList.remove('is-hovering-link', 'is-hovering-pin', 'is-hovering-img');
    };

    document.addEventListener('mouseover', function(e) {
      pendingHoverTarget = e.target;
      if (!hoverRafId) {
        hoverRafId = requestAnimationFrame(processHover);
      }
    }, { passive: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGlobalCursor);
  } else {
    initGlobalCursor();
  }
})();
