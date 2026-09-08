const fs = require('fs');
const path = require('path');

const projects = [
  {
    id: 'shey-palace',
    name: 'Shey Palace Preservation',
    type: 'Architectural Conservation',
    category: 'Conservation',
    color: '#6b4c2a',
    year: '2017',
    location: 'Shey Village, Leh, Ladakh',
    lat: '34.072054Â° N',
    lng: '77.6302775Â° E',
    alt: '3,257 m',
    xPct: 42,
    yPct: 20,
    siteArea: '12,400 sq.m',
    structure: 'Traditional Sun-Dried Mud Brick & Deodar Timber Joinery',
    lead: 'A conservation and stabilization effort engaging with the historic mud-brick and timber fabric of the royal palace complex in upper Indus Valley.',
    description: `Shey Palace stands as an iconic sentinel overlooking the Indus River valley, embodying the spiritual and architectural zenith of the Namgyal dynasty. Over centuries of harsh high-altitude winters, seismic tremors, and water ingress, the multi-tiered royal complex experienced critical structural deformation.\n\nOur conservation methodology focused on minimal intervention and material authenticity. Working alongside local Ladakhi master masons (*amchis* and *shakpon*), we stabilized the leaning upper mud-brick ramparts, restored original cantilevered timber balconies (*rabsal*), and re-established passive drainage channels without introducing discordant contemporary materials.`,
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
    ]
  },
  {
    id: 'residence-1',
    name: 'Residence 1',
    type: 'Architecture, Interiors, Landscape',
    category: 'Residential',
    color: '#2c5f8a',
    year: '2022',
    location: 'Chimbalhar, Kangra, H.P.',
    lat: '32.1059953Â° N',
    lng: '76.4948816Â° E',
    alt: '1,206 m',
    xPct: 28.5,
    yPct: 49,
    siteArea: '850 sq.m',
    structure: 'Dressed Granite Rubble Masonry & Exposed Timber Rafters',
    lead: 'A hillside residence situated on terraced agricultural contours, celebrating stone masonry and open courtyards framing the Dhauladhar range.',
    description: `Configured on a sequence of ancestral tea garden terraces, Residence 1 is organized around three courtyards that negotiate the steep 14-meter site gradient. By embedding the lower bedroom levels into the earth and floating the living pavilions above, the house maximizes panoramic mountain vistas while maintaining high thermal mass.\n\nLocally quarried granite from the Neugal riverbed forms the primary structural envelope, insulated with lime plasters and finished with cedar joinery. The southern courtyard acts as a solar heat trap during cold winter afternoons, while covered verandahs provide natural ventilation during monsoon downpours.`,
    heroImage: '/projects/kumar-residence/elevation.webp',
    images: [
      '/projects/kumar-residence/elevation.webp',
      '/projects/kumar-residence/facade.webp',
      '/projects/kumar-residence/terrace.webp',
      '/projects/kumar-residence/landscape.webp'
    ]
  },
  {
    id: 'dak-bungalow',
    name: 'Dak Bungalow',
    type: 'Architecture, Interiors, Landscape',
    category: 'Conservation',
    color: '#6b4c2a',
    year: '2021â€“2022',
    location: 'Palampur, Kangra, H.P.',
    lat: '32.1195792Â° N',
    lng: '76.539898Â° E',
    alt: '1,312 m',
    xPct: 29.5,
    yPct: 48.5,
    siteArea: '1,800 sq.m',
    structure: 'Colonial Timber Truss Restoration & Slate Roof Reconstruction',
    lead: 'An adaptive reuse intervention of a colonial-era bungalow, reviving cedar woodwork and veranda culture in a tea garden setting.',
    description: `Constructed in the early 20th century as a traveler's rest house amidst the Palampur tea estates, the Dak Bungalow had suffered from decades of neglect and leaky corrugated roofing. The revitalization project breathes new life into the historic structure while transforming it into a boutique mountain retreat.\n\nEvery original deodar roof truss was inspected, treated, and reinforced. The perimeter deep-verandah was painstakingly restored with handcrafted wooden fretwork and traditional lime-surkhi plastering, re-establishing the intimate dialogue between interior living spaces and ancient pine groves.`,
    heroImage: '/projects/dak-bungalow/dsc07026.webp',
    images: [
      '/projects/dak-bungalow/dsc07026.webp',
      '/projects/dak-bungalow/dsc07031.webp',
      '/projects/dak-bungalow/dsc07074.webp',
      '/projects/dak-bungalow/dsc07254.webp',
      '/projects/dak-bungalow/dsc07287.webp',
      '/projects/dak-bungalow/dsc07295.webp'
    ]
  },
  {
    id: 'firewood-cafe',
    name: 'CafÃ© Firewood',
    type: 'Architecture, Interiors',
    category: 'Interiors',
    color: '#8b6914',
    year: '2023',
    location: 'Neugal, Kangra, H.P.',
    lat: '32.1254683Â° N',
    lng: '76.5322897Â° E',
    alt: '1,300 m',
    xPct: 29,
    yPct: 48,
    siteArea: '320 sq.m',
    structure: 'Recycled Pine Slabs, Blackened Steel & River Slate',
    lead: 'A warm, tactile hospitality interior crafted around local slate, raw timber and stone, facing the Neugal gorge stream.',
    description: `Conceived around the primal warmth of fire and mountain hospitality, CafÃ© Firewood sits above the rushing waters of Neugal river gorge. The design features a sunken central hearth surrounded by tiered banquette seating built with dry-stacked slate.\n\nReclaimed local pine rafters, patinated iron fixtures, and textured mud-plaster walls create an atmospheric interior that changes character with the morning mist and evening valley shadows. Large glass apertures frame uninterrupted views of the snowclad Dhauladhar peaks.`,
    heroImage: '/projects/firewood-cafe/whatsapp-image-2026-07-21-at-2.05.53-pm.webp',
    images: [
      '/projects/firewood-cafe/whatsapp-image-2026-07-21-at-2.05.53-pm.webp',
      '/projects/firewood-cafe/whatsapp-image-2026-07-21-at-2.05.54-pm.webp',
      '/projects/firewood-cafe/whatsapp-image-2026-07-21-at-2.05.55-pm.webp',
      '/projects/firewood-cafe/whatsapp-image-2026-07-21-at-2.05.57-pm.webp'
    ]
  },
  {
    id: 'kheer-ganga-ghat',
    name: 'Kheer Ganga Ghat Rejuvenation',
    type: 'Planning, Landscape',
    category: 'Planning',
    color: '#5a3e85',
    year: '2026',
    location: 'Baijnath, Kangra, H.P.',
    lat: '32.0517959Â° N',
    lng: '76.6446571Â° E',
    alt: '1,027 m',
    xPct: 30.5,
    yPct: 50.5,
    siteArea: '4,500 sq.m',
    structure: 'Permeable Basalt Steps, Native Riparian Planting & Stone Revetment',
    lead: 'A comprehensive riverfront public edge revitalizing the sacred pilgrimage access steps and native riparian ecology along the Binwa river at historic Baijnath temple.',
    description: `The Baijnath Shiva Temple, consecrated in 1204 CE, borders the sacred Binwa river. Over decades, flood erosion and concrete interventions had severed the temple precinct from the water edge.\n\nOur masterplan re-establishes a stepped stone ghat built with permeable dry-stone retaining techniques. Tiered bathing pavilions, prayer plazas, and bio-swales restore the native riverine flora while providing safe, dignified public gathering spaces during annual Shivratri festivities.`,
    heroImage: '/projects/jia-wellness-resort/exterior-1.webp',
    images: [
      '/projects/jia-wellness-resort/exterior-1.webp',
      '/projects/jia-wellness-resort/exterior-2.webp',
      '/projects/jia-wellness-resort/exterior-3.webp',
      '/projects/jia-wellness-resort/exterior-4.webp'
    ]
  },
  {
    id: 'eco-resort-paudi',
    name: 'Eco Resort at Paudi',
    type: 'Architecture, Landscape',
    category: 'Hospitality',
    color: '#c0392b',
    year: '2019',
    location: 'Gadwagad, Pauri Garhwal, U.K.',
    lat: '30.1510831Â° N',
    lng: '78.7979871Â° E',
    alt: '972 m',
    xPct: 58,
    yPct: 75,
    siteArea: '6,200 sq.m',
    structure: 'Lightweight Timber Prefabrication & Local Dry-Stone Plinths',
    lead: 'Low-impact modular mountain cabins stepping down steep pine slopes, designed to leave natural forest drainage and ground cover undisturbed.',
    description: `Perched on a ridge in Garhwal overlooking the Alaknanda river basin, this eco-resort demonstrates how hospitality architecture can touch the mountain terrain lightly. Cabins were prefabricated off-site in modular pine cassettes and assembled on minimal stone piers.\n\nBy avoiding massive concrete footings, 100% of the hillside pine canopy and natural water drainage corridors were preserved intact. Wide wooden decks cantilever over the valley, offering immersive engagement with mountain breezes and shifting clouds.`,
    heroImage: '/projects/eco-resort-paudi/1.webp',
    images: [
      '/projects/eco-resort-paudi/1.webp',
      '/projects/eco-resort-paudi/2.webp',
      '/projects/eco-resort-paudi/images-bugyal-stays-2017.webp',
      '/projects/eco-resort-paudi/dsc04894.webp',
      '/projects/eco-resort-paudi/whatsapp-image-2026-07-21-at-1-16-16-pm.webp',
      '/projects/eco-resort-paudi/images-dsc06835.webp',
      '/projects/eco-resort-paudi/images-dsc06836.webp',
      '/projects/eco-resort-paudi/images-dsc06837.webp',
      '/projects/eco-resort-paudi/images-dsc06838.webp',
      '/projects/eco-resort-paudi/images-dsc06850.webp',
      '/projects/eco-resort-paudi/images-dsc06858.webp',
      '/projects/eco-resort-paudi/images-dsc06891.webp',
      '/projects/eco-resort-paudi/images-dsc06897.webp',
      '/projects/eco-resort-paudi/images-dsc06905.webp',
      '/projects/eco-resort-paudi/images-dsc06910.webp',
      '/projects/eco-resort-paudi/images-img-20191109-115524.webp',
      '/projects/eco-resort-paudi/images-img-20191109-115830.webp',
      '/projects/eco-resort-paudi/images-img-20191109-143801.webp',
      '/projects/eco-resort-paudi/images-img-20200112-131346.webp',
      '/projects/eco-resort-paudi/images-img-20200112-131543.webp',
      '/projects/eco-resort-paudi/images-img-20200113-103259.webp',
      '/projects/eco-resort-paudi/images-img-20200113-110013.webp',
      '/projects/eco-resort-paudi/images-2134.webp',
      '/projects/eco-resort-paudi/images-446777998.webp'
    ]
  },
  {
    id: 'attic-pine-dale',
    name: 'Attic at Pine Dale',
    type: 'Architecture, Interiors',
    category: 'Interiors',
    color: '#8b6914',
    year: '2019',
    location: 'Kaithu, Shimla, H.P.',
    lat: '31.1145324Â° N',
    lng: '77.1630415Â° E',
    alt: '2,080 m',
    xPct: 38,
    yPct: 63,
    siteArea: '180 sq.m',
    structure: 'Exposed Deodar Trusses & North-Light Skylights',
    lead: 'Transformation of a heritage attic under gabled corrugated metal roofs into a luminous living studio overlooking the Shimla ridge.',
    description: `Located in the historical British-era suburb of Kaithu in Shimla, this project converted an uninsulated storage loft into a serene architectural studio and residence.\n\nBy carving skylights into the north-facing pitched roof and stripping back paint layers to reveal 90-year-old hand-planed deodar trusses, the space gains airy verticality and natural thermal convection during cold mountain winters.`,
    heroImage: '/projects/house-samloti/whatsapp-image-2026-07-21-at-1.26.21-pm.webp',
    images: [
      '/projects/house-samloti/whatsapp-image-2026-07-21-at-1.26.21-pm.webp',
      '/projects/house-samloti/whatsapp-image-2026-07-21-at-1.26.21-pm-(1).webp',
      '/projects/house-samloti/whatsapp-image-2026-07-21-at-1.34.05-pm.webp'
    ]
  },
  {
    id: 'khangsar-palace',
    name: 'Khangsar Palace Restoration',
    type: 'Architectural Conservation',
    category: 'Conservation',
    color: '#6b4c2a',
    year: '2017',
    location: 'Khangsar Village, Lahaul & Spiti, H.P.',
    lat: '32.6063481Â° N',
    lng: '77.1369672Â° E',
    alt: '3,503 m',
    xPct: 36,
    yPct: 40,
    siteArea: '2,200 sq.m',
    structure: 'Vernacular Kath-Kuni Timber Lacing & Rubble Stone Masonry',
    lead: 'Restoration and seismic strengthening of a 108-room vernacular castle fortress in the harsh high-altitude climate of the Western Himalayas.',
    description: `Khangsar Palace is one of the most significant surviving examples of Tibetan-influenced Himalayan fortification architecture in Lahaul. Built over four centuries ago at 3,500 meters altitude, it withstood sub-zero blizzards but faced imminent collapse from decayed timber floor diaphragms.\n\nThe restoration initiative re-engaged ancestral timber tie techniques (*Kath-Kuni*), introducing concealed stainless steel seismic ties and replacing weathered willow roof purlins with sustainably harvested regional timber.`,
    heroImage: '/projects/khangsar-palace/exterior-front.webp',
    images: [
      '/projects/khangsar-palace/exterior-front.webp',
      '/projects/khangsar-palace/1.webp',
      '/projects/khangsar-palace/2.webp',
      '/projects/khangsar-palace/4.webp',
      '/projects/khangsar-palace/9.webp',
      '/projects/khangsar-palace/10.webp',
      '/projects/khangsar-palace/palace-view.webp',
      '/projects/khangsar-palace/section-1.webp'
    ]
  },
  {
    id: 'bir-forest-retreat',
    name: 'Bir Forest Retreat',
    type: 'Architecture, Interiors, Landscape',
    category: 'Hospitality',
    color: '#c0392b',
    year: '2026',
    location: 'Bir, Kangra, H.P.',
    lat: '32.0542089Â° N',
    lng: '76.7107543Â° E',
    alt: '1,354 m',
    xPct: 31.5,
    yPct: 50,
    siteArea: '5,000 sq.m',
    structure: 'Local Slate Roofs, Hand-Dressed Slate Masonry & Cedar Joinery',
    lead: 'A discreet eco-hospitality cluster embedded into the oak forest threshold, balancing natural slope retention with panoramic valley terraces.',
    description: `Sited on the forest boundary of upper Bir, renowned for paragliding and Tibetan monastic culture, this retreat is designed as a clustered mountain village. The individual guest suites step along the contour lines, shaded by mature Himalayan oaks and rhododendrons.\n\nThe architecture draws directly from vernacular Kangra homes: pitched slate roofs, deep eaves, low-profile masonry walls, and expansive corner windows that open towards the sunset valley views.`,
    heroImage: '/projects/bir-forest-retreat/bird-s-eye.webp',
    images: [
      '/projects/bir-forest-retreat/bird-s-eye.webp',
      '/projects/bir-forest-retreat/blmn-ai-3pbnid7qsln.webp',
      '/projects/bir-forest-retreat/courtyard.webp',
      '/projects/bir-forest-retreat/plan.webp'
    ]
  },
  {
    id: 'residence-2',
    name: 'Residence 2',
    type: 'Architecture, Interiors',
    category: 'Residential',
    color: '#2c5f8a',
    year: '2022',
    location: 'Nagrota, Kangra, H.P.',
    lat: '32.09237Â° N',
    lng: '76.34489Â° E',
    alt: '781 m',
    xPct: 26.5,
    yPct: 49.5,
    siteArea: '620 sq.m',
    structure: 'Exposed Monolithic Masonry, Sloped Eaves & Terrazzo Floors',
    lead: 'A contemporary masonry dwelling configured with deep roof overhangs and shaded verandahs to manage Kangra valley monsoon precipitation.',
    description: `Constructed in the foothills of Nagrota Bagwan, Residence 2 mediates between subtropical summer heat and heavy mountain monsoons. The floor plan wraps around a semi-covered central court that channels prevailing valley breezes through the living quarters.\n\nDeep projected eaves shield exterior walls from intense downpours, while polished local stone floors provide natural cooling without active mechanical refrigeration.`,
    heroImage: '/projects/house-samloti/whatsapp-image-2026-07-21-at-1.34.05-pm.webp',
    images: [
      '/projects/house-samloti/whatsapp-image-2026-07-21-at-1.34.05-pm.webp',
      '/projects/house-samloti/whatsapp-image-2026-07-21-at-1.34.06-pm.webp',
      '/projects/house-samloti/whatsapp-image-2026-07-21-at-1.34.08-pm.webp'
    ]
  },
  {
    id: 'gamru-school',
    name: 'Gamru Village School',
    type: 'Architecture, Interiors, Landscape',
    category: 'Public',
    color: '#2d6a4f',
    year: '2024',
    location: 'Gamru Village, Dharamshala, H.P.',
    lat: '32.22932Â° N',
    lng: '76.32371Â° E',
    alt: '1,708 m',
    xPct: 26,
    yPct: 46,
    siteArea: '1,400 sq.m',
    structure: 'Modular Timber Frameworks, Stone Plinths & Rammed Earth',
    lead: 'A community-driven primary learning center providing well-lit stepped classrooms, playful terraces and sheltered gathering corridors overlooking the Dharamshala hills.',
    description: `Gamru Village School was realized through intensive participatory workshops with village teachers, parents, and children. Sited on a steep stepped slope above Dharamshala, the school replaces dilapidated sheds with light-filled, safe learning pavilions.\n\nThe stepped courtyards serve dual functions as outdoor classrooms and community amphitheatres. Classrooms are built with modular locally milled pine frames and insulated slate roofs, providing thermal comfort through cold Himalayan winters.`,
    heroImage: '/projects/gamru-school/blu.webp',
    images: [
      '/projects/gamru-school/blu.webp',
      '/projects/gamru-school/gvs-pen-3.webp',
      '/projects/gamru-school/courtyards-social.webp',
      '/projects/gamru-school/community-participation.webp',
      '/projects/gamru-school/baud-attics.webp',
      '/projects/gamru-school/industrial-design.webp',
      '/projects/gamru-school/memories.webp',
      '/projects/gamru-school/newari-court.webp',
      '/projects/gamru-school/ponds.webp',
      '/projects/gamru-school/ppp.webp',
      '/projects/gamru-school/grid.webp'
    ]
  }
];

