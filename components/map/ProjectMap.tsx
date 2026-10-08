'use client';

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import maplibregl, { Map as MapLibreInstance, Marker } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import mlcontour from 'maplibre-contour';
import { Project } from '@/types/project';
import { OFFICES, MAJOR_CITIES, LEGEND_CATEGORIES, Office } from '@/lib/data/mapData';
import { testProjectFilterMatch } from '@/lib/data/projects';
import Link from 'next/link';

export type PlaceColorMode = 'grey' | 'black' | 'pink';

export const PLACE_COLOR_CONFIG: Record<PlaceColorMode, { label: string; text: string; dot: string; capitalDot: string }> = {
  grey: {
    label: 'GREY',
    text: '#555a64',
    dot: '#555a64',
    capitalDot: '#3a3e47'
  },
  black: {
    label: 'BLACK',
    text: '#11141a',
    dot: '#222222',
    capitalDot: '#000000'
  },
  pink: {
    label: 'PINK',
    text: '#B82458',
    dot: '#B82458',
    capitalDot: '#B82458'
  }
};

// Place/City Names Default Architectural Color (Defaults to Grey #555a64 for design consistency)
export const DEFAULT_PLACE_COLOR = PLACE_COLOR_CONFIG.grey.text;
export const PINK_PLACE_COLOR = PLACE_COLOR_CONFIG.pink.text;
export const BLACK_PLACE_COLOR = PLACE_COLOR_CONFIG.black.text;

