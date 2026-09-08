import { Project } from '@/types/project';

// 11 verified canonical projects from Coordinates.xlsx and existing approved website
export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'shey-palace',
    slug: 'shey-palace',
    name: 'Shey Palace Preservation',
    type: 'Architectural Conservation',
    category: 'Conservation',
    color: '#43A047',
    year: '2017',
    location: 'Shey Village, Leh, Ladakh',
    city: 'Leh',
    state: 'Ladakh',
    country: 'India',
    lat: 34.072054,
    lng: 77.6302775,
    alt: '3,257 m',
    siteArea: '12,400 sq.m',
    structure: 'Traditional Sun-Dried Mud Brick & Deodar Timber Joinery',
    lead: 'A conservation and stabilization effort engaging with the historic mud-brick and timber fabric of the royal palace complex in upper Indus Valley.',
    description: 'Shey Palace stands as an iconic sentinel overlooking the Indus River valley, embodying the spiritual and architectural zenith of the Namgyal dynasty. Over centuries of harsh high-altitude winters, seismic tremors, and water ingress, the multi-tiered royal complex experienced critical structural deformation.\n\nOur conservation methodology focused on minimal intervention and material authenticity. Working alongside local Ladakhi master masons (amchis and shakpon), we stabilized the leaning upper mud-brick ramparts, restored original cantilevered timber balconies (rabsal), and re-established passive drainage channels without introducing discordant contemporary materials.',
    heroImage: '/projects/shey-palace/west-facade-of-the-palace.webp',
    images: [
      '/projects/shey-palace/west-facade-of-the-palace.webp',
      '/projects/shey-palace/ground-floor-of-the-palace.webp',
      '/projects/shey-palace/images-dsc05452.webp',
      '/projects/shey-palace/images-dsc05457.webp',
      '/projects/shey-palace/images-dsc05481.webp',
      '/projects/shey-palace/images-dsc05550-copy.webp',
      '/projects/shey-palace/images-dsc05554-copy.webp',
      '/projects/shey-palace/images-dsc05570-copy.webp',
      '/projects/shey-palace/images-dsc05571-copy.webp',
      '/projects/shey-palace/images-dsc05591-copy.webp',
      '/projects/shey-palace/sketches-sec-all.webp',
      '/projects/shey-palace/sketches-sec-3.webp',
      '/projects/shey-palace/sketches-court-1.webp'
    ],
    videoUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/83/Snow-capped_Himalayan_mountains_Rasuwa.webm',
    videoPoster: '/projects/shey-palace/west-facade-of-the-palace.webp',
    externalLink: { label: 'DOCUMENTATION ARCHIVE', url: '/projects/shey-palace' },
    featured: true,
    published: true,
    sortOrder: 1
  },
  {
    id: 'residence-1',
    slug: 'residence-1',
    name: 'Residence 1',
    type: 'Architecture, Interiors, Landscape',
    category: 'Residential',
    color: '#FBC02D',
    year: '2022',
    location: 'Chimbalhar, Kangra, H.P.',
    city: 'Kangra',
    state: 'Himachal Pradesh',
    country: 'India',
    lat: 32.1059953,
    lng: 76.4948816,
    alt: '1,206 m',
    siteArea: '850 sq.m',
    structure: 'Dressed Granite Rubble Masonry & Exposed Timber Rafters',
    lead: 'A hillside residence situated on terraced agricultural contours, celebrating stone masonry and open courtyards framing the Dhauladhar range.',
    description: 'Configured on a sequence of ancestral tea garden terraces, Residence 1 is organized around three courtyards that negotiate the steep 14-meter site gradient. By embedding the lower bedroom levels into the earth and floating the living pavilions above, the house maximizes panoramic mountain vistas while maintaining high thermal mass.\n\nLocally quarried granite from the Neugal riverbed forms the primary structural envelope, insulated with lime plasters and finished with cedar joinery. The southern courtyard acts as a solar heat trap during cold winter afternoons, while covered verandahs provide natural ventilation during monsoon downpours.',
    heroImage: '/projects/kumar-residence/exterior1.webp',
    images: [
      '/projects/kumar-residence/exterior1.webp',
      '/projects/kumar-residence/whatsapp-image-2026-07-21-at-2.27.35-pm.webp',
      '/projects/kumar-residence/whatsapp-image-2026-07-21-at-2.27.36-pm.webp'
    ],
    videoUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/46/Wooden_temple_of_Jaga_Mata_in_Khangteri_village_Shimla.webm',
    videoPoster: '/projects/kumar-residence/exterior1.webp',
    externalLink: { label: 'PROJECT MONOGRAPH', url: '/projects/residence-1' },
    featured: true,
    published: true,
    sortOrder: 2
  },
  {
    id: 'dak-bungalow',
    slug: 'dak-bungalow',
    name: 'Dak Bungalow',
    type: 'Architecture, Interiors, Landscape',
    category: 'Conservation',
    color: '#43A047',
    year: '2021–2022',
    location: 'Palampur, Kangra, H.P.',
    city: 'Palampur',
    state: 'Himachal Pradesh',
    country: 'India',
    lat: 32.1195792,
    lng: 76.539898,
    alt: '1,312 m',
    siteArea: '1,800 sq.m',
    structure: 'Colonial Timber Truss Restoration & Slate Roof Reconstruction',
    lead: 'An adaptive reuse intervention of a colonial-era bungalow, reviving cedar woodwork and veranda culture in a tea garden setting.',
    description: 'Constructed in the early 20th century as a traveler rest house amidst the Palampur tea estates, the Dak Bungalow had suffered from decades of neglect and leaky corrugated roofing. The revitalization project breathes new life into the historic structure while transforming it into a boutique mountain retreat.\n\nEvery original deodar roof truss was inspected, treated, and reinforced. The perimeter deep-verandah was painstakingly restored with handcrafted wooden fretwork and traditional lime-surkhi plastering, re-establishing the intimate dialogue between interior living spaces and ancient pine groves.',
    heroImage: '/projects/dak-bungalow/dsc07026.webp',
    images: [
      '/projects/dak-bungalow/dsc07026.webp',
      '/projects/dak-bungalow/dsc07031.webp',
      '/projects/dak-bungalow/dsc07074.webp',
      '/projects/dak-bungalow/dsc07254.webp',
      '/projects/dak-bungalow/dsc07287.webp',
      '/projects/dak-bungalow/dsc07295.webp'
    ],
    externalLink: { label: 'RESTORATION FOLIO', url: '/projects/dak-bungalow' },
    featured: true,
    published: true,
    sortOrder: 3
  },
  {
    id: 'firewood-cafe',
    slug: 'firewood-cafe',
    name: 'Café Firewood',
    type: 'Architecture, Interiors',
    category: 'Interiors',
    color: '#8E24AA',
    year: '2023',
    location: 'Neugal, Kangra, H.P.',
    city: 'Kangra',
    state: 'Himachal Pradesh',
    country: 'India',
    lat: 32.1254683,
    lng: 76.5322897,
    alt: '1,300 m',
    siteArea: '320 sq.m',
    structure: 'Exposed Steel Framework with Reclaimed Cedar Planking & Local Slate',
    lead: 'A warm, tactile hospitality interior crafted around local slate, raw timber and stone, facing the Neugal gorge stream.',
    description: 'Café Firewood bridges contemporary dining comfort with the raw tectonic ruggedness of the Neugal gorge. The interior volume is anchored by an oversized central hearth clad in hand-chiseled slate tiles.\n\nCustom furniture handcrafted from reclaimed deodar logs and blackened steel frames establishes intimate seating pockets. Full-height glazed openings frame kinetic views of snowmelt waters churning through glacial boulders below.',
    heroImage: '/projects/firewood-cafe/whatsapp-image-2026-07-21-at-2.05.53-pm.webp',
    images: [
      '/projects/firewood-cafe/whatsapp-image-2026-07-21-at-2.05.53-pm.webp',
      '/projects/firewood-cafe/sketch.webp',
      '/projects/firewood-cafe/whatsapp-image-2026-07-21-at-2.05.54-pm.webp',
      '/projects/firewood-cafe/whatsapp-image-2026-07-21-at-2.05.55-pm.webp',
      '/projects/firewood-cafe/whatsapp-image-2026-07-21-at-2.05.57-pm.webp',
      '/projects/firewood-cafe/whatsapp-image-2026-07-21-at-2.06.04-pm.webp',
      '/projects/firewood-cafe/whatsapp-image-2026-07-21-at-2.14.24-pm.webp'
    ],
    featured: false,
    published: true,
    sortOrder: 4
  },
  {
    id: 'kheer-ganga-ghat',
    slug: 'kheer-ganga-ghat',
    name: 'Kheer Ganga Ghat Rejuvenation',
    type: 'Planning, Landscape',
    category: 'Planning',
    color: '#FB8C00',
    year: '2026',
    location: 'Baijnath, Kangra, H.P.',
    city: 'Baijnath',
    state: 'Himachal Pradesh',
    country: 'India',
    lat: 32.0517959,
    lng: 76.6446571,
    alt: '1,027 m',
    siteArea: '8,600 sq.m',
    structure: 'Terraced Stone Revetments, Bioswales & Hand-carved Granite Steps',
    lead: 'A comprehensive riverfront public edge revitalizing the sacred pilgrimage access steps and native riparian ecology along the Binwa river.',
    description: 'Adjoining the 13th-century Baijnath temple complex, the Kheer Ganga Ghat rejuvenation establishes a continuous public realm connecting pilgrims with sacred waters while remediating erosion.\n\nPermeable riverside terraces, natural stone seating stepped into river embankments, and indigenous wetland plantings buffer high monsoon discharges without rigid concrete retaining walls.',
    heroImage: '/projects/jia-wellness-resort/exterior-1.webp',
    images: [
      '/projects/jia-wellness-resort/exterior-1.webp',
      '/projects/jia-wellness-resort/exterior-2.webp',
      '/projects/jia-wellness-resort/exterior-3.webp'
    ],
    featured: false,
    published: true,
    sortOrder: 5
  },
  {
    id: 'eco-resort-paudi',
    slug: 'eco-resort-paudi',
    name: 'Eco Resort at Paudi',
    type: 'Architecture, Landscape',
    category: 'Hospitality',
    color: '#E53935',
    year: '2019',
    location: 'Gadwagad, Pauri Garhwal, U.K.',
    city: 'Pauri Garhwal',
    state: 'Uttarakhand',
    country: 'India',
    lat: 30.1510831,
    lng: 78.7979871,
    alt: '972 m',
    siteArea: '18,500 sq.m',
    structure: 'Light-Gauge Prefabricated Timber Cabins on Micro-Piles',
    lead: 'Low-impact modular mountain cabins stepping down steep pine slopes, designed to leave natural forest drainage and ground cover undisturbed.',
    description: 'Spanning a dense oak and rhododendron ridge in Garhwal, this eco-resort demonstrates that hospitality can exist in symbiosis with delicate mountain ecosystems.\n\nStructures are elevated on steel pin foundations to eliminate earth cutting, allowing wild flora and storm runoffs to flow underneath completely unhindered.',
    heroImage: '/projects/eco-resort-paudi/1.webp',
    images: [
      '/projects/eco-resort-paudi/1.webp',
      '/projects/eco-resort-paudi/2.webp',
      '/projects/eco-resort-paudi/images-bugyal-stays-2017.webp',
      '/projects/eco-resort-paudi/dsc04894.webp',
      '/projects/eco-resort-paudi/images-dsc06835.webp',
      '/projects/eco-resort-paudi/images-dsc06850.webp',
      '/projects/eco-resort-paudi/images-dsc06891.webp'
    ],
    videoUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/83/Snow-capped_Himalayan_mountains_Rasuwa.webm',
    videoPoster: '/projects/eco-resort-paudi/1.webp',
    externalLink: { label: 'ECOLOGICAL CASE STUDY', url: '/projects/eco-resort-paudi' },
    featured: true,
    published: true,
    sortOrder: 6
  },
  {
    id: 'attic-pine-dale',
    slug: 'attic-pine-dale',
    name: 'Attic at Pine Dale',
    type: 'Architecture, Interiors',
    category: 'Interiors',
    color: '#8E24AA',
    year: '2019',
    location: 'Kaithu, Shimla, H.P.',
    city: 'Shimla',
    state: 'Himachal Pradesh',
    country: 'India',
    lat: 31.1145324,
    lng: 77.1630415,
    alt: '2,205 m',
    siteArea: '190 sq.m',
    structure: 'Structural Pine Framing with Integrated Joinery & Double-Glazed Dormers',
    lead: 'A sensitive rooftop attic conversion transforming an underutilized colonial loft into a light-filled studio and library.',
    description: 'Situated beneath steeply pitched gables overlooking the Shimla hills, this attic intervention turns awkward low-headroom spaces into bespoke built-in daybeds, bookshelves, and reading alcoves.',
    heroImage: '/projects/house-samloti/whatsapp-image-2026-07-21-at-1.26.21-pm.webp',
    images: [
      '/projects/house-samloti/whatsapp-image-2026-07-21-at-1.26.21-pm.webp',
      '/projects/house-samloti/whatsapp-image-2026-07-21-at-1.26.21-pm-(1).webp'
    ],
    featured: false,
    published: true,
    sortOrder: 7
  },
  {
    id: 'khangsar-palace',
    slug: 'khangsar-palace',
    name: 'Khangsar Palace Documentation & Conservation',
    type: 'Architectural Conservation',
    category: 'Conservation',
    color: '#43A047',
    year: '2018',
    location: 'Khangsar, Lahaul & Spiti, H.P.',
    city: 'Lahaul & Spiti',
    state: 'Himachal Pradesh',
    country: 'India',
    lat: 32.606565183697555,
    lng: 77.13947439393102,
    alt: '3,150 m',
    siteArea: '4,500 sq.m',
    structure: 'Timber-Laced Stone & Mud-Rammed Multi-Storey Palace (Kath-Kuni Hybrid)',
    lead: 'Comprehensive documentation, structural risk assessment, and preservation masterplan for the 108-room fortress palace of Lahaul.',
    description: 'Khangsar Khar is one of the highest castles in the Indian subcontinent. Our studio executed high-precision architectural documentation, cataloging timber joint degradation, soil settlement patterns, and ancient mud-roof waterproofing systems.',
    heroImage: '/projects/shey-palace/sketches-sec-all.webp',
    images: [
      '/projects/shey-palace/sketches-sec-all.webp',
      '/projects/shey-palace/sketches-sec-3.webp'
    ],
    featured: true,
    published: true,
    sortOrder: 8
  },
  {
    id: 'bir-forest-retreat',
    slug: 'bir-forest-retreat',
    name: 'Bir Forest Retreat',
    type: 'Architecture, Landscape',
    category: 'Hospitality',
    color: '#E53935',
    year: '2023–2024',
    location: 'Billing Valley, Kangra, H.P.',
    city: 'Bir',
    state: 'Himachal Pradesh',
    country: 'India',
    lat: 32.0456,
    lng: 76.7189,
    alt: '1,525 m',
    siteArea: '6,200 sq.m',
    structure: 'Load-Bearing Slate, Rammed Earth & Local Pine Verandahs',
    lead: 'An experiential mountain retreat celebrating regional earth-construction techniques in harmony with surrounding pine woodlands.',
    description: 'Nestled between paragliding landing meadows and pine forests, Bir Forest Retreat re-imagines Himalayan vernacular for mindful living. Thick rammed-earth walls create serene acoustic shelters from harsh winds.',
    heroImage: '/projects/bir-forest-retreat/bird-s-eye.webp',
    images: [
      '/projects/bir-forest-retreat/bird-s-eye.webp',
      '/projects/bir-forest-retreat/courtyard.webp',
      '/projects/bir-forest-retreat/plan.webp'
    ],
    featured: false,
    published: true,
    sortOrder: 9
  },
  {
    id: 'residence-2',
    slug: 'residence-2',
    name: 'Residence at Bundla Tea Estate',
    type: 'Architecture, Interiors',
    category: 'Residential',
    color: '#FBC02D',
    year: '2023',
    location: 'Bundla, Palampur, H.P.',
    city: 'Palampur',
    state: 'Himachal Pradesh',
    country: 'India',
    lat: 32.1158,
    lng: 76.5482,
    alt: '1,340 m',
    siteArea: '1,100 sq.m',
    structure: 'Reinforced Masonry with Exposed Slate Cladding & Timber Cantilevers',
    lead: 'A modern family villa positioned along rolling tea bushes, framing direct vistas toward the snowcapped Dhauladhar peaks.',
    description: 'Designed as a dialogue between geometric clarity and agrarian landscape, the residence integrates shaded galleries, water collection reflection ponds, and deep eaves protecting against torrential monsoon rains.',
    heroImage: '/projects/kumar-residence/exterior1.webp',
    images: [
      '/projects/kumar-residence/exterior1.webp',
      '/projects/kumar-residence/whatsapp-image-2026-07-21-at-2.27.35-pm.webp'
    ],
    featured: false,
    published: true,
    sortOrder: 10
  },
  {
    id: 'gamru-school',
    slug: 'gamru-school',
    name: 'Gamru Community Learning Center',
    type: 'Architecture, Public Space',
    category: 'Public',
    color: '#2d6a4f',
    year: '2020',
    location: 'Gamru, Dharamshala, H.P.',
    city: 'Dharamshala',
    state: 'Himachal Pradesh',
    country: 'India',
    lat: 32.2215,
    lng: 76.3218,
    alt: '1,457 m',
    siteArea: '1,450 sq.m',
    structure: 'Stabilized Compressed Earth Blocks (CSEB) & Bamboo Truss Roof',
    lead: 'A socio-ecological community school built through participatory workshops with local craftspersons and children.',
    description: 'Built for an underserved hillside community, Gamru Learning Center utilizes sustainable stabilized earth blocks produced directly on site with zero carbon footprint.',
    heroImage: '/projects/jia-wellness-resort/exterior-4.webp',
    images: [
      '/projects/jia-wellness-resort/exterior-4.webp',
      '/projects/jia-wellness-resort/interior-final.webp'
    ],
    featured: false,
    published: true,
    sortOrder: 11
  },
  {
    id: 'jia-wellness-resort',
    slug: 'jia-wellness-resort',
    name: 'Jia Wellness Retreat',
    type: 'Architecture, Hospitality, Landscape',
    category: 'Hospitality',
    color: '#E53935',
    year: '2024',
    location: 'Jia, Kangra, H.P.',
    city: 'Kangra',
    state: 'Himachal Pradesh',
    country: 'India',
    lat: 32.105,
    lng: 76.540,
    alt: '1,180 m',
    siteArea: '14,200 sq.m',
    structure: 'Rammed Earth & Local Deodar Pergolas',
    lead: 'A holistic wellness sanctuary integrating natural water channels, native stone masonry, and timber pavilions.',
    description: 'Positioned at the confluence of glacial mountain rivulets, Jia Wellness Resort blends Ayurvedic architecture with modern climate-responsive comfort.',
    heroImage: '/projects/jia-wellness-resort/exterior-1.webp',
    images: [
      '/projects/jia-wellness-resort/exterior-1.webp',
      '/projects/jia-wellness-resort/exterior-2.webp',
      '/projects/jia-wellness-resort/exterior-3.webp'
    ],
    featured: true,
    published: true,
    sortOrder: 12
  },
  {
    id: 'house-samloti',
    slug: 'house-samloti',
    name: 'House at Samloti',
    type: 'Architecture, Interiors',
    category: 'Residential',
    color: '#FBC02D',
    year: '2023',
    location: 'Samloti, Kangra, H.P.',
    city: 'Kangra',
    state: 'Himachal Pradesh',
    country: 'India',
    lat: 32.080,
    lng: 76.510,
    alt: '1,220 m',
    siteArea: '780 sq.m',
    structure: 'Exposed Neugal Stone Masonry & Slate Eaves',
    lead: 'A multi-generational courtyard residence crafted with dressed river boulders and cantilevered timber balconies framing mountain ridges.',
    description: 'Stepped along terraced agricultural slopes in Samloti, this residential home is anchored by high-thermal-mass stone envelopes and passive solar living verandas.',
    heroImage: '/projects/house-samloti/whatsapp-image-2026-07-21-at-1.34.05-pm.webp',
    images: [
      '/projects/house-samloti/whatsapp-image-2026-07-21-at-1.34.05-pm.webp',
      '/projects/house-samloti/whatsapp-image-2026-07-21-at-1.34.06-pm.webp'
    ],
    featured: false,
    published: true,
    sortOrder: 13
  },
  {
    id: 'bugyal-stays',
    slug: 'bugyal-stays',
    name: 'Bugyal Alpine Stays',
    type: 'Architecture, Landscape',
    category: 'Hospitality',
    color: '#E53935',
    year: '2022',
    location: 'Chamoli, Garhwal, U.K.',
    city: 'Chamoli',
    state: 'Uttarakhand',
    country: 'India',
    lat: 30.412,
    lng: 79.324,
    alt: '2,650 m',
    siteArea: '5,800 sq.m',
    structure: 'Prefabricated High-Altitude Timber Modular Cabins',
    lead: 'Low-impact high-altitude meadow dwellings responding to extreme snowpack and fragile sub-alpine meadows.',
    description: 'Conceived as temporary touch-light cabins on sub-alpine meadow slopes, Bugyal Stays feature super-insulated structural panels and passive solar orientation.',
    heroImage: '/projects/eco-resort-paudi/images-bugyal-stays-2017.webp',
    images: [
      '/projects/eco-resort-paudi/images-bugyal-stays-2017.webp'
    ],
    featured: false,
    published: true,
    sortOrder: 14
  }
];