function generateProjectPage(p, index) {
  // 4 related projects for bottom carousel
  const relatedProjects = projects.filter((_, idx) => idx !== index).slice(0, 4);

  // Gallery generation: 2-column photo layout with click-to-fullscreen lightbox
  const galleryItems = p.images.map((img, i) => `
    <figure class="kkaa-photo-item" data-index="${i}" title="Click to view fullscreen">
      <img src="${img}" alt="${p.name} - photograph ${i + 1}" loading="lazy" />
    </figure>
  `).join('');

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#ffffff" />
    <meta name="description" content="${p.name} â€” ${p.type} by Dovetail Architecture in ${p.location}." />
    <title>${p.name} â€” Dovetail Architecture</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=EB+Garamond:ital,wght@0,400;0,500;1,400&family=Inter:wght@300;400&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/styles.css" />
    <style>
      /* KKAA PROJECT DETAIL TEMPLATE STYLES */
      body {
        background: #ffffff;
      }
      
      .kkaa-hero-container {
        width: 100%;
        max-width: 100%;
        margin: 72px 0 0;
        padding: 0;
      }
      .kkaa-hero-image-wrap {
        width: 100%;
        height: 56vh;
        min-height: 360px;
        max-height: 580px;
        overflow: hidden;
        background: #1a1a1a;
        cursor: pointer;
        position: relative;
      }
      .kkaa-hero-image-wrap img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
        display: block;
        transform: translateZ(0);
        will-change: transform;
        transform-origin: center center;
        backface-visibility: hidden;
        -webkit-backface-visibility: hidden;
        animation: heroSlowZoom 20s ease-in-out infinite alternate;
        transition: opacity 0.4s ease, filter 0.4s ease;
      }
      .kkaa-hero-image-wrap:hover img {
        opacity: 0.96;
        filter: brightness(1.03);
      }

      @keyframes heroSlowZoom {
        0% {
          transform: scale(1) translateZ(0);
        }
        100% {
          transform: scale(1.08) translateZ(0);
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .kkaa-hero-image-wrap img {
          animation: none;
        }
      }

      /* Project Info Header */
      .kkaa-project-info-block {
        max-width: 900px;
        margin: 0 auto;
        padding: 70px 48px 60px;
        text-align: center;
      }
      .kkaa-meta-kicker {
        font-family: var(--mono);
        font-size: 8.5px;
        letter-spacing: 0.22em;
        text-transform: uppercase;
        color: var(--muted);
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
      }
      .kkaa-meta-kicker .cat-dot {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: ${p.color};
      }
      .kkaa-project-title {
        font-family: var(--serif);
        font-size: clamp(42px, 5.5vw, 64px);
        font-weight: 400;
        line-height: 1.05;
        letter-spacing: -0.01em;
        margin-bottom: 14px;
      }
      .kkaa-project-subtitle {
        font-family: var(--mono);
        font-size: 9.5px;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: var(--muted);
        margin-bottom: 40px;
      }
      .kkaa-project-narrative {
        font-size: 14px;
        line-height: 1.95;
        color: #333;
        text-align: left;
        display: flex;
        flex-direction: column;
        gap: 18px;
        font-weight: 300;
      }
      .kkaa-project-lead {
        font-size: 15.5px;
        line-height: 1.85;
        color: #111;
        font-weight: 400;
        border-left: 2px solid ${p.color};
        padding-left: 18px;
        margin: 10px 0 16px;
      }

      /* Project Facts Matrix */
      .kkaa-spec-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 24px;
        border-top: 1px solid var(--line);
        border-bottom: 1px solid var(--line);
        padding: 28px 0;
        margin: 40px 0 0;
        text-align: left;
      }
      .spec-cell {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      .spec-title {
        font-family: var(--mono);
        font-size: 8px;
        letter-spacing: 0.16em;
        text-transform: uppercase;
        color: var(--muted);
      }
      .spec-val {
        font-size: 12px;
        color: var(--ink);
      }

      /* 2-Column Photo Gallery (KKAA Reference Layout) */
      .kkaa-gallery-container {
        max-width: 1600px;
        margin: 0 auto;
        padding: 40px 48px 80px;
      }
      .kkaa-photo-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;
      }
      .kkaa-photo-item {
        margin: 0;
        overflow: hidden;
        background: #f7f7f7;
        cursor: pointer;
        position: relative;
      }
      .kkaa-photo-item img {
        width: 100%;
        height: auto;
        display: block;
        transition: transform 0.4s ease, opacity 0.3s ease;
      }
      .kkaa-photo-item:hover img {
        opacity: 0.92;
        transform: scale(1.015);
      }
      .kkaa-photo-item::after {
        content: 'â¤¢';
        position: absolute;
        bottom: 12px;
        right: 12px;
        width: 32px;
        height: 32px;
        background: rgba(255,255,255,0.92);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        color: #111;
        opacity: 0;
        transition: opacity 0.2s ease, transform 0.2s ease;
        transform: scale(0.9);
        pointer-events: none;
      }
      .kkaa-photo-item:hover::after {
        opacity: 1;
        transform: scale(1);
      }

      /* Fullscreen Lightbox Modal */
      .kkaa-lightbox {
        position: fixed;
        inset: 0;
        z-index: 1000;
        background: rgba(10, 10, 10, 0.95);
        backdrop-filter: blur(12px);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        padding: 28px 48px;
        opacity: 0;
        visibility: hidden;
        pointer-events: none;
        transition: opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.3s;
      }
      .kkaa-lightbox.is-open {
        opacity: 1;
        visibility: visible;
        pointer-events: all;
      }
      .lightbox-close {
        position: absolute;
        top: 24px;
        right: 32px;
        font-size: 38px;
        font-weight: 300;
        color: #ffffff;
        background: none;
        border: none;
        cursor: pointer;
        line-height: 1;
        opacity: 0.75;
        transition: opacity 0.2s, transform 0.2s;
        z-index: 1010;
      }
      .lightbox-close:hover {
        opacity: 1;
        transform: scale(1.1);
      }
      .lightbox-prev, .lightbox-next {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        font-size: 28px;
        font-weight: 300;
        color: #ffffff;
        background: rgba(255,255,255,0.08);
        border: 1px solid rgba(255,255,255,0.18);
        width: 56px;
        height: 56px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        opacity: 0.75;
        transition: opacity 0.2s, background 0.2s, transform 0.2s;
        z-index: 1010;
        user-select: none;
      }
      .lightbox-prev:hover, .lightbox-next:hover {
        opacity: 1;
        background: rgba(255,255,255,0.22);
        transform: translateY(-50%) scale(1.08);
      }
      .lightbox-prev { left: 32px; }
      .lightbox-next { right: 32px; }
      
      .lightbox-content {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        max-height: calc(100vh - 130px);
        overflow: hidden;
      }
      .lightbox-content img {
        max-width: 90vw;
        max-height: 80vh;
        object-fit: contain;
        box-shadow: 0 12px 48px rgba(0,0,0,0.65);
        transition: opacity 0.25s ease;
      }
      .lightbox-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        max-width: 1200px;
        color: rgba(255,255,255,0.7);
        padding-top: 14px;
        border-top: 1px solid rgba(255,255,255,0.12);
      }
      .lightbox-caption {
        font-family: var(--serif);
        font-size: 16px;
        letter-spacing: -0.01em;
      }
      .lightbox-counter {
        font-family: var(--mono);
        font-size: 9.5px;
        letter-spacing: 0.2em;
        text-transform: uppercase;
      }

      /* Location & Topographic Map Section (KKAA Reference) */
      .kkaa-location-section {
        max-width: 1600px;
        margin: 0 auto;
        padding: 20px 48px 80px;
      }
      .kkaa-location-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 14px 20px;
        border: 1px solid var(--line-med);
        border-bottom: none;
        background: #ffffff;
      }
      .loc-header-title {
        font-family: var(--mono);
        font-size: 8.5px;
        letter-spacing: 0.18em;
        text-transform: uppercase;
        color: var(--ink);
        font-weight: 500;
      }
      .loc-header-coords {
        font-family: var(--mono);
        font-size: 8.5px;
        letter-spacing: 0.12em;
        color: var(--muted);
      }
      .kkaa-location-map-wrap {
        position: relative;
        width: 100%;
        aspect-ratio: 21 / 9;
        max-height: 480px;
        overflow: hidden;
        border: 1px solid var(--line-med);
        background: #ffffff;
      }
      .kkaa-location-map-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center 30%;
        filter: contrast(1.1) brightness(1.02);
        user-select: none;
        pointer-events: none;
      }
      .kkaa-project-pin {
        position: absolute;
        transform: translate(-50%, -50%);
        cursor: pointer;
        z-index: 15;
      }
      .kkaa-pin-dot {
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background: var(--pin-color, #111);
        border: 3px solid #ffffff;
        box-shadow: 0 2px 8px rgba(0,0,0,0.35), 0 0 0 1.5px var(--pin-color, #111);
        position: relative;
        z-index: 2;
      }
      .kkaa-pin-ring {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 34px;
        height: 34px;
        border-radius: 50%;
        border: 1.5px solid var(--pin-color, #111);
        opacity: 0.6;
        animation: pin-pulse 2.5s ease-out infinite;
      }
      @keyframes pin-pulse {
        0% { transform: translate(-50%, -50%) scale(0.6); opacity: 0.8; }
        100% { transform: translate(-50%, -50%) scale(1.6); opacity: 0; }
      }
      .kkaa-pin-card {
        position: absolute;
        left: 20px;
        top: 50%;
        transform: translateY(-50%);
        background: rgba(255,255,255,0.96);
        border: 1px solid rgba(0,0,0,0.18);
        padding: 6px 12px;
        display: flex;
        flex-direction: column;
        gap: 2px;
        white-space: nowrap;
        box-shadow: 0 4px 16px rgba(0,0,0,0.08);
        pointer-events: none;
      }
      .kkaa-pin-card strong {
        font-family: var(--serif);
        font-size: 15px;
        font-weight: 500;
        line-height: 1.1;
      }
      .kkaa-pin-card span {
        font-family: var(--mono);
        font-size: 7.5px;
        letter-spacing: 0.08em;
        color: var(--muted);
      }
      .kkaa-map-compass {
        position: absolute;
        top: 14px;
        right: 18px;
        font-family: var(--mono);
        font-size: 10px;
        font-weight: 600;
        color: var(--ink);
        background: rgba(255,255,255,0.85);
        padding: 3px 7px;
        border: 1px solid var(--line);
      }
      .kkaa-location-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 14px 20px;
        border: 1px solid var(--line-med);
        border-top: none;
        background: #ffffff;
      }
      .kkaa-location-footer span {
        font-family: var(--mono);
        font-size: 8px;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: var(--muted);
      }
      .kkaa-map-links {
        display: flex;
        gap: 20px;
      }
      .kkaa-map-btn {
        font-family: var(--mono);
        font-size: 8.5px;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: var(--ink);
        border-bottom: 1px solid var(--ink);
        padding-bottom: 2px;
        transition: opacity 0.2s;
      }
      .kkaa-map-btn:hover {
        opacity: 0.6;
      }

      /* Selected Projects Carousel at Bottom (KKAA Reference) */
      .kkaa-selected-projects-drawer {
        background: #f9f8f5;
        border-top: 1px solid var(--line);
        padding: 70px 48px 80px;
      }
      .drawer-inner {
        max-width: 1600px;
        margin: 0 auto;
      }
      .drawer-title-wrap {
        text-align: center;
        margin-bottom: 44px;
      }
      .drawer-title {
        font-family: var(--mono);
        font-size: 10.5px;
        letter-spacing: 0.25em;
        text-transform: uppercase;
        color: var(--ink);
      }
      .related-projects-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 24px;
        margin-bottom: 48px;
      }
      .related-card {
        display: flex;
        flex-direction: column;
        text-decoration: none;
        color: var(--ink);
      }
      .related-img-wrap {
        width: 100%;
        aspect-ratio: 16 / 10;
        overflow: hidden;
        background: #eaeaea;
        margin-bottom: 10px;
      }
      .related-img-wrap img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s ease, opacity 0.3s ease;
      }
      .related-card:hover .related-img-wrap img {
        transform: scale(1.03);
        opacity: 0.9;
      }
      .related-loc {
        font-family: var(--mono);
        font-size: 7.5px;
        letter-spacing: 0.12em;
        color: var(--muted);
        text-transform: uppercase;
        margin-bottom: 4px;
      }
      .related-name {
        font-family: var(--serif);
        font-size: 16px;
        font-weight: 400;
      }
      .drawer-btn-wrap {
        text-align: center;
      }
      .drawer-all-btn {
        display: inline-block;
        font-family: var(--mono);
        font-size: 9px;
        letter-spacing: 0.18em;
        text-transform: uppercase;
        padding: 10px 24px;
        border: 1px solid var(--ink);
        color: var(--ink);
        transition: background 0.2s, color 0.2s;
      }
      .drawer-all-btn:hover {
        background: var(--ink);
        color: #fff;
      }

      @media (max-width: 1024px) {
        .kkaa-gallery-container, .kkaa-location-section, .kkaa-selected-projects-drawer { padding-left: 24px; padding-right: 24px; }
        .kkaa-hero-container { padding: 0 !important; }
        .kkaa-spec-grid { grid-template-columns: 1fr 1fr; gap: 18px; }
        .related-projects-grid { grid-template-columns: repeat(2, 1fr); gap: 20px; }
      }
      @media (max-width: 768px) {
        .kkaa-hero-container { margin-top: 60px; padding: 0 !important; }
        .kkaa-hero-image-wrap { height: 42vh; min-height: 250px; }
        .kkaa-project-info-block { padding: 40px 20px 40px; }
        .kkaa-photo-grid { grid-template-columns: 1fr; gap: 12px; }
        .kkaa-spec-grid { grid-template-columns: 1fr; }
        .kkaa-location-header, .kkaa-location-footer { flex-direction: column; align-items: flex-start; gap: 8px; }
        .related-projects-grid { grid-template-columns: 1fr; }
        .kkaa-lightbox { padding: 18px; }
        .lightbox-prev { left: 12px; width: 44px; height: 44px; font-size: 22px; }
        .lightbox-next { right: 12px; width: 44px; height: 44px; font-size: 22px; }
        .lightbox-close { top: 16px; right: 20px; }
      }
    </style>
  </head>
  <body>
    <div id="app">
      <!-- Minimal Header -->
      <header class="nav">
        <div class="nav-inner">
          <a class="nav-logo-wrap" href="/" aria-label="Dovetail Architecture">
            <img src="/logo.png" alt="Dovetail Architecture" class="nav-logo" />
          </a>
          <nav class="nav-links">
            <a href="/" class="nav-link">Home</a>
            <a href="/projects.html" class="nav-link">Projects</a>
            <a href="/approach.html" class="nav-link">Approach</a>
            <a href="/contact.html" class="nav-link">Contact</a>
          </nav>
        </div>
      </header>

      <main class="site-shell">
        <!-- 1. Wide Hero Header -->
        <div class="kkaa-hero-container">
          <div class="kkaa-hero-image-wrap" title="Click to view fullscreen">
            <img src="${p.heroImage}" alt="${p.name} - Architecture View" />
          </div>
        </div>

        <!-- 2. Project Title & Narrative Block -->
        <section class="kkaa-project-info-block">
          <div class="kkaa-meta-kicker">
            <span class="cat-dot"></span>
            <span>${p.category.toUpperCase()} Â· ${p.year} Â· ${p.alt} ALT</span>
          </div>
          <h1 class="kkaa-project-title">${p.name}</h1>
          <div class="kkaa-project-subtitle">${p.location}</div>

          <div class="kkaa-project-narrative">
            <div class="kkaa-project-lead">${p.lead}</div>
            ${p.description.split('\n\n').map(para => `<p>${para}</p>`).join('')}
          </div>

          <!-- Project Specs Matrix -->
          <div class="kkaa-spec-grid">
            <div class="spec-cell">
              <span class="spec-title">Location</span>
              <span class="spec-val">${p.location}</span>
            </div>
            <div class="spec-cell">
              <span class="spec-title">Typology</span>
              <span class="spec-val">${p.type}</span>
            </div>
            <div class="spec-cell">
              <span class="spec-title">Year</span>
              <span class="spec-val">${p.year}</span>
            </div>
            <div class="spec-cell">
              <span class="spec-title">Altitude</span>
              <span class="spec-val">${p.alt}</span>
            </div>
            <div class="spec-cell">
              <span class="spec-title">Site / Built Area</span>
              <span class="spec-val">${p.siteArea || 'Variable'}</span>
            </div>
            <div class="spec-cell">
              <span class="spec-title">Principal Architect</span>
              <span class="spec-val">Ar. Karan Sharma (M.Arch CEPT)</span>
            </div>
            <div class="spec-cell" style="grid-column: span 3;">
              <span class="spec-title">Primary Structure &amp; Materiality</span>
              <span class="spec-val">${p.structure || 'Regional Stone Masonry & Timber Joinery'}</span>
            </div>
          </div>
        </section>

        <!-- 3. 2-Column Photo Grid (Clickable to Fullscreen Slideshow) -->
        <section class="kkaa-gallery-container">
          <div class="kkaa-photo-grid">
            ${galleryItems}
          </div>
        </section>

        <!-- 4. Location Context Map Section (KKAA Reference Layout) -->
        <section class="kkaa-location-section">
          <div class="kkaa-location-header">
            <span class="loc-header-title">PROJECT LOCATION &amp; TOPOGRAPHY â€” ${p.location.toUpperCase()}</span>
            <span class="loc-header-coords">LAT: ${p.lat} Â· LNG: ${p.lng} Â· ALT: ${p.alt}</span>
          </div>
          <div class="kkaa-location-map-wrap">
            <img src="/himalayan-contour-map.jpg" alt="Topographic Contour Map of ${p.name} Location" class="kkaa-location-map-img" />
            <!-- Active Project Pin on Map -->
            <div class="kkaa-project-pin" style="left: ${p.xPct}%; top: ${p.yPct}%; --pin-color: ${p.color};">
              <div class="kkaa-pin-ring"></div>
              <div class="kkaa-pin-dot"></div>
              <div class="kkaa-pin-card">
                <strong>${p.name}</strong>
                <span>${p.location} Â· ${p.alt}</span>
              </div>
            </div>
            <div class="kkaa-map-compass">
              <img src="/mouseicon.svg" alt="North indicator" style="width: 20px; height: 20px; display: inline-block; vertical-align: middle;" />
              <span>N</span>
            </div>
          </div>
          <div class="kkaa-location-footer">
            <span>WESTERN HIMALAYAN REGION Â· TOPOGRAPHIC CONTOUR MAPPING</span>
            <div class="kkaa-map-links">
              <a href="/#map-section" class="kkaa-map-btn">â† View on Regional Interactive Map</a>
              <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.name + ' ' + p.location)}" target="_blank" rel="noreferrer" class="kkaa-map-btn">Google Maps â†—</a>
            </div>
          </div>
        </section>

        <!-- 5. Selected Projects Drawer at Bottom (KKAA Reference) -->
        <section class="kkaa-selected-projects-drawer">
          <div class="drawer-inner">
            <div class="drawer-title-wrap">
              <h3 class="drawer-title">SELECTED PROJECTS</h3>
            </div>
            <div class="related-projects-grid">
              ${relatedProjects.map(rp => `
                <a href="/projects/${rp.id}.html" class="related-card">
                  <div class="related-img-wrap">
                    <img src="${rp.heroImage}" alt="${rp.name}" loading="lazy" />
                  </div>
                  <span class="related-loc">${rp.location}</span>
                  <strong class="related-name">${rp.name}</strong>
                </a>
              `).join('')}
            </div>
            <div class="drawer-btn-wrap">
              <a href="/projects.html" class="drawer-all-btn">SEE ALL PROJECTS</a>
            </div>
          </div>
        </section>
      </main>

      <!-- Fullscreen Lightbox Slideshow Modal -->
      <div class="kkaa-lightbox" id="kkaa-lightbox" aria-hidden="true" role="dialog" aria-modal="true">
        <button class="lightbox-close" id="lightbox-close" aria-label="Close fullscreen slideshow">Ã—</button>
        <button class="lightbox-prev" id="lightbox-prev" aria-label="Previous photograph">â€¹</button>
        <button class="lightbox-next" id="lightbox-next" aria-label="Next photograph">â€º</button>
        
        <div class="lightbox-content">
          <img src="" alt="${p.name} fullscreen photograph" id="lightbox-img" />
        </div>
        
        <div class="lightbox-footer">
          <div class="lightbox-caption" id="lightbox-caption">${p.name}</div>
          <div class="lightbox-counter" id="lightbox-counter">01 / ${String(p.images.length).padStart(2, '0')}</div>
        </div>
      </div>

      <!-- Clean Minimal Dark Footer -->
      <footer class="footer">
        <div class="footer-inner">
          <div class="footer-col footer-brand">
            <img src="/logo.png" alt="Dovetail Architecture" class="footer-logo" />
            <p class="footer-col-label" style="margin-top: 4px; margin-bottom: 8px;">Main Studio &amp; HQ</p>
            <address>
              First Floor, Main Bazaar<br>
              Palampur, Himachal Pradesh<br>
              176061, India
            </address>
            <p class="footer-principal" style="margin-top: 16px;">Ar. Karan Sharma <span>(M.Arch CEPT)</span></p>
          </div>
          <div class="footer-col">
            <p class="footer-col-label">Studios &amp; Presence</p>
                        <ul class="footer-list">
              <li>
                <strong style="color: var(--white); font-weight: 500;"><span class="footer-studio-bullet main-bullet">&#10022;</span> Palampur (Main Studio)</strong><br>
                <span style="opacity: 0.6; font-size: 11px;">First Floor, Main Bazaar, HP 176061</span>
              </li>
              <li>
                <strong style="color: var(--white); font-weight: 500;"><span class="footer-studio-bullet">&#9672;</span> Ladakh Studio</strong><br>
                <span style="opacity: 0.6; font-size: 11px;">Plains of Ladakh / Leh</span>
              </li>
              <li>
                <strong style="color: var(--white); font-weight: 500;"><span class="footer-studio-bullet">&#9672;</span> Chandigarh Studio</strong><br>
                <span style="opacity: 0.6; font-size: 11px;">Regional &amp; Urban Base</span>
              </li>
              <li>
                <strong style="color: var(--white); font-weight: 500;"><span class="footer-studio-bullet">&#9672;</span> Kathmandu Studio</strong><br>
                <span style="opacity: 0.6; font-size: 11px;">Central Himalayan Presence</span>
              </li>
            </ul>
          </div>
          <div class="footer-col">
            <p class="footer-col-label">Practice</p>
            <ul class="footer-list">
              <li><a href="/approach.html">Design Philosophy</a></li>
              <li><a href="/approach.html#place">Place &amp; Terrain</a></li>
              <li><a href="/approach.html#time">Material Memory</a></li>
              <li><a href="/approach.html#continuity">Continuity</a></li>
            </ul>
          </div>
          <div class="footer-col footer-contact-col">
            <p class="footer-col-label">Contact</p>
            <a href="mailto:Studio@dovetailarchitecture.in" class="footer-email">Studio@dovetailarchitecture.in</a>
            <a href="tel:+918091488858" class="footer-phone">+91 80914 88858</a>
          </div>
        </div>
        <div class="footer-bottom">
          <span>Â© 2026 Dovetail Architecture. All rights reserved.</span>
          <a href="#" class="back-to-top" onclick="window.scrollTo({top:0,behavior:'smooth'}); return false;">â†‘ Back to top</a>
        </div>
      </footer>
    </div>

    <!-- Lightbox Script -->
    <script>
      (function() {
        const images = ${JSON.stringify(p.images)};
        let currentIndex = 0;
        const lightbox = document.getElementById('kkaa-lightbox');
        const lightboxImg = document.getElementById('lightbox-img');
        const lightboxCaption = document.getElementById('lightbox-caption');
        const lightboxCounter = document.getElementById('lightbox-counter');
        const closeBtn = document.getElementById('lightbox-close');
        const prevBtn = document.getElementById('lightbox-prev');
        const nextBtn = document.getElementById('lightbox-next');
        const photoItems = document.querySelectorAll('.kkaa-photo-item');

        function showImage(index) {
          if (index < 0) index = images.length - 1;
          if (index >= images.length) index = 0;
          currentIndex = index;
          lightboxImg.style.opacity = '0';
          setTimeout(() => {
            lightboxImg.src = images[currentIndex];
            lightboxImg.style.opacity = '1';
            lightboxCounter.textContent = String(currentIndex + 1).padStart(2, '0') + ' / ' + String(images.length).padStart(2, '0');
          }, 100);
        }

        function openLightbox(index) {
          showImage(index);
          lightbox.classList.add('is-open');
          lightbox.setAttribute('aria-hidden', 'false');
          document.body.style.overflow = 'hidden';
        }

        function closeLightbox() {
          lightbox.classList.remove('is-open');
          lightbox.setAttribute('aria-hidden', 'true');
          document.body.style.overflow = '';
        }

        photoItems.forEach((item, idx) => {
          item.addEventListener('click', () => openLightbox(idx));
        });

        const heroWrap = document.querySelector('.kkaa-hero-image-wrap');
        if (heroWrap) {
          heroWrap.addEventListener('click', () => openLightbox(0));
        }

        if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
        if (prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); showImage(currentIndex - 1); });
        if (nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); showImage(currentIndex + 1); });

        lightbox.addEventListener('click', (e) => {
          if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
            closeLightbox();
          }
        });

        document.addEventListener('keydown', (e) => {
          if (!lightbox.classList.contains('is-open')) return;
          if (e.key === 'Escape') closeLightbox();
          if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
          if (e.key === 'ArrowRight') showImage(currentIndex + 1);
        });
      })();
    </script>
    <script src="/cursor.js"></script>
    <script>
      (function() {
        const btn = document.getElementById('mobile-menu-btn');
        const nav = document.getElementById('mobile-nav');
        if (btn && nav) {
          btn.addEventListener('click', () => {
            const open = nav.classList.toggle('is-open');
            btn.setAttribute('aria-expanded', String(open));
            nav.setAttribute('aria-hidden', String(!open));
          });
        }
      })();
    </script>
  </body>
</html>`;
}

// Generate all 11 project HTML pages
const outDir = path.join(__dirname, 'projects');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

projects.forEach((p, idx) => {
  const filePath = path.join(outDir, `${p.id}.html`);
  fs.writeFileSync(filePath, generateProjectPage(p, idx), 'utf8');
  console.log(`Generated: ${filePath}`);
});

console.log('All 11 project detail pages generated with Fullscreen Slideshow & Lightbox.');


