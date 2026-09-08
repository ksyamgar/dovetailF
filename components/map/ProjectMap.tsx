'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import maplibregl, { Map as MapLibreInstance, Marker } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import mlcontour from 'maplibre-contour';
import { Project } from '@/types/project';
import { OFFICES, MAJOR_CITIES, LEGEND_CATEGORIES, Office } from '@/lib/data/mapData';
import { testProjectFilterMatch } from '@/lib/data/projects';
import Link from 'next/link';

// Architectural Monochrome (Default B&W Mode)
const BW_MINOR_LINE_COLOR: any = '#2d2d2a';
const BW_MINOR_OPACITY: any = [
  'interpolate', ['linear'], ['zoom'],
  4,  0.28,
  7,  0.38,
  10, 0.48,
  13, 0.58
];
const BW_MAJOR_LINE_COLOR: any = '#111214';
const BW_MAJOR_OPACITY: any = [
  'interpolate', ['linear'], ['zoom'],
  4,  0.50,
  7,  0.62,
  10, 0.75,
  13, 0.88
];

// Elevation-Tiered Color Ramp (Opt-in Color Mode)
const COLOR_MINOR_LINE_COLOR: any = [
  'interpolate', ['linear'],
  ['coalesce', ['get', 'ele'], 800],
  0,    '#cfc19d',   // plains: warm parchment
  200,  '#c0a870',   // coastal lowlands: golden tan
  500,  '#ae8c4c',   // foothills: warm amber
  1000, '#9a742e',   // low hills: deep amber/ochre
  1800, '#8a7262',   // mid-terrain: earthy warm grey
  2800, '#6a7098',   // ridges: distinctly blue-slate
  4000, '#4a5890',   // high peaks: cool indigo
  5500, '#2e3c72',   // extreme: deep navy
  7000, '#161e48'    // summit: darkest navy
];
const COLOR_MINOR_OPACITY: any = [
  'interpolate', ['linear'],
  ['coalesce', ['get', 'ele'], 800],
  0,    0.45,
  500,  0.58,
  1500, 0.68,
  3000, 0.78,
  5500, 0.88
];
const COLOR_MAJOR_LINE_COLOR: any = [
  'interpolate', ['linear'],
  ['coalesce', ['get', 'ele'], 800],
  0,    '#b8a270',   // plains: golden-tan bold
  200,  '#a88444',   // coastal: amber bold
  500,  '#966630',   // foothills: deep amber bold
  1000, '#805020',   // low hills: rich burnt amber
  1800, '#745e50',   // mid-terrain: warm brown
  2800, '#506080',   // ridges: strong slate blue
  4000, '#344c78',   // high peaks: deep indigo
  5500, '#1e3060',   // extreme: dark navy
  7000, '#0e1838'    // summit: near-black navy
];
const COLOR_MAJOR_OPACITY: any = [
  'interpolate', ['linear'],
  ['coalesce', ['get', 'ele'], 800],
  0,    0.60,
  500,  0.72,
  1500, 0.82,
  3000, 0.92,
  5500, 1.00
];

// Contour Density Presets (Level 1: Sparse -> Level 2: Low Default -> Level 5: High)
// Scaled specifically for Himalayan topography so contours never black-out and render in <15ms
const DENSITY_PRESETS: Record<number, Record<number, [number, number]>> = {
  1: { // SPARSE - Maximum performance, ultra fast, airy spacing
    4: [250, 1000],
    5: [200, 1000],
    6: [150, 750],
    7: [120, 600],
    8: [100, 500],
    9: [60, 300],
    10: [40, 200],
    11: [30, 150],
    12: [20, 100],
    13: [15, 75],
    14: [10, 50]
  },
  2: { // LOW (DEFAULT) - Light, crisp architectural curves, fast load & smooth 3D
    4: [150, 750],
    5: [120, 600],
    6: [100, 500],
    7: [80, 400],
    8: [60, 300],
    9: [45, 225],
    10: [35, 175],
    11: [30, 150],
    12: [25, 125],
    13: [20, 100],
    14: [15, 75]
  },
  3: { // MEDIUM - Balanced topographic survey
    4: [100, 500],
    5: [80, 400],
    6: [60, 300],
    7: [50, 250],
    8: [35, 175],
    9: [25, 125],
    10: [20, 100],
    11: [15, 75],
    12: [10, 50],
    13: [6, 30],
    14: [5, 25]
  },
  4: { // DENSE - Rich topographic survey
    4: [60, 300],
    5: [50, 250],
    6: [35, 175],
    7: [30, 150],
    8: [20, 100],
    9: [15, 75],
    10: [12, 60],
    11: [8, 40],
    12: [6, 30],
    13: [4, 20],
    14: [3, 15]
  },
  5: { // HIGH - Detailed alpine contouring
    4: [40, 200],
    5: [30, 150],
    6: [25, 125],
    7: [20, 100],
    8: [15, 75],
    9: [10, 50],
    10: [8, 40],
    11: [6, 30],
    12: [4, 20],
    13: [2.5, 10],
    14: [2, 10]
  }
};

const DENSITY_NAMES: Record<number, string> = {
  1: 'SPARSE',
  2: 'LOW',
  3: 'MEDIUM',
  4: 'DENSE',
  5: 'HIGH'
};

// Regional India Bounding Box with comfortable margin for smooth panning
// Restricts camera movement and prevents downloading unnecessary global DEM/vector data
const INDIA_BOUNDS: [[number, number], [number, number]] = [
  [60.0, 5.0],   // Southwest coordinates (Arabian Sea / Indian Ocean)
  [103.0, 38.5]  // Northeast coordinates (Ladakh / Arunachal Pradesh / Himalayas)
];

// Computes the bounding box covering all studio projects and offices with breathing margin
const getProjectsBounds = (projectList: Project[]): [[number, number], [number, number]] => {
  const pts: { lng: number; lat: number }[] = [
    ...projectList.map(p => ({ lng: p.lng, lat: p.lat })),
    ...OFFICES.map(o => ({ lng: o.lng, lat: o.lat }))
  ];

  if (pts.length === 0) {
    return [
      [76.2, 30.0],
      [78.9, 34.2]
    ];
  }

  let minLng = pts[0].lng;
  let maxLng = pts[0].lng;
  let minLat = pts[0].lat;
  let maxLat = pts[0].lat;

  for (let i = 1; i < pts.length; i++) {
    if (pts[i].lng < minLng) minLng = pts[i].lng;
    if (pts[i].lng > maxLng) maxLng = pts[i].lng;
    if (pts[i].lat < minLat) minLat = pts[i].lat;
    if (pts[i].lat > maxLat) maxLat = pts[i].lat;
  }

  // Margin of 0.08° (~8km) so beacons and pin halos never clip against borders
  return [
    [minLng - 0.08, minLat - 0.08],
    [maxLng + 0.08, maxLat + 0.08]
  ];
};

interface ProjectMapProps {
  projects: Project[];
  onMapLoaded?: () => void;
  activeFilter?: string | null;
  onFilterChange?: (filter: string | null) => void;
}