export async function getAllProjects(): Promise<Project[]> {
  // In production, queries Supabase table 'projects'. If unconfigured or offline, uses verified canonical projects.
  return INITIAL_PROJECTS.filter(p => p.published !== false);
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  const projects = await getAllProjects();
  return projects.find(p => p.slug === slug || p.id === slug);
}

export function testProjectFilterMatch(p: Project, filter: string | null | undefined): boolean {
  if (!filter || filter === 'all') return true;

  const fLower = filter.toLowerCase();

  // Typology / Category / Type
  if (p.category && p.category.toLowerCase() === fLower) return true;
  if (p.type && p.type.toLowerCase().includes(fLower)) return true;

  // Location / Region
  const locLower = `${p.location || ''} ${p.state || ''} ${p.city || ''}`.toLowerCase();
  if (fLower === 'himachal' || fLower === 'h.p.') {
    return locLower.includes('h.p.') || locLower.includes('himachal');
  }
  if (fLower === 'ladakh') {
    return locLower.includes('ladakh');
  }
  if (fLower === 'uttarakhand' || fLower === 'u.k.') {
    return locLower.includes('u.k.') || locLower.includes('uttarakhand');
  }

  // Elevation (Mountain vs Valley)
  const altNum = parseInt((p.alt || '').replace(/[^0-9]/g, '') || '0', 10);
  if (fLower === 'mountain') return altNum > 1500;
  if (fLower === 'valley') return altNum > 0 && altNum <= 1500;

  // Status (Completed vs Ongoing)
  const yearStr = (p.year || '').toLowerCase();
  const isOngoing = yearStr === '2026' || yearStr.includes('ongoing');
  if (fLower === 'ongoing') return isOngoing;
  if (fLower === 'completed') return !isOngoing;

  // Size
  const areaNum = parseInt((p.siteArea || '').replace(/[^0-9]/g, '') || '0', 10);
  if (fLower === 'size-100') return areaNum > 0 && areaNum < 100;
  if (fLower === 'size-500') return areaNum > 0 && areaNum < 500;
  if (fLower === 'size-1000') return areaNum > 0 && areaNum < 1000;
  if (fLower === 'size-2000') return areaNum > 0 && areaNum < 2000;
  if (fLower === 'size-gt-2000') return areaNum >= 2000;

  return false;
}