// Architectural Monochrome (Default B&W Mode)
const BW_MINOR_LINE_COLOR: any = '#3a3d44';
const BW_MINOR_OPACITY: any = [
  'interpolate', ['linear'], ['zoom'],
  4,  0.25,
  7,  0.34,
  10, 0.44,
  13, 0.54
];
const BW_MAJOR_LINE_COLOR: any = '#181b20';
const BW_MAJOR_OPACITY: any = [
  'interpolate', ['linear'], ['zoom'],
  4,  0.45,
  7,  0.55,
  10, 0.68,
  13, 0.80
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
// Detailed, lightweight contouring scaled specifically for Himalayan topography
const DENSITY_PRESETS: Record<number, Record<number, [number, number]>> = {
  1: { // SPARSE - Maximum performance, airy spacing
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
    14: [10, 50],
    15: [5, 25]
  },
  2: { // BALANCED / DETAILED (DEFAULT) - Light, crisp architectural curves & rich 3D relief
    4: [120, 600],
    5: [90, 450],
    6: [70, 350],
    7: [50, 250],
    8: [35, 175],
    9: [25, 125],
    10: [20, 100],
    11: [15, 75],
    12: [10, 50],
    13: [6, 30],
    14: [4, 20],
    15: [2.5, 12.5],
    16: [1.5, 7.5]
  },
  3: { // MEDIUM - Topographic survey
    4: [100, 500],
    5: [80, 400],
    6: [60, 300],
    7: [40, 200],
    8: [30, 150],
    9: [20, 100],
    10: [15, 75],
    11: [8, 40],
    12: [5, 25],
    13: [3, 15],
    14: [2, 10],
    15: [1, 5]
  },
  4: { // DENSE - Rich topographic survey
    4: [60, 300],
    5: [50, 250],
    6: [35, 175],
    7: [25, 125],
    8: [18, 90],
    9: [12, 60],
    10: [10, 50],
    11: [5, 25],
    12: [3, 15],
    13: [2, 10],
    14: [1.2, 6],
    15: [0.8, 4],
    16: [0.5, 2.5]
  },
  5: { // HIGH - Ultra-detailed alpine contouring
    4: [40, 200],
    5: [30, 150],
    6: [20, 100],
    7: [15, 75],
    8: [10, 50],
    9: [8, 40],
    10: [6, 30],
    11: [4, 20],
    12: [2.5, 12.5],
    13: [1.5, 7.5],
    14: [1, 5],
    15: [0.6, 3],
    16: [0.4, 2]
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

const ProjectMapComponent: React.FC<ProjectMapProps> = ({
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
  const headerNorthRef = useRef<HTMLDivElement>(null);

  const [activeItem, setActiveItem] = useState<{ type: 'project' | 'office'; data: Project | Office } | null>(null);
  const [currentMediaIdx, setCurrentMediaIdx] = useState<number>(0);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [is3D, setIs3D] = useState(false);
  const [showPlaces, setShowPlaces] = useState(true);
  const [placeColorMode, setPlaceColorMode] = useState<PlaceColorMode>('grey'); // Default: 'grey' for architectural consistency
  const [showBoundary, setShowBoundary] = useState(true);
  const [showContourColors, setShowContourColors] = useState(false);
  const showContourColorsRef = useRef(false);
  const [densityLevel, setDensityLevel] = useState<number>(2); // Level 2 = LOW (Default)
  const densityLevelRef = useRef<number>(2);
  const debouncedDensityRef = useRef<NodeJS.Timeout | null>(null);
  const [isControlsOpen, setIsControlsOpen] = useState(false);

  // Dynamic portfolio statistics calculated from projects dataset
  const practiceStats = useMemo(() => {
    const total = projects.length;

    // Active years span based on projects
    const years = projects
      .map((p) => parseInt(p.year || '0', 10))
      .filter((y) => !isNaN(y) && y > 2000);
    const minYear = years.length > 0 ? Math.min(...years) : 2017;
    const currentYear = new Date().getFullYear();
    const activeYears = Math.max(1, currentYear - minYear + 1);

    // Dynamic distinct states / territories calculation (Himachal Pradesh, Ladakh, Uttarakhand, etc.)
    const states = new Set(
      projects.map((p) => {
        if (p.state && p.state.trim()) return p.state.trim().toLowerCase();
        const loc = (p.location || '').toLowerCase();
        if (loc.includes('ladakh')) return 'ladakh';
        if (loc.includes('h.p.') || loc.includes('himachal') || loc.includes('kangra') || loc.includes('palampur') || loc.includes('dharamshala') || loc.includes('shimla') || loc.includes('lahaul')) return 'himachal pradesh';
        if (loc.includes('u.k.') || loc.includes('uttarakhand') || loc.includes('garhwal') || loc.includes('chamoli') || loc.includes('pauri')) return 'uttarakhand';
        return (p.country || 'himachal pradesh').toLowerCase();
      }).filter(Boolean)
    ).size;

    return { total, years: `${activeYears}+`, states };
  }, [projects]);

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
  const isPanelHoveredRef = useRef<boolean>(false);
  const lastUserInteractionTimeRef = useRef<number>(0);
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
    const panelEl = typeof document !== 'undefined' ? document.getElementById('project-panel') : null;
    const panelWidth = isDesktop
      ? (panelEl && panelEl.offsetWidth > 100 ? panelEl.offsetWidth : Math.round(w * (2 / 3)))
      : 0;
    return isDesktop
      ? { top: 70, bottom: 70, left: 0, right: panelWidth }
      : { top: 60, bottom: 60, left: 20, right: 20 };
  }, []);

  // Circular Vignette Mask (Disabled - clean full-bleed 3D terrain)
  const showCircularMask = useCallback((_targetLng?: number, _targetLat?: number) => {}, []);
  const hideCircularMask = useCallback(() => {}, []);

  // Compensates for 3D terrain elevation under pitched perspective view.
  const getCompensatedCenter = useCallback((lng: number, lat: number, elevM = 1500, pitchDeg = 46, bearingDeg = 0): [number, number] => {
    if (pitchDeg <= 0) return [lng, lat];
    const elev = elevM > 0 ? elevM : 1500;
    const terrainExaggeration = 1.25;
    const effectiveElev = elev * terrainExaggeration;
    const pitchRad = (pitchDeg * Math.PI) / 180;
    const bearingRad = (bearingDeg * Math.PI) / 180;
    const latRad = (lat * Math.PI) / 180;

    const effectiveDist = effectiveElev * Math.tan(pitchRad);
    const metersPerDegLat = 111195;
    const metersPerDegLng = 111195 * Math.cos(latRad);

    const dLat = (effectiveDist * Math.cos(bearingRad)) / metersPerDegLat;
    const dLng = (effectiveDist * Math.sin(bearingRad)) / metersPerDegLng;

    return [lng + dLng, lat + dLat];
  }, []);

  // Smooth cinematic turntable showcase orbit: throttled to 30fps, pauses on user interaction/hover to ensure zero lag
  const startTurntable = useCallback((lng: number, lat: number, padding: { top: number; bottom: number; left: number; right: number }, targetPitch = 46, targetZoom = 13.8, elevM = 1500, startBearing = 0) => {
    stopTurntable();
    autoRotateRef.current = true;
    turntableBearingRef.current = startBearing;
    turntableTargetRef.current = { lng, lat, padding, pitch: targetPitch, zoom: targetZoom, elevation: elevM };

    const startTime = performance.now();
    let lastTime = startTime;
    let lastRenderTime = 0;
    const speedDegPerSec = 7.2; // ~50s per 360° revolution
    const maxOrbitDurationSec = 22; // Showcase tour rests gracefully after 22s to conserve GPU

    const orbitFrame = (now: number) => {
      const map = mapInstanceRef.current;
      if (!autoRotateRef.current || !map || !turntableTargetRef.current || isOrbitingRef.current) {
        return;
      }

      // Check if showcase tour reached graceful rest
      const elapsedOrbit = (now - startTime) / 1000;
      if (elapsedOrbit > maxOrbitDurationSec) {
        stopTurntable();
        return;
      }

      // 1. If user is actively hovering over project panel (reading text/photos) or actively moving mouse, pause rendering
      if (isPanelHoveredRef.current || (now - lastUserInteractionTimeRef.current < 300)) {
        turntableRafRef.current = requestAnimationFrame(orbitFrame);
        lastTime = now;
        return;
      }

      // 2. Throttle camera updates to ~32ms (~30fps) to leave 70% frame budget open for compositor and mouse cursor
      if (now - lastRenderTime < 32) {
        turntableRafRef.current = requestAnimationFrame(orbitFrame);
        return;
      }
      lastRenderTime = now;

      const deltaSec = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // Silky acceleration ramp over the first 1.2s so the camera eases into orbit
      const ramp = Math.min(elapsedOrbit / 1.2, 1);
      const currentSpeed = speedDegPerSec * (ramp * ramp * (3 - 2 * ramp));

      turntableBearingRef.current = (turntableBearingRef.current + currentSpeed * deltaSec) % 360;

      // Camera centers and orbits using cached padding (zero DOM layout reflow)
      map.jumpTo({
        center: [turntableTargetRef.current.lng, turntableTargetRef.current.lat],
        bearing: turntableBearingRef.current,
        pitch: turntableTargetRef.current.pitch,
        zoom: turntableTargetRef.current.zoom,
        padding: turntableTargetRef.current.padding
      });

      // Synchronize True North indicator with current camera rotation & 3D perspective pitch
      const rot = -turntableBearingRef.current;
      const pitch = turntableTargetRef.current.pitch;
      if (headerNorthRef.current) {
        headerNorthRef.current.style.transform = `perspective(350px) rotateX(${pitch}deg) rotateZ(${rot}deg)`;
      }

      turntableRafRef.current = requestAnimationFrame(orbitFrame);
    };

    turntableRafRef.current = requestAnimationFrame(orbitFrame);
  }, [stopTurntable]);

  const enable3DTerrain = useCallback((map: MapLibreInstance) => {
    try {
      // Only set terrain if not already active to avoid clearing GPU elevation mesh buffers
      if (!map.getTerrain()) {
        map.setTerrain({ source: 'dem', exaggeration: 1.25 });
      }
      if (map.getLayer('hillshade')) {
        map.setLayoutProperty('hillshade', 'visibility', 'visible');
      }
      // Ensure contour lines and elevation labels remain visible on 3D topography
      ['contour-minor', 'contour-major', 'contour-labels'].forEach(id => {
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
      // Keep DEM terrain prewarmed in GPU memory, but hide hillshade so 2D overview remains clean & flat
      if (map.getLayer('hillshade')) {
        map.setLayoutProperty('hillshade', 'visibility', 'none');
      }
      // Restore contour lines and elevation labels for 2D overview
      ['contour-minor', 'contour-major', 'contour-labels'].forEach(id => {
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
    densityLevelRef.current = level;
    if (debouncedDensityRef.current) {
      clearTimeout(debouncedDensityRef.current);
    }
    debouncedDensityRef.current = setTimeout(() => {
      applyContourDensity(level);
    }, 100);
  }, [applyContourDensity]);

  // Update pin visual selection highlight and show clicked point as prominent on top with other points at 70% opacity in 3D
  const updatePinHighlights = useCallback((activeLng: number | null, activeLat: number | null, instant = false) => {
    const isInspecting = activeLng != null && activeLat != null;
    const allMarkers = [...projectMarkersRef.current, ...officeMarkersRef.current];

    allMarkers.forEach(marker => {
      const el = marker.getElement();
      const pos = marker.getLngLat();
      const isMatch = isInspecting &&
        Math.abs(pos.lng - activeLng) < 0.0001 &&
        Math.abs(pos.lat - activeLat) < 0.0001;

      if (instant && isInspecting) {
        el.style.transition = 'none';
      } else {
        el.style.transition = 'opacity 0.35s ease';
      }

      if (isMatch) {
        el.classList.add('is-highlighted');
        el.classList.remove('is-inspecting-other');
        el.classList.remove('is-dimmed');
        el.style.display = '';
        el.style.opacity = '1';
        el.style.zIndex = '1000';
        el.style.pointerEvents = 'auto';
        // Hide hover label tooltip during 3D inspection so it never blocks the 3D terrain
        const label = el.querySelector('.map-pin-label');
        if (label) {
          (label as HTMLElement).style.display = 'none';
        }
      } else if (isInspecting) {
        // In 3D site focus: keep other points clearly visible with 88% opacity, on lower z-index and fully clickable
        el.classList.remove('is-highlighted');
        el.classList.add('is-inspecting-other');
        el.classList.remove('is-dimmed');
        el.style.display = '';
        el.style.opacity = '0.88';
        el.style.zIndex = '20';
        el.style.pointerEvents = 'auto';
        const label = el.querySelector('.map-pin-label');
        if (label) {
          (label as HTMLElement).style.display = '';
        }
      } else {
        // Overview mode: restore all pins to default state
        el.classList.remove('is-highlighted');
        el.classList.remove('is-inspecting-other');
        el.classList.remove('is-dimmed');
        el.style.display = '';
        el.style.opacity = '';
        el.style.zIndex = '';
        el.style.pointerEvents = 'auto';
        const label = el.querySelector('.map-pin-label');
        if (label) {
          (label as HTMLElement).style.display = '';
        }
      }
    });

    // Hide city markers during 3D site focus to save 50+ DOM transforms; restore in 2D overview
    cityMarkersRef.current.forEach(marker => {
      const el = marker.getElement();
      el.style.display = isInspecting ? 'none' : '';
      el.style.opacity = isInspecting ? '0' : '1';
      el.style.pointerEvents = isInspecting ? 'none' : 'auto';
    });

    clusterMarkersRef.current.forEach(marker => {
      const el = marker.getElement();
      el.style.display = isInspecting ? 'none' : '';
      el.style.opacity = isInspecting ? '0' : '1';
      el.style.pointerEvents = isInspecting ? 'none' : 'auto';
    });

    // Instantly hide 2D national boundary line during 3D inspection using GPU-accelerated paint property (zero relayout)
    const map = mapInstanceRef.current;
    if (map && map.getLayer('india_boundary_line')) {
      try {
        map.setPaintProperty('india_boundary_line', 'line-opacity', isInspecting ? 0 : (showBoundary ? 0.75 : 0));
      } catch (_) {}
    }
  }, [showBoundary]);

  // Silky smooth cinematic drone flight (2.2s) + 3D Terrain Activation + Turntable Orbit
  const flyToLocation = useCallback((lng: number, lat: number, altStr?: string, targetZoom = 13.8) => {
    const map = mapInstanceRef.current;
    if (!map) return;

    stopTurntable();
    clearFlightTimeouts();

    setIs3D(true);
    activePointCoordRef.current = { lng, lat };

    // Update pins without layout thrashing
    updatePinHighlights(lng, lat, false);

    // Keep contour detail clean without purging tile cache if already loaded
    if (densityLevelRef.current !== 2) {
      densityLevelRef.current = 2;
      applyContourDensity(2);
      setDensityLevel(2);
    }

    // Activate 3D terrain without re-initialization overhead
    enable3DTerrain(map);

    const padding = getDetailPadding();
    const finalPitch = 46;
    const finalBearing = map.getBearing() + 14;
    // Silky, cinematic 2.2s drone flight with zero stutter
    const duration = 2200;

    map.flyTo({
      center: [lng, lat],
      zoom: targetZoom,
      pitch: finalPitch,
      bearing: finalBearing,
      padding,
      duration,
      curve: 1.42, // Optimal Van Wijk & Nuij smooth geodesic trajectory
      speed: 1.1,
      easing: (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
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
      // Start turntable seamlessly once the flight smoothly glides to a stop
      flightTimeoutRef.current = setTimeout(() => {
        startTurntable(lng, lat, padding, finalPitch, targetZoom, 1500, finalBearing);
      }, 250);
    };

    map.once('moveend', onArrival);
    flightTimeoutRef.current = setTimeout(onArrival, duration + 600);
  }, [stopTurntable, clearFlightTimeouts, updatePinHighlights, getDetailPadding, enable3DTerrain, startTurntable, applyContourDensity]);

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

    // Restore balanced overview contour density
    applyContourDensity(2);
    setDensityLevel(2);

    if (headerNorthRef.current) {
      headerNorthRef.current.style.transform = 'perspective(350px) rotateX(0deg) rotateZ(0deg)';
    }

    const map = mapInstanceRef.current;
    if (map) {
      map.stop();
      disable3DTerrain(map);
      fitAllPoints(true);
    }
  }, [stopTurntable, clearFlightTimeouts, hideCircularMask, updatePinHighlights, disable3DTerrain, fitAllPoints, applyContourDensity]);

  closePanelRef.current = closePanel;

  const selectProject = useCallback((project: Project) => {
    setCurrentMediaIdx(0);
    setActiveItem({ type: 'project', data: project });
    setIsPanelOpen(true);
    flyToLocation(project.lng, project.lat, project.alt, 13.8);
  }, [flyToLocation]);

  const selectOffice = useCallback((office: Office) => {
    setActiveItem({ type: 'office', data: office });
    setIsPanelOpen(true);
    flyToLocation(office.lng, office.lat, office.alt, 14.0);
  }, [flyToLocation]);

  const selectProjectRef = useRef(selectProject);
  selectProjectRef.current = selectProject;

  const selectOfficeRef = useRef(selectOffice);
  selectOfficeRef.current = selectOffice;

  const onMapLoadedRef = useRef(onMapLoaded);
  onMapLoadedRef.current = onMapLoaded;

  const projectsRef = useRef(projects);
  projectsRef.current = projects;

  const handleResetBearing = useCallback(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    stopTurntable();
    clearFlightTimeouts();
    map.easeTo({
      bearing: 0,
      duration: 650,
      essential: true
    });
  }, [stopTurntable, clearFlightTimeouts]);

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

  // Global "Esc" keyboard shortcut to close any open side panel or reset panned/zoomed map to default fit points
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Esc' || e.keyCode === 27) {
        // If full-screen image lightbox is active, allow lightbox to handle its own close first
        if (document.querySelector('.kkaa-lightbox.is-open') || document.querySelector('.project-slideshow')) {
          return;
        }

        e.preventDefault();
        resetMap();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [resetMap]);

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

  const cyclePlaceColorMode = useCallback(() => {
    setPlaceColorMode((prev) => {
      if (prev === 'grey') return 'black';
      if (prev === 'black') return 'pink';
      return 'grey';
    });
  }, []);

  const toggleBoundaryVisibility = useCallback((show: boolean) => {
    setShowBoundary(show);
    const map = mapInstanceRef.current;
    if (!map) return;
    try {
      if (map.getLayer('india_boundary_line')) {
        map.setPaintProperty('india_boundary_line', 'line-opacity', show ? 0.75 : 0);
      }
    } catch (err) {
      console.warn('toggleBoundaryVisibility error:', err);
    }
  }, []);

  const applyFilterToMap = useCallback((filter: string | null) => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // 1. Update individual project pins
    projectMarkersRef.current.forEach((marker) => {
      const proj = (marker as any)._project as Project | undefined;
      const el = marker.getElement();
      if (!proj || !el) return;

      const isMatch = testProjectFilterMatch(proj, filter);

      if (!filter) {
        el.classList.remove('is-dimmed');
        el.classList.remove('is-highlighted');
        el.style.opacity = '';
        el.style.filter = '';
        el.style.pointerEvents = 'auto';
        el.style.zIndex = '';
      } else if (isMatch) {
        el.classList.remove('is-dimmed');
        el.classList.add('is-highlighted');
        el.style.opacity = '1';
        el.style.filter = 'none';
        el.style.pointerEvents = 'auto';
        el.style.zIndex = '1000';
      } else {
        el.classList.add('is-dimmed');
        el.classList.remove('is-highlighted');
        el.style.opacity = '0.38';
        el.style.filter = 'grayscale(0.65)';
        el.style.pointerEvents = 'auto';
        el.style.zIndex = '5';
      }
    });

    // 2. Update Kangra regional cluster marker
    clusterMarkersRef.current.forEach((clusterMarker) => {
      const kangraList = (clusterMarker as any)._kangraProjects as Project[] | undefined;
      const kangraIds = (clusterMarker as any)._kangraProjectIds as Set<string> | undefined;
      const el = clusterMarker.getElement();
      if (!kangraList || !el) return;

      const matchingInCluster = kangraList.filter(p => testProjectFilterMatch(p, filter));
      const countEl = el.querySelector('.cluster-num');
      if (countEl) {
        countEl.textContent = String(filter ? matchingInCluster.length : kangraList.length);
      }

      const showClusterByZoom = map.getZoom() < 9.5;

      if (!filter) {
        el.classList.remove('is-dimmed');
        el.classList.remove('is-highlighted');
        el.style.opacity = '1';
        el.style.filter = '';
        el.style.pointerEvents = 'auto';
        el.style.display = showClusterByZoom ? 'flex' : 'none';

        // Restore normal zoom-dependent visibility for Kangra pins
        projectMarkersRef.current.forEach(m => {
          const projId = (m as any)._project?.id;
          if (kangraIds && kangraIds.has(projId)) {
            m.getElement().style.display = showClusterByZoom ? 'none' : 'block';
          }
        });
      } else if (matchingInCluster.length > 0) {
        el.classList.remove('is-dimmed');
        el.classList.add('is-highlighted');
        el.style.opacity = '1';
        el.style.filter = 'none';
        el.style.pointerEvents = 'auto';

        // If only 1-2 projects in Kangra match the active filter, uncluster and reveal their pins directly
        if (matchingInCluster.length <= 2) {
          el.style.display = 'none';
          const matchIdSet = new Set(matchingInCluster.map(p => p.id));
          projectMarkersRef.current.forEach(m => {
            const projId = (m as any)._project?.id;
            if (kangraIds && kangraIds.has(projId)) {
              if (matchIdSet.has(projId)) {
                m.getElement().style.display = 'block';
                m.getElement().style.opacity = '1';
              } else {
                m.getElement().style.display = 'none';
              }
            }
          });
        } else {
          el.style.display = showClusterByZoom ? 'flex' : 'none';
        }
      } else {
        el.classList.add('is-dimmed');
        el.classList.remove('is-highlighted');
        el.style.opacity = '0.08';
        el.style.filter = 'grayscale(0.9)';
        el.style.pointerEvents = 'none';
      }
    });

    // 3. Office marker subtle dimming when typology filter is active
    officeMarkersRef.current.forEach(m => {
      const el = m.getElement();
      if (!filter) {
        el.classList.remove('is-dimmed');
        el.style.opacity = '1';
      } else {
        el.classList.add('is-dimmed');
        el.style.opacity = '0.25';
      }
    });

    // 4. Smoothly adjust camera bounds to encompass matching projects
    if (filter) {
      const matching = projects.filter(p => testProjectFilterMatch(p, filter));
      if (matching.length > 0) {
        const pts = matching.map(p => ({ lng: p.lng, lat: p.lat }));
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

        const dLng = Math.max(0.12, (maxLng - minLng) * 0.35);
        const dLat = Math.max(0.12, (maxLat - minLat) * 0.35);

        const bounds: [[number, number], [number, number]] = [
          [minLng - dLng, minLat - dLat],
          [maxLng + dLng, maxLat + dLat]
        ];

        const isDesktop = map.getCanvas().clientWidth > 860;
        map.fitBounds(bounds, {
          padding: isDesktop
            ? { top: 90, bottom: 90, left: 100, right: 100 }
            : { top: 70, bottom: 70, left: 30, right: 30 },
          maxZoom: matching.length === 1 ? 11.5 : 9.5,
          duration: 1100
        });
      }
    } else if (prevFilterRef.current) {
      fitAllPoints(true);
    }
    prevFilterRef.current = filter || null;
  }, [projects, fitAllPoints]);

  const handleFilterClick = useCallback((categoryKey: string) => {
    const next = activeFilter === categoryKey ? null : categoryKey;
    if (onFilterChange) {
      onFilterChange(next);
    } else {
      setInternalFilter(next);
    }
    applyFilterToMap(next);
  }, [activeFilter, onFilterChange, applyFilterToMap]);

  // Update pin filter dimming, highlighting, and camera positioning whenever activeFilter changes
  useEffect(() => {
    applyFilterToMap(activeFilter);
  }, [activeFilter, applyFilterToMap]);

  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const demSource = new mlcontour.DemSource({
      url: 'https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png',
      encoding: 'terrarium',
      maxzoom: 12,
      worker: false,
      cacheSize: 200
    });

    // Clone ArrayBuffers before transferring to MapLibre WebWorkers so cached buffers in
    // demSource.contourCache and sharedDem are never detached, preventing DataCloneError.
    const cloneTileBuffer = (data: any) => {
      if (!data) return data;
      if (data instanceof ArrayBuffer) {
        return data.byteLength > 0 ? data.slice(0) : data;
      }
      if (ArrayBuffer.isView(data)) {
        const view = data as ArrayBufferView;
        return view.buffer.byteLength > 0
          ? view.buffer.slice(view.byteOffset, view.byteOffset + view.byteLength)
          : view.buffer;
      }
      return data;
    };

    try {
      maplibregl.removeProtocol(demSource.sharedDemProtocolId);
    } catch (_) {}
    try {
      maplibregl.removeProtocol(demSource.contourProtocolId);
    } catch (_) {}

    maplibregl.addProtocol(demSource.sharedDemProtocolId, (async (request: any, abortController: any): Promise<any> => {
      const response: any = await demSource.sharedDemProtocol(request, abortController);
      if (response && 'data' in response && response.data) {
        return {
          ...response,
          data: cloneTileBuffer(response.data)
        };
      }
      return response;
    }) as any);

    maplibregl.addProtocol(demSource.contourProtocolId, (async (request: any, abortController: any): Promise<any> => {
      let response: any = await demSource.contourProtocol(request, abortController);
      // If cached buffer was already detached prior to wrapping, clear contourCache and refresh
      if (response && 'data' in response && response.data instanceof ArrayBuffer && response.data.byteLength === 0) {
        try {
          (demSource.manager as any)?.contourCache?.clear();
        } catch (_) {}
        response = await demSource.contourProtocol(request, abortController);
      }
      if (response && 'data' in response && response.data) {
        return {
          ...response,
          data: cloneTileBuffer(response.data)
        };
      }
      return response;
    }) as any);

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
              'hillshade-shadow-color': '#484840',
              'hillshade-highlight-color': '#ffffff',
              'hillshade-accent-color': '#707068',
              'hillshade-exaggeration': 0.65,
              'hillshade-illumination-direction': 315,
              'hillshade-illumination-anchor': 'map'
            }
          },
          // 3. Minor contour lines — ALWAYS ON in 2D (zoom 4.5+), default lightweight architectural B&W graphite
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
                4.5, 0.32,
                7,   0.42,
                9,   0.55,
                11,  0.68,
                14,  0.85
              ],
              'line-opacity': BW_MINOR_OPACITY
            }
          },
          // 4. Major index contours — ALWAYS ON in 2D (zoom 4+), lightweight graphite index curves
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
                4,  0.55,
                6,  0.72,
                8,  0.92,
                10, 1.15,
                12, 1.35,
                14, 1.65
              ],
              'line-opacity': BW_MAJOR_OPACITY
            }
          },
          // 5. Contour Elevation Number Details — Clean, uncluttered altitude numbers only along major index contours
          {
            id: 'contour-labels',
            type: 'symbol',
            source: 'contours',
            'source-layer': 'contours',
            filter: ['>', ['get', 'level'], 0], // Only show altitude numbers on major index contours
            minzoom: 8.0,
            layout: {
              'symbol-placement': 'line',
              'text-field': ['concat', ['to-string', ['get', 'ele']], 'm'],
              'text-size': [
                'interpolate', ['linear'], ['zoom'],
                8.0,  8.0,
                10.5, 9.0,
                12.0, 10.0,
                13.5, 11.0,
                15.0, 12.0
              ],
              'text-font': ['Noto Sans Regular', 'Open Sans Regular'],
              'text-letter-spacing': 0.08,
              'text-max-angle': 35,
              'symbol-spacing': [
                'interpolate', ['linear'], ['zoom'],
                8.0,  360,
                11.0, 280,
                13.5, 240
              ],
              'text-allow-overlap': false,
              'text-ignore-placement': false,
              visibility: 'visible'
            },
            paint: {
              'text-color': '#11141a',
              'text-halo-color': '#ffffff',
              'text-halo-width': 2.2,
              'text-opacity': [
                'interpolate', ['linear'], ['zoom'],
                8.0,  0.65,
                10.0, 0.85,
                12.0, 0.95,
                13.5, 1.0
              ]
            }
          },
          // 6. Official India National Boundary (scales wider as zoom increases for instant clarity)
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

    // Track active mouse movements to pause 3D camera rendering while user moves cursor
    const onMouseMoveAnywhere = () => {
      lastUserInteractionTimeRef.current = performance.now();
    };
    window.addEventListener('mousemove', onMouseMoveAnywhere, { passive: true });

    // Track project panel hover to pause 3D turntable while reading text or viewing photos
    const panelEl = document.getElementById('project-panel');
    const onPanelEnter = () => {
      isPanelHoveredRef.current = true;
    };
    const onPanelLeave = () => {
      isPanelHoveredRef.current = false;
    };
    if (panelEl) {
      panelEl.addEventListener('mouseenter', onPanelEnter);
      panelEl.addEventListener('mouseleave', onPanelLeave);
    }

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
      // Preload 3D DEM terrain mesh immediately in background so all tiles and altitude
      // data are already loaded, decoded, and cached into GPU memory.
      // At pitch: 0 with hillshade hidden, the map remains visually 100% 2D in the hero section.
      try {
        map.setTerrain({ source: 'dem', exaggeration: 1.25 });
      } catch (err) {
        console.warn('Preload terrain error:', err);
      }

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
          selectOfficeRef.current(off);
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
          selectProjectRef.current(proj);
        });

        const marker = new maplibregl.Marker({ element: el, anchor: 'center' })
          .setLngLat([proj.lng, proj.lat])
          .addTo(map);

        (marker as any)._project = proj;
        projectMarkersRef.current.push(marker);
      });

      // 4. Render Regional Kangra Cluster Pin (Covering all Kangra Valley projects)
      const kangraProjects = projects.filter(p =>
        p.location.includes('Kangra') ||
        p.location.includes('Palampur') ||
        p.location.includes('Dharamshala') ||
        p.location.includes('Neugal') ||
        p.location.includes('Baijnath') ||
        p.location.includes('Chimbalhar') ||
        p.location.includes('Samloti') ||
        p.location.includes('Bundla') ||
        p.location.includes('Billing') ||
        p.location.includes('Jia') ||
        p.city === 'Palampur' ||
        p.city === 'Kangra' ||
        p.city === 'Dharamshala' ||
        p.city === 'Baijnath' ||
        p.city === 'Bir'
      );

      const kangraProjectIds = new Set(kangraProjects.map(p => p.id));

      if (kangraProjects.length > 1) {
        const minLng = Math.min(...kangraProjects.map(p => p.lng));
        const maxLng = Math.max(...kangraProjects.map(p => p.lng));
        const minLat = Math.min(...kangraProjects.map(p => p.lat));
        const maxLat = Math.max(...kangraProjects.map(p => p.lat));
        const centerLng = (minLng + maxLng) / 2;
        const centerLat = (minLat + maxLat) / 2;

        const clusterEl = document.createElement('div');
        clusterEl.className = 'map-cluster-pin map-cluster-bubble';
        clusterEl.setAttribute('role', 'button');
        clusterEl.setAttribute('tabindex', '0');
        clusterEl.setAttribute('aria-label', `${kangraProjects.length} Projects in Kangra Valley`);

        clusterEl.innerHTML = `
          <div class="cluster-beacon-ring"></div>
          <div class="cluster-badge-pill">
            <span class="cluster-badge-count cluster-num">${kangraProjects.length}</span>
            <span class="cluster-badge-tag">PROJECTS</span>
          </div>
          <div class="cluster-tooltip">
            <strong>KANGRA VALLEY REGION</strong>
            <span>${kangraProjects.length} Projects · Click to Zoom & Inspect</span>
          </div>
        `;

        clusterEl.addEventListener('click', (ev) => {
          ev.stopPropagation();
          map.fitBounds([
            [minLng, minLat],
            [maxLng, maxLat]
          ], {
            padding: { top: 90, bottom: 90, left: 90, right: 90 },
            duration: 1100
          });
        });

        // Position cluster badge at the western center of Kangra Valley to avoid overlap with Palampur Studio
        const clusterLng = (minLng + centerLng) / 2;
        const clusterLat = centerLat;

        const clusterMarker = new maplibregl.Marker({ element: clusterEl, anchor: 'center' })
          .setLngLat([clusterLng, clusterLat])
          .addTo(map);

        (clusterMarker as any)._kangraProjects = kangraProjects;
        (clusterMarker as any)._kangraProjectIds = kangraProjectIds;
        clusterMarkersRef.current.push(clusterMarker);

        // Dynamically size the transparent cluster bubble to cover all points in its geographic range
        const updateClusterVisuals = () => {
          const z = map.getZoom();
          const showCluster = z < 9.5;
          clusterEl.style.display = showCluster ? 'flex' : 'none';

          if (showCluster) {
            const pSW = map.project([minLng, minLat]);
            const pNE = map.project([maxLng, maxLat]);
            const pixelW = Math.abs(pNE.x - pSW.x) + 56;
            const pixelH = Math.abs(pSW.y - pNE.y) + 56;
            const diameter = Math.round(Math.max(96, Math.max(pixelW, pixelH)));
            clusterEl.style.width = `${diameter}px`;
            clusterEl.style.height = `${diameter}px`;
            clusterEl.style.borderRadius = '50%';
          }

          // Strict hiding: Only show individual project pins when unclustered (zoomed in)
          projectMarkersRef.current.forEach(m => {
            const projId = (m as any)._project?.id;
            if (kangraProjectIds.has(projId)) {
              m.getElement().style.display = showCluster ? 'none' : 'block';
            }
          });
        };

        map.on('zoom', updateClusterVisuals);
        map.on('move', updateClusterVisuals);
        updateClusterVisuals();
      }

      // Synchronize True North indicator with map rotation and 3D perspective pitch
      const updateNorthIndicators = () => {
        const currentBearing = map.getBearing();
        const currentPitch = map.getPitch();
        const rot = -currentBearing;
        if (headerNorthRef.current) {
          headerNorthRef.current.style.transform = `perspective(350px) rotateX(${currentPitch}deg) rotateZ(${rot}deg)`;
        }
      };

      map.on('rotate', updateNorthIndicators);
      map.on('pitch', updateNorthIndicators);
      map.on('move', updateNorthIndicators);
      updateNorthIndicators();

      // Fit camera to encompass all studio points with desktop card offset
      if (activeFilter) {
        applyFilterToMap(activeFilter);
      } else {
        fitAllPoints(false);
      }

      onMapLoadedRef.current?.();
    });

    return () => {
      window.removeEventListener('click', handleDocumentClick);
      window.removeEventListener('mousemove', onMouseMoveAnywhere);
      if (panelEl) {
        panelEl.removeEventListener('mouseenter', onPanelEnter);
        panelEl.removeEventListener('mouseleave', onPanelLeave);
      }
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
      try {
        maplibregl.removeProtocol(demSource.sharedDemProtocolId);
      } catch (_) {}
      try {
        maplibregl.removeProtocol(demSource.contourProtocolId);
      } catch (_) {}
      mapInstanceRef.current = null;
      demSourceRef.current = null;
    };
  }, []);

  return (
    <div className="map-frame hero-map-frame" style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* Map Header */}
      <div className="map-header">
        <div className="map-header-tagline" aria-label="Practice disciplines: Architecture, Landscape, Interior, Conservation">
          <span>Architecture</span>
          <span className="discipline-sep" aria-hidden="true">·</span>
          <span>Landscape</span>
          <span className="discipline-sep" aria-hidden="true">·</span>
          <span>Interior</span>
          <span className="discipline-sep" aria-hidden="true">·</span>
          <span>Conservation</span>
        </div>
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
        <div className="hero-statement-kpi" aria-label="Practice metrics">
          <div className="kpi-item">
            <span className="kpi-num">{practiceStats.total}</span>
            <span className="kpi-label">PROJECTS</span>
          </div>
          <div className="kpi-divider" aria-hidden="true"></div>
          <div className="kpi-item">
            <span className="kpi-num">{practiceStats.years}</span>
            <span className="kpi-label">YEARS</span>
          </div>
          <div className="kpi-divider" aria-hidden="true"></div>
          <div className="kpi-item">
            <span className="kpi-num">{practiceStats.states}</span>
            <span className="kpi-label">STATES</span>
          </div>
        </div>
      </aside>

      {/* Map Canvas */}
      <div
        className={`map-canvas-wrap hero-map-canvas theme-places-${placeColorMode} ${isPanelOpen ? 'has-panel-open' : ''}`}
        id="map-canvas-wrap"
        style={{
          '--place-color': PLACE_COLOR_CONFIG[placeColorMode].text,
          '--place-dot-color': PLACE_COLOR_CONFIG[placeColorMode].dot,
          '--place-capital-dot-color': PLACE_COLOR_CONFIG[placeColorMode].capitalDot,
        } as React.CSSProperties}
      >
        <div
          ref={mapContainerRef}
          style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}
        />

        {/* Fixed Top-Right 3D Architectural North Compass (Dynamic Rotation & 3D Perspective) */}
        <div
          className={`map-3d-north-widget ${isPanelOpen ? 'has-panel-open' : ''}`}
          id="map-3d-north-compass"
          role="button"
          tabIndex={0}
          onClick={handleResetBearing}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleResetBearing();
            }
          }}
          title="True North · Click to Reset Bearing (0°)"
          aria-label="True North Indicator"
        >
          <div className="compass-3d-stage">
            <div
              ref={headerNorthRef}
              className="compass-3d-disk"
            >
              <img src="/mouseicon.svg" alt="North indicator" className="compass-3d-svg" />
              <span className="compass-3d-label">N</span>
            </div>
          </div>
        </div>

        {/* Map View Controls */}
        {/* Map View Controls (Top Right) */}
        <div className="map-view-controls" aria-label="Map view controls">
          <div className="map-controls-cluster">
            {/* Left Stack: Reset Map (Top) & Options (Bottom) */}
            <div className="map-action-stack">
              <button
                className="map-control-btn"
                id="map-recenter-btn"
                title="Reset Map to Default Fit Points (Esc)"
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
            </div>

            {/* Right: Vertical Zoom Controls (+ over -) */}
            <div className="map-zoom-controls map-zoom-controls--vertical" aria-label="Map zoom controls">
              <button
                type="button"
                className="map-zoom-btn"
                id="map-zoom-in"
                title="Zoom In"
                onClick={handleZoomIn}
                aria-label="Zoom In"
              >
                <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
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
                <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>
            </div>
          </div>

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
              title={showContourColors ? "Switch Contours to Architectural Monochrome (B&W)" : "Show Elevation Tiers (Altitude-based contour colors)"}
              onClick={toggleContourColors}
            >
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor" />
              </svg>
              <span>ELEVATION TIERS</span>
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
            {/* Place Names Color Switcher (Grey default, Black, Pink) */}
            <div className="map-place-color-block">
              <button
                className={`map-control-btn map-place-color-btn ${placeColorMode !== 'grey' ? 'map-control-btn--active' : ''}`}
                id="map-place-color-btn"
                title={`Place color: ${PLACE_COLOR_CONFIG[placeColorMode].label}. Click to cycle (Grey -> Black -> Pink)`}
                onClick={cyclePlaceColorMode}
              >
                <span
                  style={{
                    width: '9px',
                    height: '9px',
                    borderRadius: '50%',
                    backgroundColor: PLACE_COLOR_CONFIG[placeColorMode].dot,
                    border: '1.2px solid rgba(255, 255, 255, 0.9)',
                    boxShadow: placeColorMode === 'pink' ? '0 0 6px rgba(184, 36, 88, 0.6)' : 'none',
                    display: 'inline-block',
                    flexShrink: 0
                  }}
                />
                <span>PLACE: {PLACE_COLOR_CONFIG[placeColorMode].label}</span>
              </button>
              <div className="map-place-color-chips" aria-label="Place color selection options">
                {(['grey', 'black', 'pink'] as PlaceColorMode[]).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    className={`map-place-chip ${placeColorMode === mode ? 'is-active' : ''}`}
                    onClick={() => setPlaceColorMode(mode)}
                    title={`Switch Place Names to ${PLACE_COLOR_CONFIG[mode].label}`}
                    aria-label={`Switch Place Names to ${PLACE_COLOR_CONFIG[mode].label}`}
                  >
                    <span
                      className="map-place-chip-dot"
                      style={{ backgroundColor: PLACE_COLOR_CONFIG[mode].dot }}
                    />
                    <span>{mode === 'grey' ? 'GREY' : mode === 'black' ? 'BLACK' : 'PINK'}</span>
                  </button>
                ))}
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
                        aria-label="Close project panel and reset map (Esc)"
                        title="Press Esc to close and reset map"
                        onClick={resetMap}
                      >
                        <span>CLOSE</span>
                        <kbd className="panel-esc-badge">ESC</kbd>
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
                        aria-label="Close project panel and reset map (Esc)"
                        title="Press Esc to close and reset map"
                        onClick={resetMap}
                      >
                        <span>CLOSE</span>
                        <kbd className="panel-esc-badge">ESC</kbd>
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

        {/* Professional Architectural Map Legend Card (Bottom-Right) */}
        <div id="map-legend-card" className="map-legend-card" aria-label="Project typologies legend">
          <div className="legend-card-header">
            <span className="legend-card-title">TYPOLOGY</span>
            {activeFilter ? (
              <button
                className="legend-reset-btn"
                id="legend-reset-btn"
                title="Reset active filter"
                onClick={clearFilter}
              >
                RESET
              </button>
            ) : (
              <span className="legend-card-total">{projects.length} PROJECTS</span>
            )}
          </div>
          <div className="legend-card-list">
            {LEGEND_CATEGORIES.map((cat) => {
              const isSelected = activeFilter === cat.key;
              return (
                <div
                  key={cat.key}
                  className={`legend-card-row ${isSelected ? 'is-active' : ''}`}
                  data-filter={cat.key}
                  tabIndex={0}
                  role="button"
                  aria-label={`Filter by ${cat.label}`}
                  onClick={() => handleFilterClick(cat.key)}
                >
                  <div className="legend-row-left">
                    <span className="legend-dot" style={{ backgroundColor: cat.color }}></span>
                    <span className="legend-item-name">{cat.label}</span>
                  </div>
                  <span className="legend-count-badge">{cat.count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export const ProjectMap = React.memo<ProjectMapProps>(ProjectMapComponent);