export const ProjectMap: React.FC<ProjectMapProps> = ({
  projects,
  onMapLoaded,
  activeFilter: externalFilter,
  onFilterChange
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<MapLibreInstance | null>(null);
  const demSourceRef = useRef<any>(null);

  const projectMarkersRef = useRef<Marker[]>([]);
  const officeMarkersRef = useRef<Marker[]>([]);
  const cityMarkersRef = useRef<Marker[]>([]);
  const clusterMarkersRef = useRef<Marker[]>([]);

  const [activeItem, setActiveItem] = useState<{ type: 'project' | 'office'; data: Project | Office } | null>(null);
  const [currentMediaIdx, setCurrentMediaIdx] = useState<number>(0);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [is3D, setIs3D] = useState(false);
  const [showPlaces, setShowPlaces] = useState(true);
  const [showBoundary, setShowBoundary] = useState(true);
  const [showContourColors, setShowContourColors] = useState(false);
  const showContourColorsRef = useRef(false);
  const [densityLevel, setDensityLevel] = useState<number>(2); // Level 2 = LOW (Default)
  const debouncedDensityRef = useRef<NodeJS.Timeout | null>(null);
  const [isControlsOpen, setIsControlsOpen] = useState(false);
  const [elevation, setElevation] = useState<string>('ELEV — —');

  const [internalFilter, setInternalFilter] = useState<string | null>(null);
  const activeFilter = externalFilter !== undefined ? externalFilter : internalFilter;
  const prevFilterRef = useRef<string | null>(null);

  // Turntable and flight animation refs
  const turntableRafRef = useRef<number | null>(null);
  const turntableTargetRef = useRef<{ lng: number; lat: number; padding: { top: number; bottom: number; left: number; right: number }; pitch: number; zoom: number; elevation: number } | null>(null);
  const turntableBearingRef = useRef<number>(0);
  const autoRotateRef = useRef<boolean>(false);
  const flightTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const activePointCoordRef = useRef<{ lng: number; lat: number } | null>(null);
  const isOrbitingRef = useRef<boolean>(false);
  const closePanelRef = useRef<() => void>(() => {});

  const stopTurntable = useCallback(() => {
    autoRotateRef.current = false;
    turntableTargetRef.current = null;
    if (turntableRafRef.current) {
      cancelAnimationFrame(turntableRafRef.current);
      turntableRafRef.current = null;
    }
  }, []);

  const clearFlightTimeouts = useCallback(() => {
    if (flightTimeoutRef.current) {
      clearTimeout(flightTimeoutRef.current);
      flightTimeoutRef.current = null;
    }
  }, []);

  // Detail padding: offsets the camera to the open area to the left of the docked side panel (left 1/3)
  const getDetailPadding = useCallback(() => {
    const canvas = mapInstanceRef.current?.getCanvas();
    const w = canvas?.clientWidth || (typeof window !== 'undefined' ? window.innerWidth : 1200);
    const isDesktop = w > 860;
    const panelWidth = isDesktop ? Math.round(w * (2 / 3)) : 0;
    return isDesktop
      ? { top: 70, bottom: 70, left: 0, right: panelWidth }
      : { top: 60, bottom: 60, left: 20, right: 20 };
  }, []);

  // Circular Vignette Architectural Lens Mask
  const showCircularMask = useCallback(() => {
    const mask = document.querySelector('#terrain-circular-mask') as HTMLElement | null;
    const map = mapInstanceRef.current;
    if (!mask || !map) return;
    const canvas = map.getCanvas();
    if (!canvas) return;
    const padding = getDetailPadding();
    const cx = padding.left + (canvas.clientWidth - padding.left - padding.right) / 2;
    const cy = padding.top + (canvas.clientHeight - padding.top - padding.bottom) / 2;

    mask.style.setProperty('--mask-cx', `${((cx / canvas.clientWidth) * 100).toFixed(2)}%`);
    mask.style.setProperty('--mask-cy', `${((cy / canvas.clientHeight) * 100).toFixed(2)}%`);
    mask.classList.add('is-active');
  }, [getDetailPadding]);

  const hideCircularMask = useCallback(() => {
    const mask = document.querySelector('#terrain-circular-mask');
    if (mask) {
      mask.classList.remove('is-active');
    }
  }, []);

  // In MapLibre GL v5, the camera center naturally targets the exact geographical coordinate [lng, lat].
  // Artificial trigonometric offsets cause points to drift kilometers away when tilting or rotating.
  const getCompensatedCenter = useCallback((lng: number, lat: number, _elevM?: number, _pitchDeg?: number, _bearingDeg?: number): [number, number] => {
    return [lng, lat];
  }, []);

  // Continuous 360° cinematic turntable orbit locked directly around the focal point
  const startTurntable = useCallback((lng: number, lat: number, padding: { top: number; bottom: number; left: number; right: number }, targetPitch = 46, targetZoom = 12.3, elevM = 1500, startBearing = 0) => {
    stopTurntable();
    autoRotateRef.current = true;
    turntableBearingRef.current = startBearing;
    turntableTargetRef.current = { lng, lat, padding, pitch: targetPitch, zoom: targetZoom, elevation: elevM };

    const startTime = performance.now();
    let lastTime = startTime;
    const speedDegPerSec = 7.2; // ~50s per 360° revolution

    const orbitFrame = (now: number) => {
      const map = mapInstanceRef.current;
      if (!autoRotateRef.current || !map || !turntableTargetRef.current || isOrbitingRef.current) {
        return;
      }
      const deltaSec = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // Silky acceleration ramp over the first 1.2s so the camera eases into orbit
      const elapsedOrbit = (now - startTime) / 1000;
      const ramp = Math.min(elapsedOrbit / 1.2, 1);
      const currentSpeed = speedDegPerSec * (ramp * ramp * (3 - 2 * ramp));

      turntableBearingRef.current = (turntableBearingRef.current + currentSpeed * deltaSec) % 360;

      const compensatedCenter = getCompensatedCenter(
        turntableTargetRef.current.lng,
        turntableTargetRef.current.lat,
        turntableTargetRef.current.elevation,
        turntableTargetRef.current.pitch,
        turntableBearingRef.current
      );

      map.jumpTo({
        center: compensatedCenter,
        bearing: turntableBearingRef.current,
        pitch: turntableTargetRef.current.pitch,
        zoom: turntableTargetRef.current.zoom,
        padding: turntableTargetRef.current.padding
      });

      turntableRafRef.current = requestAnimationFrame(orbitFrame);
    };

    turntableRafRef.current = requestAnimationFrame(orbitFrame);
  }, [stopTurntable, getCompensatedCenter]);

  const enable3DTerrain = useCallback((map: MapLibreInstance) => {
    try {
      map.setTerrain({ source: 'dem', exaggeration: 1.25 });
      if (map.getLayer('hillshade')) {
        map.setLayoutProperty('hillshade', 'visibility', 'visible');
      }
      // Ensure contour lines remain visible on 3D topography
      ['contour-minor', 'contour-major'].forEach(id => {
        if (map.getLayer(id)) {
          map.setLayoutProperty(id, 'visibility', 'visible');
        }
      });
    } catch (err) {
      console.warn('enable3DTerrain error:', err);
    }
  }, []);

  const disable3DTerrain = useCallback((map: MapLibreInstance) => {
    try {
      map.setTerrain(null);
      if (map.getLayer('hillshade')) {
        map.setLayoutProperty('hillshade', 'visibility', 'none');
      }
      // In 2D overview mode: restore contour lines
      ['contour-minor', 'contour-major'].forEach(id => {
        if (map.getLayer(id)) {
          map.setLayoutProperty(id, 'visibility', 'visible');
        }
      });
    } catch (err) {
      console.warn('disable3DTerrain error:', err);
    }
  }, []);

  const applyContourTheme = useCallback((map: MapLibreInstance, isColor: boolean) => {
    try {
      const minorColor = isColor ? COLOR_MINOR_LINE_COLOR : BW_MINOR_LINE_COLOR;
      const minorOpacity = isColor ? COLOR_MINOR_OPACITY : BW_MINOR_OPACITY;
      const majorColor = isColor ? COLOR_MAJOR_LINE_COLOR : BW_MAJOR_LINE_COLOR;
      const majorOpacity = isColor ? COLOR_MAJOR_OPACITY : BW_MAJOR_OPACITY;

      if (map.getLayer('contour-minor')) {
        map.setPaintProperty('contour-minor', 'line-color', minorColor);
        map.setPaintProperty('contour-minor', 'line-opacity', minorOpacity);
      }
      if (map.getLayer('contour-major')) {
        map.setPaintProperty('contour-major', 'line-color', majorColor);
        map.setPaintProperty('contour-major', 'line-opacity', majorOpacity);
      }
    } catch (err) {
      console.warn('applyContourTheme error:', err);
    }
  }, []);

  const toggleContourColors = useCallback(() => {
    const map = mapInstanceRef.current;
    const next = !showContourColors;
    setShowContourColors(next);
    showContourColorsRef.current = next;
    if (map) {
      applyContourTheme(map, next);
    }
  }, [showContourColors, applyContourTheme]);

  const applyContourDensity = useCallback((level: number) => {
    const demSource = demSourceRef.current;
    const map = mapInstanceRef.current;
    if (!demSource || !map) return;

    try {
      const thresholds = DENSITY_PRESETS[level] || DENSITY_PRESETS[2];
      const newUrl = demSource.contourProtocolUrl({
        multiplier: 1,
        thresholds,
        contourLayer: 'contours',
        elevationKey: 'ele',
        levelKey: 'level',
        overzoom: 1
      });

      const source = map.getSource('contours') as any;
      if (source && typeof source.setTiles === 'function') {
        source.setTiles([newUrl]);
      }
    } catch (err) {
      console.warn('Failed to update contour density:', err);
    }
  }, []);

  const handleDensityChange = useCallback((level: number) => {
    setDensityLevel(level);
    if (debouncedDensityRef.current) {
      clearTimeout(debouncedDensityRef.current);
    }
    debouncedDensityRef.current = setTimeout(() => {
      applyContourDensity(level);
    }, 100);
  }, [applyContourDensity]);

  // Update pin visual selection highlight and smoothly hide/show other 2D elements
  const updatePinHighlights = useCallback((activeLng: number | null, activeLat: number | null) => {
    const isInspecting = activeLng != null && activeLat != null;
    const allMarkers = [...projectMarkersRef.current, ...officeMarkersRef.current];

    allMarkers.forEach(marker => {
      const el = marker.getElement();
      const pos = marker.getLngLat();
      const isMatch = isInspecting &&
        Math.abs(pos.lng - activeLng) < 0.0001 &&
        Math.abs(pos.lat - activeLat) < 0.0001;

      el.style.transition = 'opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1), filter 0.5s ease';

      if (isMatch) {
        el.classList.add('is-highlighted');
        el.style.opacity = '1';
        el.style.transform = 'scale(1)';
        el.style.pointerEvents = 'auto';
      } else if (isInspecting) {
        // In 3D site focus: smoothly fade out all other pins so only the active project is showcased
        el.classList.remove('is-highlighted');
        el.style.opacity = '0';
        el.style.transform = 'scale(0.7)';
        el.style.pointerEvents = 'none';
      } else {
        // Overview mode: smoothly restore all pins
        el.classList.remove('is-highlighted');
        el.style.opacity = '1';
        el.style.transform = 'scale(1)';
        el.style.pointerEvents = 'auto';
      }
    });

    // Smoothly fade city markers and regional cluster badges out when entering 3D inspection
    cityMarkersRef.current.forEach(marker => {
      const el = marker.getElement();
      el.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
      el.style.opacity = isInspecting ? '0' : '1';
      el.style.transform = isInspecting ? 'scale(0.7)' : 'scale(1)';
      el.style.pointerEvents = isInspecting ? 'none' : 'auto';
    });

    clusterMarkersRef.current.forEach(marker => {
      const el = marker.getElement();
      el.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
      el.style.opacity = isInspecting ? '0' : '1';
      el.style.transform = isInspecting ? 'scale(0.7)' : 'scale(1)';
      el.style.pointerEvents = isInspecting ? 'none' : 'auto';
    });

    // Fade 2D national boundary line during 3D inspection to maintain pristine terrain focus
    const map = mapInstanceRef.current;
    if (map && map.getLayer('india_boundary_line')) {
      try {
        map.setLayoutProperty('india_boundary_line', 'visibility', isInspecting ? 'none' : (showBoundary ? 'visible' : 'none'));
      } catch (_) {}
    }
  }, [showBoundary]);

  // Cinematic Flying Drone Arc Path + 3D Terrain Activation + Turnaround Orbit
  const flyToLocation = useCallback((lng: number, lat: number, altStr?: string, targetZoom = 12.3) => {
    const map = mapInstanceRef.current;
    if (!map) return;

    stopTurntable();
    clearFlightTimeouts();

    setIs3D(true);
    activePointCoordRef.current = { lng, lat };
    updatePinHighlights(lng, lat);

    // Parse numeric altitude if available (e.g. "1,312 m" -> 1312)
    let elevM = 1500;
    if (altStr) {
      const num = parseInt(altStr.replace(/[^0-9]/g, ''), 10);
      if (!isNaN(num) && num > 0) elevM = num;
    }
    const demElev = map.queryTerrainElevation([lng, lat]);
    if (demElev != null && demElev > 0) {
      elevM = demElev;
    }

    const padding = getDetailPadding();
    const finalPitch = 46;
    const finalBearing = map.getBearing() + 14;
    // Luxurious, smooth duration for architectural drone trajectory
    const duration = 2300;

    // Activate 3D terrain and lens mask
    enable3DTerrain(map);
    showCircularMask();

    const finalCenter = getCompensatedCenter(lng, lat, elevM, finalPitch, finalBearing);

    // Silky, cinema-grade flight arc easing into the mountain valley
    map.flyTo({
      center: finalCenter,
      zoom: targetZoom,
      pitch: finalPitch,
      bearing: finalBearing,
      padding,
      duration,
      curve: 1.42, // Smooth, natural parabolic arc
      speed: 0.92, // Gentle cinematic pacing
      easing: (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2), // Buttery cubic easeInOut
      essential: true
    });

    let arrivalHandled = false;
    const onArrival = () => {
      if (arrivalHandled) return;
      arrivalHandled = true;
      if (!activePointCoordRef.current ||
        Math.abs(activePointCoordRef.current.lng - lng) > 0.0001 ||
        Math.abs(activePointCoordRef.current.lat - lat) > 0.0001) {
        return;
      }
      // Gentle settle pause before starting the cinematic orbit
      flightTimeoutRef.current = setTimeout(() => {
        startTurntable(lng, lat, padding, finalPitch, targetZoom, elevM, finalBearing);
      }, 350);
    };

    map.once('moveend', onArrival);
    flightTimeoutRef.current = setTimeout(onArrival, duration + 150);
  }, [stopTurntable, clearFlightTimeouts, updatePinHighlights, getDetailPadding, enable3DTerrain, showCircularMask, getCompensatedCenter, startTurntable]);

  const fitAllPoints = useCallback((animate = true) => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const bounds = getProjectsBounds(projects);
    const centerLng = (bounds[0][0] + bounds[1][0]) / 2;
    const centerLat = (bounds[0][1] + bounds[1][1]) / 2;

    const w = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const isMobile = w < 768;
    const padding = isMobile
      ? { top: 60, bottom: 60, left: 30, right: 30 }
      : { top: 70, bottom: 70, left: 70, right: 70 };

    let targetZoom = 7.0;
    try {
      const camera = map.cameraForBounds(bounds, { padding });
      if (camera && typeof camera.zoom === 'number') {
        targetZoom = Math.min(camera.zoom, 7.5);
      }
    } catch (_) {
      targetZoom = 7.0;
    }

    if (animate) {
      map.flyTo({
        center: [centerLng, centerLat],
        zoom: targetZoom,
        pitch: 0,
        bearing: 0,
        padding: { top: 0, bottom: 0, left: 0, right: 0 },
        duration: 1200,
        essential: true
      });
    } else {
      map.jumpTo({
        center: [centerLng, centerLat],
        zoom: targetZoom,
        pitch: 0,
        bearing: 0,
        padding: { top: 0, bottom: 0, left: 0, right: 0 }
      });
    }
  }, [projects]);

  const closePanel = useCallback(() => {
    setIsPanelOpen(false);
    setActiveItem(null);
    activePointCoordRef.current = null;
    stopTurntable();
    clearFlightTimeouts();
    hideCircularMask();
    updatePinHighlights(null, null);
    setIs3D(false);
    setIsControlsOpen(false);

    const map = mapInstanceRef.current;
    if (map) {
      disable3DTerrain(map);
      fitAllPoints(true);
    }
  }, [stopTurntable, clearFlightTimeouts, hideCircularMask, updatePinHighlights, disable3DTerrain, fitAllPoints]);

  closePanelRef.current = closePanel;

  const selectProject = useCallback((project: Project) => {
    setCurrentMediaIdx(0);
    setActiveItem({ type: 'project', data: project });
    setIsPanelOpen(true);
    flyToLocation(project.lng, project.lat, project.alt, 12.3);
  }, [flyToLocation]);

  const selectOffice = useCallback((office: Office) => {
    setActiveItem({ type: 'office', data: office });
    setIsPanelOpen(true);
    flyToLocation(office.lng, office.lat, office.alt, 12.6);
  }, [flyToLocation]);

  const clearFilter = useCallback(() => {
    if (onFilterChange) {
      onFilterChange(null);
    } else {
      setInternalFilter(null);
    }
  }, [onFilterChange]);

  const resetMap = useCallback(() => {
    clearFilter();
    setDensityLevel(2);
    applyContourDensity(2);
    closePanel();
  }, [clearFilter, closePanel, applyContourDensity]);

  const handleZoomIn = useCallback(() => {
    mapInstanceRef.current?.zoomIn({ duration: 300 });
  }, []);

  const handleZoomOut = useCallback(() => {
    mapInstanceRef.current?.zoomOut({ duration: 300 });
  }, []);

  const toggle3DTilt = useCallback(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    stopTurntable();
    clearFlightTimeouts();
    hideCircularMask();

    const nextState = !is3D;
    setIs3D(nextState);

    map.easeTo({
      pitch: nextState ? 46 : 0,
      bearing: nextState ? 18 : 0,
      duration: 1000
    });

    if (nextState) {
      enable3DTerrain(map);
    } else {
      disable3DTerrain(map);
    }
  }, [is3D, stopTurntable, clearFlightTimeouts, hideCircularMask, enable3DTerrain, disable3DTerrain]);

  const togglePlacesVisibility = useCallback((show: boolean) => {
    setShowPlaces(show);
    const elements = document.querySelectorAll('.city-marker');
    elements.forEach((el) => {
      el.classList.toggle('is-hidden', !show);
    });
  }, []);

  const toggleBoundaryVisibility = useCallback((show: boolean) => {
    setShowBoundary(show);
    const map = mapInstanceRef.current;
    if (!map) return;
    try {
      if (map.getLayer('india_boundary_line')) {
        map.setLayoutProperty('india_boundary_line', 'visibility', show ? 'visible' : 'none');
      }
    } catch (err) {
      console.warn('toggleBoundaryVisibility error:', err);
    }
  }, []);

  const handleFilterClick = useCallback((categoryKey: string) => {
    const next = activeFilter === categoryKey ? null : categoryKey;
    if (onFilterChange) {
      onFilterChange(next);
    } else {
      setInternalFilter(next);
    }
  }, [activeFilter, onFilterChange]);

  // Update pin filter dimming, highlighting, and camera positioning across all markers
  useEffect(() => {
    const map = mapInstanceRef.current;

    // 1. Update individual project pins
    projectMarkersRef.current.forEach((marker) => {
      const proj = (marker as any)._project as Project | undefined;
      const el = marker.getElement();
      if (!proj) return;

      const isMatch = testProjectFilterMatch(proj, activeFilter);

      if (!activeFilter || isMatch) {
        el.classList.remove('is-dimmed');
        if (activeFilter) {
          el.classList.add('is-highlighted');
        } else {
          el.classList.remove('is-highlighted');
        }
        el.style.opacity = '1';
        el.style.pointerEvents = 'auto';
      } else {
        el.classList.add('is-dimmed');
        el.classList.remove('is-highlighted');
        el.style.opacity = '0.12';
        el.style.pointerEvents = 'none';
      }
    });

    // 2. Update Kangra regional cluster marker
    clusterMarkersRef.current.forEach((clusterMarker) => {
      const kangraList = (clusterMarker as any)._kangraProjects as Project[] | undefined;
      const el = clusterMarker.getElement();
      if (!kangraList) return;

      const matchingInCluster = kangraList.filter(p => testProjectFilterMatch(p, activeFilter));
      const countEl = el.querySelector('.cluster-num');
      if (countEl) {
        countEl.textContent = String(activeFilter ? matchingInCluster.length : kangraList.length);
      }

      if (!activeFilter || matchingInCluster.length > 0) {
        el.classList.remove('is-dimmed');
        if (activeFilter) {
          el.classList.add('is-highlighted');
        } else {
          el.classList.remove('is-highlighted');
        }
        el.style.opacity = '1';
        el.style.pointerEvents = 'auto';
      } else {
        el.classList.add('is-dimmed');
        el.classList.remove('is-highlighted');
        el.style.opacity = '0.12';
        el.style.pointerEvents = 'none';
      }
    });

    // 3. Smoothly adjust camera bounds to encompass matching projects
    if (map) {
      if (activeFilter) {
        const matching = projects.filter(p => testProjectFilterMatch(p, activeFilter));
        if (matching.length > 0) {
          const bounds = getProjectsBounds(matching);
          const isDesktop = map.getCanvas().clientWidth > 860;
          map.fitBounds(bounds, {
            padding: isDesktop
              ? { top: 90, bottom: 90, left: 100, right: 100 }
              : { top: 70, bottom: 70, left: 30, right: 30 },
            maxZoom: matching.length === 1 ? 12.5 : 9.8,
            duration: 1200
          });
        }
      } else if (prevFilterRef.current) {
        // Returned to all projects after active filter
        fitAllPoints(true);
      }
    }
    prevFilterRef.current = activeFilter || null;
  }, [activeFilter, projects, fitAllPoints]);

  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const demSource = new mlcontour.DemSource({
      url: 'https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png',
      encoding: 'terrarium',
      maxzoom: 12,
      worker: false,
      cacheSize: 200
    });
    demSource.setupMaplibre(maplibregl);
    demSourceRef.current = demSource;

    const initialBounds = getProjectsBounds(projects);
    const centerLng = (initialBounds[0][0] + initialBounds[1][0]) / 2;
    const centerLat = (initialBounds[0][1] + initialBounds[1][1]) / 2;
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const initialPadding = isMobile
      ? { top: 60, bottom: 60, left: 30, right: 30 }
      : { top: 70, bottom: 70, left: 70, right: 70 };

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: {
        version: 8,
        glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf',
        sources: {
          dem: {
            type: 'raster-dem',
            tiles: [demSource.sharedDemProtocolUrl],
            encoding: 'terrarium',
            maxzoom: 12,
            tileSize: 256
          },
          contours: {
            type: 'vector',
            tiles: [
              demSource.contourProtocolUrl({
                multiplier: 1,
                thresholds: DENSITY_PRESETS[2], // LOW density preset (Default) - fast load, light clean curves
                contourLayer: 'contours',
                elevationKey: 'ele',
                levelKey: 'level',
                overzoom: 1
              })
            ],
            maxzoom: 14
          },
          india_boundary: {
            type: 'geojson',
            data: '/india-osm.json'
          }
        },
        layers: [
          // 1. Clean tactile paper background
          {
            id: 'base',
            type: 'background',
            paint: {
              'background-color': '#FAF9F5'
            }
          },
          // 2. Tactile architectural hillshading from DEM (Loaded dynamically on 3D tilt or pin click)
          {
            id: 'hillshade',
            type: 'hillshade',
            source: 'dem',
            layout: {
              visibility: 'none'
            },
            paint: {
              'hillshade-shadow-color': '#52524c',
              'hillshade-highlight-color': '#ffffff',
              'hillshade-accent-color': '#82827a',
              'hillshade-exaggeration': 0.72,
              'hillshade-illumination-direction': 315,
              'hillshade-illumination-anchor': 'map'
            }
          },
          // 3. Minor contour lines — ALWAYS ON in 2D (zoom 4.5+), default architectural B&W graphite
          {
            id: 'contour-minor',
            type: 'line',
            source: 'contours',
            'source-layer': 'contours',
            filter: ['==', ['get', 'level'], 0],
            minzoom: 4.5,
            layout: {
              'line-join': 'round',
              'line-cap': 'round',
              'line-miter-limit': 2,
              'line-round-limit': 1.05,
              visibility: 'visible'
            },
            paint: {
              'line-color': BW_MINOR_LINE_COLOR,
              'line-width': [
                'interpolate', ['linear'], ['zoom'],
                4.5, 0.45,
                7,   0.6,
                9,   0.8,
                11,  1.0,
                14,  1.3
              ],
              'line-opacity': BW_MINOR_OPACITY
            }
          },
          // 4. Major index contours — ALWAYS ON in 2D (zoom 4+), default bold carbon black
          {
            id: 'contour-major',
            type: 'line',
            source: 'contours',
            'source-layer': 'contours',
            filter: ['>', ['get', 'level'], 0],
            minzoom: 4,
            layout: {
              'line-join': 'round',
              'line-cap': 'round',
              'line-miter-limit': 2,
              'line-round-limit': 1.05,
              visibility: 'visible'
            },
            paint: {
              'line-color': BW_MAJOR_LINE_COLOR,
              'line-width': [
                'interpolate', ['linear'], ['zoom'],
                4,  0.75,
                6,  1.0,
                8,  1.3,
                10, 1.7,
                12, 2.1,
                14, 2.5
              ],
              'line-opacity': BW_MAJOR_OPACITY
            }
          },
          // 5. Official India National Boundary (scales wider as zoom increases for instant clarity)
          {
            id: 'india_boundary_line',
            type: 'line',
            source: 'india_boundary',
            layout: {
              'line-join': 'round',
              'line-cap': 'round',
              visibility: 'visible'
            },
            paint: {
              'line-color': '#11141A',
              'line-width': [
                'interpolate', ['linear'], ['zoom'],
                4.4,  1.8,
                6.5,  2.4,
                8.0,  3.2,
                10.0, 4.2,
                12.5, 5.2,
                15.0, 6.5
              ],
              'line-opacity': [
                'interpolate', ['linear'], ['zoom'],
                4.4,  0.42,
                7.0,  0.55,
                9.0,  0.65,
                12.0, 0.75
              ]
            }
          }
        ]
      },
      center: [centerLng, centerLat],
      zoom: 7.0,
      bounds: initialBounds,
      fitBoundsOptions: {
        padding: initialPadding,
        maxZoom: 7.2
      },
      minZoom: 4.4,
      maxZoom: 16.5,
      maxBounds: INDIA_BOUNDS,
      scrollZoom: false,
      attributionControl: false
    });

    map.scrollZoom.disable();

    mapInstanceRef.current = map;

    map.on('mousemove', (e) => {
      try {
        const elev = map.queryTerrainElevation(e.lngLat);
        if (elev != null) {
          setElevation(`ELEV ${Math.round(elev).toLocaleString()} M`);
        } else {
          setElevation('ELEV — —');
        }
      } catch (_) {
        setElevation('ELEV — —');
      }
    });

    map.on('click', (e) => {
      const target = e.originalEvent?.target as HTMLElement | null;
      if (target && (target.closest('.map-pin') || target.closest('.map-cluster-pin') || target.closest('#project-panel') || target.closest('.map-view-controls') || target.closest('.map-zoom-controls'))) {
        return;
      }
      closePanelRef.current();
    });

    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (
        target.closest('#project-panel') ||
        target.closest('.map-pin') ||
        target.closest('.map-cluster-pin') ||
        target.closest('.map-view-controls') ||
        target.closest('.map-zoom-controls') ||
        target.closest('.map-control-btn') ||
        target.closest('.map-control-toggle')
      ) {
        return;
      }
      const panel = document.querySelector('#project-panel');
      if (panel && panel.classList.contains('open')) {
        closePanelRef.current();
      }
    };

    window.addEventListener('click', handleDocumentClick);

    const canvas = map.getCanvas();
    const handlePointerDown = (e: PointerEvent) => {
      if ((e.target as HTMLElement)?.closest('.map-pin') || (e.target as HTMLElement)?.closest('.map-cluster-pin')) {
        return;
      }
      isOrbitingRef.current = true;
      stopTurntable();
      clearFlightTimeouts();
    };
    const handlePointerUp = () => {
      isOrbitingRef.current = false;
    };

    canvas.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);

    map.on('load', () => {
      // 1. Render Major Cities (India & Nepal)
      MAJOR_CITIES.forEach((city) => {
        const el = document.createElement('div');
        el.className = `city-marker ${city.isCapital ? 'is-capital' : ''} ${city.isBold ? 'is-bold' : ''}`.trim();
        el.setAttribute('aria-hidden', 'true');
        el.innerHTML = `
          <div class="city-marker-dot"></div>
          <span class="city-marker-name">${city.name}</span>
        `;

        const marker = new maplibregl.Marker({ element: el, anchor: 'center' })
          .setLngLat([city.lng, city.lat])
          .addTo(map);

        cityMarkersRef.current.push(marker);
      });

      // 2. Render Office Pins (Palampur HQ)
      OFFICES.forEach((off) => {
        const el = document.createElement('div');
        el.className = 'map-pin office-pin is-main-office';
        el.setAttribute('tabindex', '0');
        el.setAttribute('role', 'button');
        el.setAttribute('aria-label', `Studio: ${off.name}`);

        el.innerHTML = `
          <div class="office-pin-beacon"></div>
          <div class="office-pin-marker">
            <span class="office-icon">✦</span>
          </div>
          <div class="map-pin-label office-label">
            <span class="office-badge">HEADQUARTERS / MAIN STUDIO</span>
            <strong>${off.name}</strong>
            <span class="pin-sub-loc">${off.address} · ${off.alt}</span>
          </div>
        `;

        el.addEventListener('click', (ev) => {
          ev.stopPropagation();
          selectOffice(off);
        });

        const marker = new maplibregl.Marker({ element: el, anchor: 'center' })
          .setLngLat([off.lng, off.lat])
          .addTo(map);

        officeMarkersRef.current.push(marker);
      });

      // 3. Render Project Pins
      projects.forEach((proj) => {
        const el = document.createElement('div');
        el.className = 'map-pin project-pin';
        el.dataset.category = proj.category;
        el.style.setProperty('--pin-color', proj.color);
        el.setAttribute('tabindex', '0');
        el.setAttribute('role', 'button');
        el.setAttribute('aria-label', `Project: ${proj.name}`);

        el.innerHTML = `
          <div class="map-pin-dot"></div>
          <div class="map-pin-label project-label">
            <div class="pin-thumb">
              <img src="${proj.heroImage}" alt="${proj.name}" />
            </div>
            <div class="pin-text">
              <span class="pin-tag-type">${proj.category}</span>
              <strong>${proj.name}</strong>
              <span class="pin-sub-loc">${proj.location} · ${proj.alt}</span>
            </div>
          </div>
        `;

        el.addEventListener('click', (ev) => {
          ev.stopPropagation();
          selectProject(proj);
        });

        const marker = new maplibregl.Marker({ element: el, anchor: 'center' })
          .setLngLat([proj.lng, proj.lat])
          .addTo(map);

        (marker as any)._project = proj;
        projectMarkersRef.current.push(marker);
      });

      // 4. Render Regional Kangra Cluster Pin
      const kangraProjects = projects.filter(p =>
        p.location.includes('Kangra') ||
        p.location.includes('Palampur') ||
        p.location.includes('Dharamshala') ||
        p.location.includes('Neugal') ||
        p.location.includes('Baijnath') ||
        p.location.includes('Chimbalhar')
      );
      if (kangraProjects.length > 1) {
        const clusterEl = document.createElement('div');
        clusterEl.className = 'map-cluster-pin';
        clusterEl.setAttribute('role', 'button');
        clusterEl.setAttribute('tabindex', '0');
        clusterEl.setAttribute('aria-label', `${kangraProjects.length} Projects in Kangra Valley`);

        clusterEl.innerHTML = `
          <div class="cluster-beacon-ring"></div>
          <div class="cluster-core">
            <span class="cluster-num">${kangraProjects.length}</span>
            <span class="cluster-tag">PROJ</span>
          </div>
          <div class="cluster-tooltip">
            <strong>KANGRA VALLEY</strong>
            <span>${kangraProjects.length} Projects · Click to Expand</span>
          </div>
        `;

        clusterEl.addEventListener('click', (ev) => {
          ev.stopPropagation();
          map.fitBounds([
            [76.15, 31.98],
            [76.75, 32.28]
          ], {
            padding: 90,
            duration: 1100
          });
        });

        // Position Kangra Valley regional cluster at Kangra (76.28°E, 32.10°N), giving generous distance (~70px) from Palampur Studio (76.54°E, 32.12°N)
        const clusterMarker = new maplibregl.Marker({ element: clusterEl, anchor: 'center' })
          .setLngLat([76.28, 32.10])
          .addTo(map);

        (clusterMarker as any)._kangraProjects = kangraProjects;
        clusterMarkersRef.current.push(clusterMarker);

        // Toggle cluster vs individual pins based on zoom
        const checkZoom = () => {
          const z = map.getZoom();
          const showCluster = z < 9.5;
          clusterEl.style.display = showCluster ? 'flex' : 'none';
          kangraProjects.forEach(p => {
            const m = projectMarkersRef.current.find(mk => {
              const pos = mk.getLngLat();
              return Math.abs(pos.lng - p.lng) < 0.001 && Math.abs(pos.lat - p.lat) < 0.001;
            });
            if (m) {
              m.getElement().style.display = showCluster ? 'none' : 'block';
            }
          });
        };

        map.on('zoom', checkZoom);
        checkZoom();
      }

      // Fit camera to encompass all studio points with desktop card offset
      fitAllPoints(false);

      onMapLoaded?.();
    });

    return () => {
      window.removeEventListener('click', handleDocumentClick);
      canvas.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
      stopTurntable();
      clearFlightTimeouts();
      if (debouncedDensityRef.current) {
        clearTimeout(debouncedDensityRef.current);
      }
      projectMarkersRef.current.forEach(m => m.remove());
      officeMarkersRef.current.forEach(m => m.remove());
      cityMarkersRef.current.forEach(m => m.remove());
      clusterMarkersRef.current.forEach(m => m.remove());
      map.remove();
      mapInstanceRef.current = null;
      demSourceRef.current = null;
    };
  }, [projects, onMapLoaded, selectProject, selectOffice, closePanel, stopTurntable, clearFlightTimeouts]);

  return (
    <div className="map-frame hero-map-frame" style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* Map Header with discipline icons */}
      <div className="map-header">
        <div className="map-header-tagline" aria-label="Practice disciplines: Architecture, Landscape, Interior, Conservation">
          <span className="map-discipline" data-index="0">
            <svg className="discipline-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
              <rect x="2" y="8" width="12" height="6" rx="0.5" />
              <path d="M5 8V5l3-3 3 3v3" />
            </svg>
            <span className="discipline-word">Architecture</span>
          </span>
          <span className="discipline-sep" aria-hidden="true">·</span>
          <span className="map-discipline" data-index="1">
            <svg className="discipline-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
              <path d="M2 12c2-4 4-6 6-6s4 2 6 6" />
              <circle cx="8" cy="5" r="1.5" />
              <path d="M4 12c1-2 2-3 4-3" />
            </svg>
            <span className="discipline-word">Landscape</span>
          </span>
          <span className="discipline-sep" aria-hidden="true">·</span>
          <span className="map-discipline" data-index="2">
            <svg className="discipline-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
              <rect x="3" y="3" width="10" height="10" rx="0.5" />
              <path d="M6 7h4M6 9h2" />
              <path d="M5 5h6" />
            </svg>
            <span className="discipline-word">Interior</span>
          </span>
          <span className="discipline-sep" aria-hidden="true">·</span>
          <span className="map-discipline" data-index="3">
            <svg className="discipline-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
              <path d="M8 2l1.5 3 3.5.5-2.5 2.5.6 3.5L8 10l-3.1 1.5.6-3.5L3 5.5l3.5-.5z" />
            </svg>
            <span className="discipline-word">Conservation</span>
          </span>
        </div>

        <span className="map-label-right">
          <span className="north-marker" aria-label="North indicator">
            <img src="/mouseicon.svg" alt="North indicator" className="north-symbol-img" />
            <span className="north-label">N</span>
          </span>
        </span>
      </div>

      {/* Intro Statement Card */}
      <aside className={`hero-statement-card ${isPanelOpen ? 'is-hidden' : ''}`} aria-label="Practice Introduction">
        <h1 className="hero-statement-title">
          Context leads.<br />
          Design <em>responds.</em>
        </h1>
        <div className="hero-statement-divider" aria-hidden="true"></div>
        <p className="hero-statement-desc">
          Dovetail Architecture works at the intersection of place, purpose and people. Our projects are guided by context, crafted with clarity, and built to last.
        </p>
        <a href="#work" className="hero-statement-cta" id="hero-explore-btn">
          <span>EXPLORE PROJECTS</span>
          <span className="cta-arrow" aria-hidden="true">&rarr;</span>
        </a>
        <div className="hero-statement-kpi" aria-label="Practice metrics">
          <div className="kpi-item">
            <span className="kpi-num">20+</span>
            <span className="kpi-label">PROJECTS</span>
          </div>
          <div className="kpi-divider" aria-hidden="true"></div>
          <div className="kpi-item">
            <span className="kpi-num">6+</span>
            <span className="kpi-label">YEARS</span>
          </div>
          <div className="kpi-divider" aria-hidden="true"></div>
          <div className="kpi-item">
            <span className="kpi-num">8</span>
            <span className="kpi-label">STATES</span>
          </div>
        </div>
      </aside>

      {/* Map Canvas */}
      <div className="map-canvas-wrap hero-map-canvas" id="map-canvas-wrap">
        <div
          ref={mapContainerRef}
          style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}
        />

        {/* Circular Vignette Architectural Lens Mask over 3D Terrain */}
        <div className="terrain-circular-mask" id="terrain-circular-mask" aria-hidden="true" />

        {/* Map View Controls */}
        <div className="map-view-controls" aria-label="Map view controls">
          <button
            className="map-control-btn"
            id="map-recenter-btn"
            title="Reset Map to Overview"
            onClick={resetMap}
          >
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="12" cy="12" r="8" />
              <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
            </svg>
            <span>RESET MAP</span>
          </button>

          {/* Universal Options Dropdown Arrow Toggle Button */}
          <button
            className={`map-control-btn map-dropdown-toggle ${isControlsOpen ? 'map-control-btn--active' : ''}`}
            id="map-controls-dropdown-btn"
            title="Toggle Map Options"
            onClick={() => setIsControlsOpen(prev => !prev)}
            aria-expanded={isControlsOpen}
          >
            <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.8">
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="18" x2="20" y2="18" />
            </svg>
            <span>OPTIONS</span>
            <svg
              className="dropdown-chevron-svg"
              viewBox="0 0 12 12"
              width="9"
              height="9"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              style={{
                transform: isControlsOpen ? 'rotate(180deg)' : 'none',
                transition: 'transform 0.25s ease'
              }}
            >
              <path d="M2.5 4.5L6 8l3.5-3.5" />
            </svg>
          </button>

          {/* Collapsible Controls Drawer (always open on desktop, toggled via dropdown on mobile) */}
          <div className={`map-collapsible-controls ${isControlsOpen ? 'is-open' : ''}`}>
            <button
              className={`map-control-btn ${is3D ? 'map-control-btn--active' : ''}`}
              id="map-tilt-btn"
              title="Toggle 3D Perspective Tilt"
              onClick={toggle3DTilt}
            >
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
              <span>3D TILT</span>
            </button>
            <button
              className={`map-control-btn ${showContourColors ? 'map-control-btn--active' : ''}`}
              id="map-color-btn"
              title={showContourColors ? "Switch Contours to Monochrome B&W" : "Switch Contours to Elevation Color"}
              onClick={toggleContourColors}
            >
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor" />
              </svg>
              <span>COLOR</span>
            </button>

            {/* Contour Density Slider */}
            <div
              className={`map-control-density ${is3D ? 'is-disabled' : ''}`}
              id="map-density-control"
              title={is3D ? "Contour density slider (Contours hidden in 3D terrain mode)" : `Contour density: ${DENSITY_NAMES[densityLevel]}`}
            >
              <div className="density-header">
                <span className="density-label">CONTOURS</span>
                <span className="density-badge">{DENSITY_NAMES[densityLevel]}</span>
              </div>
              <input
                type="range"
                min={1}
                max={5}
                step={1}
                value={densityLevel}
                disabled={is3D}
                onChange={(e) => handleDensityChange(parseInt(e.target.value, 10))}
                className="density-range-input"
                id="density-slider"
                aria-label="Contour density slider"
              />
              <div className="density-scale-labels" aria-hidden="true">
                <span>MIN</span>
                <span>MED</span>
                <span>MAX</span>
              </div>
            </div>
            <label className="map-control-toggle" id="map-cities-toggle" title="Toggle Place and City Names" role="button">
              <input
                type="checkbox"
                id="cities-toggle-checkbox"
                checked={showPlaces}
                onChange={(e) => togglePlacesVisibility(e.target.checked)}
              />
              <span className="custom-checkbox-box">
                <svg className="check-svg" viewBox="0 0 12 12" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M2.5 6l2.5 2.5 4.5-5" />
                </svg>
              </span>
              <span>PLACE</span>
            </label>
            <label className="map-control-toggle" id="map-boundary-toggle" title="Toggle India National Boundary" role="button">
              <input
                type="checkbox"
                id="boundary-toggle-checkbox"
                checked={showBoundary}
                onChange={(e) => toggleBoundaryVisibility(e.target.checked)}
              />
              <span className="custom-checkbox-box">
                <svg className="check-svg" viewBox="0 0 12 12" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M2.5 6l2.5 2.5 4.5-5" />
                </svg>
              </span>
              <span>INDIA BOUNDARY</span>
            </label>
          </div>
        </div>

        {/* Project Panel (Docked inside map frame, right 2/3rd) */}
        <aside
          id="project-panel"
          className={`${isPanelOpen ? 'open' : ''} ${activeItem?.type === 'project' ? 'has-hero' : ''}`}
          aria-hidden={!isPanelOpen}
        >
          {activeItem && activeItem.type === 'project' && (
            <>
              {(() => {
                const project = activeItem.data as Project;
                const projectImgs = (project.images && project.images.length > 0)
                  ? project.images
                  : (project.heroImage ? [project.heroImage] : []);
                const safeMediaIdx = Math.min(currentMediaIdx, Math.max(0, projectImgs.length - 1));
                const currentImg = projectImgs[safeMediaIdx] || project.heroImage || '';
                const projectIdx = projects.findIndex((p) => p.id === project.id) + 1 || 1;
                const totalProjects = projects.length;
                const catColor = project.color || '#999';

                // Altitude formatted
                const altText = project.alt || '—';

                // Coordinates display
                const lat = project.lat.toFixed(4);
                const lng = project.lng.toFixed(4);
                const latDir = project.lat >= 0 ? 'N' : 'S';
                const lngDir = project.lng >= 0 ? 'E' : 'W';

                return (
                  <>
                    <div className="panel-sticky-header">
                      <span className="panel-header-tag">PROJECT BRIEF</span>
                      <button
                        className="panel-close-btn"
                        id="panel-close"
                        aria-label="Close project panel"
                        onClick={closePanel}
                      >
                        <span>CLOSE</span>
                        <svg viewBox="0 0 14 14" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.6">
                          <path d="M1 1L13 13M13 1L1 13" />
                        </svg>
                      </button>
                    </div>

                    <div className="panel-content" id="panel-content">
                      {/* HERO IMAGE with nav arrows */}
                      <div
                        className="panel-hero"
                        id="panel-hero-img"
                        style={{ backgroundImage: `url('${currentImg}')` }}
                      >
                        <div className="panel-hero-gradient"></div>

                        {/* Image navigation arrows */}
                        {projectImgs.length > 1 && (
                          <>
                            <button
                              type="button"
                              className="panel-hero-nav prev"
                              id="panel-prev-btn"
                              aria-label="Previous image"
                              onClick={(e) => {
                                e.stopPropagation();
                                setCurrentMediaIdx((prev) => (prev - 1 + projectImgs.length) % projectImgs.length);
                              }}
                            >
                              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8">
                                <path d="M12 4l-6 6 6 6" />
                              </svg>
                            </button>
                            <button
                              type="button"
                              className="panel-hero-nav next"
                              id="panel-next-btn"
                              aria-label="Next image"
                              onClick={(e) => {
                                e.stopPropagation();
                                setCurrentMediaIdx((prev) => (prev + 1) % projectImgs.length);
                              }}
                            >
                              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8">
                                <path d="M8 4l6 6-6 6" />
                              </svg>
                            </button>
                          </>
                        )}

                        {/* Image counter pill */}
                        {projectImgs.length > 1 && (
                          <div className="panel-hero-counter">
                            <span id="panel-img-counter">{String(safeMediaIdx + 1).padStart(2, '0')}</span>
                            <span className="panel-hero-counter-sep"> / </span>
                            <span>{String(projectImgs.length).padStart(2, '0')}</span>
                          </div>
                        )}

                        {/* Hero text overlay */}
                        <div className="panel-hero-content">
                          <div className="panel-hero-badge">
                            <span className="panel-hero-cat-dot" style={{ background: catColor }}></span>
                            <span className="panel-hero-cat-label">{project.category ? project.category.toUpperCase() : ''}</span>
                            <span className="panel-hero-divider">·</span>
                            <span className="panel-hero-num">
                              {String(projectIdx).padStart(2, '0')} / {String(totalProjects).padStart(2, '0')}
                            </span>
                          </div>
                          <h2 className="panel-hero-title">{project.name}</h2>
                          <div className="panel-hero-loc-row">
                            <div className="panel-hero-loc">
                              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                                <path d="M8 14s-5-3.5-5-7a5 5 0 0 1 10 0c0 3.5-5 7-5 7z" />
                                <circle cx="8" cy="7" r="1.8" />
                              </svg>
                              <span>{project.location}</span>
                            </div>
                            <Link
                              href={`/projects/${project.slug}`}
                              className="panel-hero-quick-link"
                              aria-label="Open full project"
                            >
                              <span>FULL PROJECT</span>
                              <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M2.5 9.5l7-7M4 2.5h5.5V8" />
                              </svg>
                            </Link>
                          </div>
                        </div>
                      </div>

                      {/* Thumbnail photo strip */}
                      {projectImgs.length > 1 && (
                        <div className="panel-photo-strip">
                          {projectImgs.slice(0, 7).map((img, i) => (
                            <button
                              key={i}
                              type="button"
                              className={`panel-photo-thumb ${i === safeMediaIdx ? 'active' : ''}`}
                              onClick={() => setCurrentMediaIdx(i)}
                              aria-label={`Photo ${i + 1}`}
                            >
                              <img src={img} alt={`${project.name} photo ${i + 1}`} loading="lazy" />
                              {i === 6 && projectImgs.length > 7 && (
                                <div className="panel-photo-more">+{projectImgs.length - 7}</div>
                              )}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Action Buttons Row */}
                      <div className="panel-hero-actions">
                        <Link
                          href={`/projects/${project.slug}`}
                          className="panel-cta-primary"
                          id="panel-project-btn"
                          aria-label="View Full Project details"
                        >
                          <span className="panel-cta-label">VIEW FULL PROJECT</span>
                          <span className="panel-cta-arrow">
                            <svg viewBox="0 0 20 14" fill="none" stroke="currentColor" strokeWidth="1.6">
                              <path d="M1 7h17M13 1l6 6-6 6" />
                            </svg>
                          </span>
                        </Link>
                        <button
                          type="button"
                          className="panel-cta-secondary"
                          id="panel-view-map-btn"
                          aria-label="View project on interactive 3D map"
                          onClick={() => flyToLocation(project.lng, project.lat, project.alt, 12.3)}
                        >
                          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <circle cx="8" cy="8" r="6.2" />
                            <circle cx="8" cy="8" r="2" fill="currentColor" />
                            <path d="M8 1v2.5M8 12.5V15M1 8h2.5M12.5 8H15" />
                          </svg>
                          <span>VIEW ON MAP</span>
                        </button>
                      </div>

                      {/* Main body: 2-Column Layout */}
                      <div className="panel-body panel-body-2col">
                        {/* Left Column: Description & Context Strip */}
                        <div className="panel-body-left">
                          <div className="panel-description-section">
                            <div className="panel-section-label">PROJECT BRIEF</div>
                            {project.lead && (
                              <p className="panel-lead-text">{project.lead}</p>
                            )}
                            {project.description && project.description !== project.lead && (
                              <div className="panel-narrative-text">
                                {project.description.split('\n\n').map((para, idx) => (
                                  <p key={idx}>{para}</p>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Category context strip */}
                          <div className="panel-context-strip">
                            <div className="panel-context-cat" style={{ '--cat': catColor } as React.CSSProperties}>
                              <span className="panel-context-cat-dot"></span>
                              <span className="panel-context-cat-text">{project.category}</span>
                            </div>
                            <div className="panel-context-divider"></div>
                            <div className="panel-context-practice">
                              <span>Dovetail Architecture</span>
                              <span className="panel-context-practice-sep">—</span>
                              <span>Western Himalayas</span>
                            </div>
                          </div>
                        </div>

                        {/* Right Column: Meta Info, Tectonic Specs, Plates & Coordinates */}
                        <div className="panel-body-right">
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            {/* Meta data grid — 4 cells */}
                            <div className="panel-meta-grid">
                              <div className="panel-meta-cell">
                                <div className="panel-meta-icon" aria-hidden="true">
                                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
                                    <path d="M8 14s-5-3.5-5-7a5 5 0 0 1 10 0c0 3.5-5 7-5 7z" />
                                    <circle cx="8" cy="7" r="1.8" />
                                  </svg>
                                </div>
                                <div className="panel-meta-text">
                                  <span className="panel-meta-label">LOCATION</span>
                                  <span className="panel-meta-value">{project.location}</span>
                                </div>
                              </div>
                              <div className="panel-meta-cell">
                                <div className="panel-meta-icon" aria-hidden="true">
                                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
                                    <path d="M8 2v3M8 11v3M3.5 5.5l2.1 2.1M10.4 10.4l2.1 2.1M2 8h3M11 8h3M5.6 10.4L3.5 12.5M12.5 3.5l-2.1 2.1" />
                                  </svg>
                                </div>
                                <div className="panel-meta-text">
                                  <span className="panel-meta-label">ELEVATION</span>
                                  <span className="panel-meta-value">{altText}</span>
                                </div>
                              </div>
                              <div className="panel-meta-cell">
                                <div className="panel-meta-icon" aria-hidden="true">
                                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
                                    <rect x="2" y="3" width="12" height="11" rx="1" />
                                    <path d="M11 2v2M5 2v2M2 7h12" />
                                  </svg>
                                </div>
                                <div className="panel-meta-text">
                                  <span className="panel-meta-label">YEAR</span>
                                  <span className="panel-meta-value">{project.year}</span>
                                </div>
                              </div>
                              <div className="panel-meta-cell">
                                <div className="panel-meta-icon" aria-hidden="true">
                                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
                                    <rect x="2" y="9" width="12" height="5" rx="0.5" />
                                    <path d="M5 9V6l3-3 3 3v3" />
                                  </svg>
                                </div>
                                <div className="panel-meta-text">
                                  <span className="panel-meta-label">TYPOLOGY</span>
                                  <span className="panel-meta-value">{project.type}</span>
                                </div>
                              </div>
                            </div>

                            {/* Tectonic Specifications Band */}
                            <div className="panel-specs-band">
                              <div className="panel-spec-item">
                                <span className="panel-spec-label">STRUCTURAL SYSTEM</span>
                                <span className="panel-spec-value">{project.structure || 'Vernacular Timber Joinery & Local Rubble Masonry'}</span>
                              </div>
                              <div className="panel-spec-item">
                                <span className="panel-spec-label">SITE FOOTPRINT</span>
                                <span className="panel-spec-value">{project.siteArea || 'Alpine Himalayan Terrain'}</span>
                              </div>
                            </div>

                            {/* Documentation & Architectural Plates Strip */}
                            {projectImgs.length > 2 && (
                              <div className="panel-drawings-band">
                                <div className="panel-drawings-header">
                                  <span className="panel-spec-label">DOCUMENTATION & ARCHITECTURAL PLATES</span>
                                  <span className="panel-drawings-count">{projectImgs.length} PLATES AVAILABLE</span>
                                </div>
                                <div className="panel-drawings-strip">
                                  {projectImgs.slice(0, 7).map((img, i) => (
                                    <button
                                      key={i}
                                      type="button"
                                      className={`panel-drawing-thumb ${i === safeMediaIdx ? 'active' : ''}`}
                                      onClick={() => setCurrentMediaIdx(i)}
                                      title={`View documentation plate ${i + 1}`}
                                    >
                                      <img src={img} alt={`${project.name} plate ${i + 1}`} loading="lazy" />
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Coordinates display band */}
                          <div className="panel-coords-band">
                            <div className="panel-coords-label">
                              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
                                <circle cx="8" cy="8" r="6" />
                                <path d="M2 8h12M8 2c-1.5 2-2.5 4-2.5 6s1 4 2.5 6M8 2c1.5 2 2.5 4 2.5 6S9.5 14 8 14" />
                              </svg>
                              <span>COORDINATES</span>
                            </div>
                            <div className="panel-coords-value">
                              <span className="coord-part">{lat}° {latDir}</span>
                              <span className="coord-dot">·</span>
                              <span className="coord-part">{lng}° {lngDir}</span>
                            </div>
                            <a
                              className="panel-coords-map-link"
                              href={`https://maps.google.com/?q=${project.lat},${project.lng}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label="Open in Google Maps"
                            >
                              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M7 3H3v10h10v-4M9 3h4v4M14 2l-6 6" />
                              </svg>
                              <span>GOOGLE MAPS</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                );
              })()}
            </>
          )}

          {activeItem && activeItem.type === 'office' && (
            <>
              {(() => {
                const office = activeItem.data as Office;
                return (
                  <>
                    <div className="panel-sticky-header">
                      <span className="panel-header-tag">STUDIO PROFILE</span>
                      <button
                        className="panel-close-btn"
                        id="panel-close"
                        aria-label="Close project panel"
                        onClick={closePanel}
                      >
                        <span>CLOSE</span>
                        <svg viewBox="0 0 14 14" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.6">
                          <path d="M1 1L13 13M13 1L1 13" />
                        </svg>
                      </button>
                    </div>
                    <div className="panel-content" id="panel-content" style={{ padding: '24px 32px', overflowY: 'auto', flex: 1 }}>
                      <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: '#c9a87c', letterSpacing: '0.14em', marginBottom: '8px' }}>
                        HEADQUARTERS / MAIN STUDIO
                      </div>
                      <h2 style={{ fontFamily: 'var(--serif)', fontSize: '32px', margin: '0 0 12px', lineHeight: 1.15 }}>
                        {office.name} Studio
                      </h2>
                      <p style={{ fontSize: '14px', lineHeight: 1.85, color: '#333' }}>
                        The core design laboratory of Dovetail Architecture. Situated in the Kangra Valley beneath the Dhauladhar Range, our Palampur studio drives research into Himalayan vernacular materials, high-altitude conservation, and sustainable mountain dwellings.
                      </p>
                      <div style={{ margin: '24px 0', borderTop: '1px solid var(--line)', paddingTop: '20px', fontFamily: 'var(--mono)', fontSize: '11px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div>
                          <span style={{ color: 'var(--muted)', display: 'block', marginBottom: '2px' }}>ADDRESS</span>
                          <span>{office.address}</span>
                        </div>
                        <div>
                          <span style={{ color: 'var(--muted)', display: 'block', marginBottom: '2px' }}>ALTITUDE</span>
                          <span>{office.alt}</span>
                        </div>
                        <div>
                          <span style={{ color: 'var(--muted)', display: 'block', marginBottom: '2px' }}>COORDINATES</span>
                          <span>{office.lat.toFixed(4)}°N, {office.lng.toFixed(4)}°E</span>
                        </div>
                      </div>
                    </div>
                  </>
                );
              })()}
            </>
          )}
        </aside>

        {/* Zoom In / Zoom Out Controls (+ / -) in Bottom Right */}
        <div className="map-zoom-controls" aria-label="Map zoom controls">
          <button
            type="button"
            className="map-zoom-btn"
            id="map-zoom-in"
            title="Zoom In"
            onClick={handleZoomIn}
            aria-label="Zoom In"
          >
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
          <div className="map-zoom-divider" aria-hidden="true" />
          <button
            type="button"
            className="map-zoom-btn"
            id="map-zoom-out"
            title="Zoom Out"
            onClick={handleZoomOut}
            aria-label="Zoom Out"
          >
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Map Footer with horizontal filterable legend and elevation */}
      <div className="map-footer">
        <div id="map-legend-horizontal" className="map-legend-horizontal">
          <div className="legend-items-horizontal">
            {LEGEND_CATEGORIES.map((cat) => {
              const isSelected = activeFilter === cat.key;
              return (
                <div
                  key={cat.key}
                  className={`legend-item legend-item-typology ${isSelected ? 'is-active' : ''}`}
                  data-filter={cat.key}
                  tabIndex={0}
                  role="button"
                  aria-label={`Filter by ${cat.label}`}
                  onClick={() => handleFilterClick(cat.key)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 8px',
                    borderRadius: '2px',
                    background: isSelected ? 'rgba(17, 17, 17, 0.08)' : 'transparent',
                    cursor: 'pointer'
                  }}
                >
                  <span className="legend-dot" style={{ background: cat.color, width: '7px', height: '7px', borderRadius: '50%' }}></span>
                  <span className="legend-item-name" style={{ fontFamily: 'var(--mono)', fontSize: '8px', letterSpacing: '0.08em' }}>{cat.label}</span>
                  <span className="legend-count" style={{ fontFamily: 'var(--mono)', fontSize: '7px', color: 'var(--muted)' }}>{cat.count}</span>
                </div>
              );
            })}
            {activeFilter && (
              <button
                className="legend-reset-btn"
                id="legend-reset-btn"
                title="Reset filter"
                onClick={clearFilter}
                style={{
                  fontFamily: 'var(--mono)',
                  fontSize: '7.5px',
                  letterSpacing: '0.12em',
                  padding: '3px 8px',
                  border: '1px solid var(--line-med)',
                  background: 'transparent',
                  cursor: 'pointer',
                  marginLeft: '8px'
                }}
              >
                RESET
              </button>
            )}
          </div>
        </div>

        <span id="elevationReadout" className="map-elevation-readout">
          {elevation}
        </span>
      </div>
    </div>
  );
};
