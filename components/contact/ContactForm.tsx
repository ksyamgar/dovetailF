'use client';

import React, { useState, useCallback, useEffect } from 'react';

type QueryCategory = 'project_enquiry' | 'message' | 'recruitment' | 'partnership' | 'media_academic';

interface CategoryTab {
  key: QueryCategory;
  label: string;
  icon: string;
  tagColor: string;
  tagTitle: string;
}

const CATEGORY_TABS: CategoryTab[] = [
  { key: 'project_enquiry', label: 'Project Commission', icon: '📐', tagColor: '#43A047', tagTitle: 'PROJECT COMMISSION PARAMETERS' },
  { key: 'message', label: 'General Message', icon: '💬', tagColor: '#8E24AA', tagTitle: 'GENERAL STUDIO INQUIRY & CONSULTATION' },
  { key: 'recruitment', label: 'Careers & Internships', icon: '🎓', tagColor: '#1E88E5', tagTitle: 'CAREER & INTERNSHIP APPLICATION' },
  { key: 'partnership', label: 'Craft & Engineering', icon: '🪵', tagColor: '#FB8C00', tagTitle: 'COLLABORATION & CRAFT PARTNERSHIP' },
  { key: 'media_academic', label: 'Press & Lectures', icon: '📰', tagColor: '#FBC02D', tagTitle: 'PRESS, PUBLICATION & ACADEMIC LECTURE' }
];

interface Preset {
  id: string;
  category: QueryCategory;
  label: string;
  icon: string;
  params: Record<string, string>;
  generateDraft: (params: Record<string, string>, user: { name: string; location: string }) => string;
}

const PRESETS: Preset[] = [
  // --- PROJECT ENQUIRY PRESETS ---
  {
    id: 'pe_mountain_residence',
    category: 'project_enquiry',
    label: 'Mountain Residence (HP)',
    icon: '🏡',
    params: {
      typology: 'Residential Mountain Home',
      region: 'Kangra Valley / Palampur / Dharamshala (H.P.)',
      condition: 'Vacant natural mountain slope',
      budget: '₹75 Lakh – 1.5 Cr',
      timeline: 'Within 3 months',
      area: 'Approx. 2 Kanals / 3,500 sq ft'
    },
    generateDraft: (p, u) =>
      `We are planning a sustainable residential mountain home in ${p.region || 'Himachal Pradesh'}${u.location ? ` near ${u.location}` : ''}. The site condition is currently a ${p.condition.toLowerCase()}${p.area ? ` spanning approximately ${p.area}` : ''}. Our anticipated construction timeline is ${p.timeline.toLowerCase()} with a planned budget range of ${p.budget}. We would like to schedule an initial design consultation with Ar. Karan Sharma and the studio team.`
  },
  {
    id: 'pe_heritage_kathkuni',
    category: 'project_enquiry',
    label: 'Kath-Kuni / Heritage Restoration',
    icon: '🏛️',
    params: {
      typology: 'Architectural Conservation / Heritage',
      region: 'Kullu / Manali / Tirthan (H.P.)',
      condition: 'Ancestral kath-kuni / colonial building',
      budget: '₹50 Lakh – 1.2 Cr',
      timeline: 'Within 1–3 months',
      area: 'Historic Structure / Multi-Storey'
    },
    generateDraft: (p) =>
      `We have an ancestral Himalayan heritage / kath-kuni timber-laced structure in ${p.region} requiring structural stability analysis, deodar timber restoration, slate roof reconstruction, and adaptive reuse planning. We are seeking Dovetail Architecture's conservation expertise for respectful revitalization.`
  },
  {
    id: 'pe_eco_retreat',
    category: 'project_enquiry',
    label: 'Hospitality / Eco-Retreat',
    icon: '🌿',
    params: {
      typology: 'Hospitality / Eco-Retreat',
      region: 'Garhwal / Kumaon (Uttarakhand)',
      condition: 'Vacant natural mountain slope',
      budget: '₹1.5 Cr – 5 Cr',
      timeline: 'Within 6 months',
      area: '3–5 Acres Mountain Site'
    },
    generateDraft: (p) =>
      `We are conceptualizing an eco-retreat / boutique mountain hospitality destination in ${p.region}. We aim to implement low-impact modular architecture, vernacular stonework, passive solar heating, and sensitive site contours without disturbing native forest cover. We would welcome an architectural feasibility discussion.`
  },
  {
    id: 'pe_ladakh_home',
    category: 'project_enquiry',
    label: 'Ladakh High-Altitude Home',
    icon: '🏔️',
    params: {
      typology: 'Residential Mountain Home',
      region: 'Ladakh / Upper Indus / High Altitude',
      condition: 'Sanctioned / approved plot',
      budget: '₹1 Cr – 2.5 Cr',
      timeline: 'Upcoming building season (Spring)',
      area: 'Upper Indus Valley Plateau'
    },
    generateDraft: (p) =>
      `We are planning a climate-resilient home in ${p.region} taking advantage of high-altitude passive solar gain, thick sun-dried mud brick / rammed earth envelopes, and winter thermal massing. We are keen to collaborate with Dovetail's Ladakh field practice.`
  },
  {
    id: 'pe_interiors',
    category: 'project_enquiry',
    label: 'Vernacular Interiors & Craft',
    icon: '🪵',
    params: {
      typology: 'Interiors & Spatial Craft',
      region: 'Shimla / Solan / Kasauli (H.P.)',
      condition: 'Existing stone / timber structure to restore',
      budget: '₹25 – 75 Lakh',
      timeline: 'Immediate (within 1 month)',
      area: 'Interior Residence / Loft'
    },
    generateDraft: (p) =>
      `We are seeking interior architecture services for our property in ${p.region}, focusing on reclaimed cedar timber joinery, chiseled slate hearths, custom lighting, and bespoke furniture crafted with regional Himalayan artisans.`
  },

  // --- GENERAL MESSAGE PRESETS ---
  {
    id: 'msg_consultation',
    category: 'message',
    label: 'Site Visit & Consultation',
    icon: '🏛️',
    params: { topic: 'Site Visit / Initial Consultation', studio: 'Palampur HQ (Main Studio, H.P.)' },
    generateDraft: (p) =>
      `We would like to request an initial site inspection and design consultation with Ar. Karan Sharma through the ${p.studio}. Please let us know the upcoming availability and consultation framework.`
  },
  {
    id: 'msg_studio_visit',
    category: 'message',
    label: 'Palampur HQ Studio Visit',
    icon: '📍',
    params: { topic: 'General Practice Information', studio: 'Palampur HQ (Main Studio, H.P.)' },
    generateDraft: (p) =>
      `I will be visiting Palampur and would love to visit Dovetail Architecture's main studio at Main Bazaar to explore your architectural drawings, material library, and discuss upcoming projects.`
  },
  {
    id: 'msg_heritage_advice',
    category: 'message',
    label: 'Heritage & Vernacular Advice',
    icon: '📜',
    params: { topic: 'Heritage Structure / Vernacular Advice', studio: 'Palampur HQ (Main Studio, H.P.)' },
    generateDraft: (p) =>
      `We seek technical guidance regarding vernacular Himalayan stone and timber preservation techniques, specifically passive seismic joinery and lime mortar formulations.`
  },
  {
    id: 'msg_material_sourcing',
    category: 'message',
    label: 'Stone, Slate & Timber Advice',
    icon: '🪵',
    params: { topic: 'Material, Slate & Stone Sourcing', studio: 'Palampur HQ (Main Studio, H.P.)' },
    generateDraft: () =>
      `We are seeking recommendations regarding local slate quarrying, sustainably harvested deodar timber joinery, and river-stone masonry for a mountain development.`
  },

  // --- RECRUITMENT PRESETS ---
  {
    id: 'rec_internship',
    category: 'recruitment',
    label: '6–12 Month Internship',
    icon: '🎓',
    params: {
      role: 'Architectural Intern (6–12 Months)',
      exp: 'Current B.Arch / M.Arch Student',
      start: 'Upcoming academic semester / internship cycle',
      studio: 'Palampur HQ (Main Studio, H.P.)'
    },
    generateDraft: (p) =>
      `I am writing to apply for a 6–12 month architectural internship at Dovetail Architecture (${p.studio}). As a ${p.exp}, I am deeply passionate about vernacular craft, high-altitude sustainability, and physical model making. My portfolio link is provided for your review.`
  },
  {
    id: 'rec_junior_arch',
    category: 'recruitment',
    label: 'Junior Architect (1–3 Yrs)',
    icon: '📐',
    params: {
      role: 'Junior Architect (1–3 Years)',
      exp: '1–3 Years Experience',
      start: 'Within 1 month notice period',
      studio: 'Palampur HQ (Main Studio, H.P.)'
    },
    generateDraft: (p) =>
      `I am applying for the Junior Architect position at Dovetail Architecture (${p.studio}). With ${p.exp} in architectural documentation, construction drawing sets, and site coordination, I am eager to contribute to your practice's Himalayan portfolio.`
  },
  {
    id: 'rec_ladakh_site',
    category: 'recruitment',
    label: 'Ladakh Site Architect',
    icon: '🏔️',
    params: {
      role: 'Site Architect & Construction Coordinator',
      exp: '3–5 Years Experience',
      start: 'Immediately (within 1–2 weeks)',
      studio: 'Ladakh Field Studio (Leh)'
    },
    generateDraft: (p) =>
      `I am applying for the Site Architect position with the ${p.studio}. I have experience coordinating high-altitude masonry works, vernacular earth construction, and on-site contractor management.`
  },

  // --- PARTNERSHIP PRESETS ---
  {
    id: 'part_artisan',
    category: 'partnership',
    label: 'Traditional Wood / Stone Artisan',
    icon: '🪵',
    params: {
      partType: 'Traditional Wood / Stone / Slate Artisan',
      partGeo: 'Himachal Pradesh',
      partOrg: 'Regional Craft Guild'
    },
    generateDraft: (p) =>
      `We are a team of traditional master craftsmen based in ${p.partGeo} specializing in ${p.partType.toLowerCase()}. We would love to explore collaborating with Dovetail Architecture on upcoming heritage and residential commissions.`
  },
  {
    id: 'part_structural',
    category: 'partnership',
    label: 'Structural Engineering Partner',
    icon: '🏗️',
    params: {
      partType: 'Structural & Civil Engineering Specialist',
      partGeo: 'Pan-Himalayan Region',
      partOrg: 'Alpine Structural Consultants'
    },
    generateDraft: (p) =>
      `Our engineering practice specializes in high-seismic timber-stone hybrid structures, micro-piling for steep mountain slopes, and finite element modeling for conservation projects. We would like to collaborate with Dovetail Architecture.`
  },

  // --- PRESS & ACADEMIC PRESETS ---
  {
    id: 'med_publish',
    category: 'media_academic',
    label: 'Feature Project in Publication',
    icon: '📰',
    params: {
      medType: 'Architectural Journal / Magazine',
      medIntent: 'Feature a Built Project',
      medOrg: 'Design Journal',
      medDate: 'Upcoming Issue'
    },
    generateDraft: (p) =>
      `On behalf of ${p.medOrg}, we would like to feature Dovetail Architecture's recent built work. We would like to request high-resolution project photography, architectural drawings, and an editorial project statement.`
  },
  {
    id: 'med_lecture',
    category: 'media_academic',
    label: 'University Guest Lecture',
    icon: '🎓',
    params: {
      medType: 'Architecture School / University',
      medIntent: 'Guest Lecture / Studio Review',
      medOrg: 'Department of Architecture',
      medDate: 'Spring Semester 2026'
    },
    generateDraft: (p) =>
      `We would be honored to invite Ar. Karan Sharma to deliver an invited guest lecture / seminar at ${p.medOrg} on Himalayan architectural conservation and contemporary vernacular design.`
  }
];

export const ContactForm: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<QueryCategory>('project_enquiry');
  const [activePresetId, setActivePresetId] = useState<string>('pe_mountain_residence');

  // Unified dynamic field state
  const [fields, setFields] = useState({
    // User info
    fullName: '',
    email: '',
    phone: '',
    location: '',
    contactMethod: 'email_primary',
    privacy: true,

    // Project enquiry params
    typology: 'Residential Mountain Home',
    region: 'Kangra Valley / Palampur / Dharamshala (H.P.)',
    condition: 'Vacant natural mountain slope',
    budget: '₹75 Lakh – 1.5 Cr',
    timeline: 'Within 3 months',
    area: '',

    // General message params
    msgTopic: 'Site Visit / Initial Consultation',
    msgStudio: 'Palampur HQ (Main Studio, H.P.)',

    // Recruitment params
    recRole: 'Architectural Intern (6–12 Months)',
    recExp: 'Current B.Arch / M.Arch Student',
    recStart: 'Upcoming academic semester / internship cycle',
    recStudio: 'Palampur HQ (Main Studio, H.P.)',
    recPortfolio: '',

    // Partnership params
    partType: 'Traditional Wood / Stone / Slate Artisan',
    partOrg: '',
    partGeo: 'Himachal Pradesh',
    partWeb: '',

    // Media params
    medType: 'Architectural Journal / Magazine',
    medIntent: 'Feature a Built Project',
    medOrg: '',
    medDate: ''
  });

  const [message, setMessage] = useState('');
  const [isManualEdit, setIsManualEdit] = useState(false);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [refNumber, setRefNumber] = useState('');

  // Synthesize dynamic architectural brief from parameters
  const generateMessageFromState = useCallback(
    (cat: QueryCategory, currentFields: typeof fields) => {
      if (cat === 'project_enquiry') {
        const parts: string[] = [];
        parts.push(
          `We are planning a ${currentFields.typology} in ${currentFields.region}${currentFields.location ? ` (${currentFields.location})` : ''}.`
        );
        parts.push(
          `Site condition: ${currentFields.condition.toLowerCase()}${currentFields.area ? `, approximate area: ${currentFields.area}` : ''}.`
        );
        parts.push(
          `Planned budget range: ${currentFields.budget}. Target commencement: ${currentFields.timeline.toLowerCase()}.`
        );
        parts.push(
          `We would like to discuss design services, vernacular materiality, and project scope with Dovetail Architecture.`
        );
        return parts.join(' ');
      }

      if (cat === 'message') {
        return `Regarding "${currentFields.msgTopic}" directed to the ${currentFields.msgStudio}: We would like to inquire about your architectural practice, site consultation process, and availability for an upcoming project discussion.`;
      }

      if (cat === 'recruitment') {
        return `I am applying for the position of "${currentFields.recRole}" (${currentFields.recStudio}). Experience level: ${currentFields.recExp}. Earliest availability: ${currentFields.recStart.toLowerCase()}.${currentFields.recPortfolio ? ` Portfolio link: ${currentFields.recPortfolio}.` : ''} I look forward to contributing to Dovetail Architecture's Himalayan practice.`;
      }

      if (cat === 'partnership') {
        return `We are reaching out regarding collaboration in the domain of "${currentFields.partType}"${currentFields.partOrg ? ` from ${currentFields.partOrg}` : ''} based in ${currentFields.partGeo}.${currentFields.partWeb ? ` Website: ${currentFields.partWeb}.` : ''} We would welcome exploring synergetic opportunities on Himalayan projects.`;
      }

      if (cat === 'media_academic') {
        return `Nature of request: ${currentFields.medIntent} for ${currentFields.medType}${currentFields.medOrg ? ` (${currentFields.medOrg})` : ''}.${currentFields.medDate ? ` Target date: ${currentFields.medDate}.` : ''} We would be honored to feature Dovetail Architecture's work or host Ar. Karan Sharma.`;
      }

      return '';
    },
    []
  );

  // Initialize initial message on mount
  useEffect(() => {
    const initialPreset = PRESETS.find((p) => p.id === 'pe_mountain_residence');
    if (initialPreset) {
      setMessage(initialPreset.generateDraft(initialPreset.params, { name: '', location: '' }));
    }
  }, []);

  // Handle Preset Click
  const handlePresetClick = (preset: Preset) => {
    setActiveCategory(preset.category);
    setActivePresetId(preset.id);
    setIsManualEdit(false);

    // Update relevant fields
    const updated = { ...fields };
    if (preset.category === 'project_enquiry') {
      if (preset.params.typology) updated.typology = preset.params.typology;
      if (preset.params.region) updated.region = preset.params.region;
      if (preset.params.condition) updated.condition = preset.params.condition;
      if (preset.params.budget) updated.budget = preset.params.budget;
      if (preset.params.timeline) updated.timeline = preset.params.timeline;
      if (preset.params.area) updated.area = preset.params.area;
    } else if (preset.category === 'message') {
      if (preset.params.topic) updated.msgTopic = preset.params.topic;
      if (preset.params.studio) updated.msgStudio = preset.params.studio;
    } else if (preset.category === 'recruitment') {
      if (preset.params.role) updated.recRole = preset.params.role;
      if (preset.params.exp) updated.recExp = preset.params.exp;
      if (preset.params.start) updated.recStart = preset.params.start;
      if (preset.params.studio) updated.recStudio = preset.params.studio;
    } else if (preset.category === 'partnership') {
      if (preset.params.partType) updated.partType = preset.params.partType;
      if (preset.params.partGeo) updated.partGeo = preset.params.partGeo;
      if (preset.params.partOrg) updated.partOrg = preset.params.partOrg;
    } else if (preset.category === 'media_academic') {
      if (preset.params.medType) updated.medType = preset.params.medType;
      if (preset.params.medIntent) updated.medIntent = preset.params.medIntent;
      if (preset.params.medOrg) updated.medOrg = preset.params.medOrg;
      if (preset.params.medDate) updated.medDate = preset.params.medDate;
    }

    setFields(updated);
    const draft = preset.generateDraft(preset.params, { name: updated.fullName, location: updated.location });
    setMessage(draft);
  };

  // Handle Category Tab Switch
  const handleCategorySwitch = (cat: QueryCategory) => {
    setActiveCategory(cat);
    // Find first preset of this category
    const firstPreset = PRESETS.find((p) => p.category === cat);
    if (firstPreset) {
      handlePresetClick(firstPreset);
    } else {
      setActivePresetId('');
      if (!isManualEdit) {
        setMessage(generateMessageFromState(cat, fields));
      }
    }
  };

  // Update field and auto-update message if not manually edited
  const updateField = (key: keyof typeof fields, val: string | boolean) => {
    const next = { ...fields, [key]: val };
    setFields(next);

    if (!isManualEdit && typeof val === 'string') {
      setMessage(generateMessageFromState(activeCategory, next));
    }
  };

  // Force regenerate draft
  const handleRegenerateDraft = () => {
    setIsManualEdit(false);
    setMessage(generateMessageFromState(activeCategory, fields));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');

    const generatedRef = `DOV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    setRefNumber(generatedRef);

    const activeCatInfo = CATEGORY_TABS.find((t) => t.key === activeCategory);
    const serviceType = `${activeCatInfo?.label || 'Project Enquiry'} — ${
      activeCategory === 'project_enquiry' ? fields.typology : fields.msgTopic || 'General Brief'
    }`;

    try {
      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: fields.fullName,
          email: fields.email,
          phone: fields.phone,
          location: fields.location || (activeCategory === 'project_enquiry' ? fields.region : undefined),
          serviceType,
          message: `${message}\n\n[Submission Ref: ${generatedRef}] [Contact Preference: ${fields.contactMethod}]`
        })
      });

      if (!res.ok) throw new Error('Submission failed');

      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  const activeCatInfo = CATEGORY_TABS.find((t) => t.key === activeCategory);
  const currentCategoryPresets = PRESETS.filter((p) => p.category === activeCategory);

  return (
    <div className="enquiry-form-wrap" style={{ width: '100%' }}>
      {/* Category Selection Tabs */}
      <div className="query-type-tabs" role="tablist" aria-label="Select query type">
        {CATEGORY_TABS.map((tab) => {
          const isActive = activeCategory === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              className={`query-tab-btn ${isActive ? 'is-active' : ''}`}
              onClick={() => handleCategorySwitch(tab.key)}
              role="tab"
              aria-selected={isActive}
            >
              <span className="qtab-icon" aria-hidden="true">{tab.icon}</span>
              <span className="qtab-text">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Dynamic Fast Presets Bar (One-Click Auto Templates) */}
      <div className="quick-preset-bar" aria-label="Pre-filled query suggestions">
        <div className="preset-header">
          <span className="preset-label">FAST TEMPLATES:</span>
          <span className="preset-cat-tag">
            {activeCatInfo?.label.toUpperCase()}
          </span>
        </div>

        <div className="preset-group is-active" style={{ display: 'flex' }}>
          {currentCategoryPresets.map((preset) => {
            const isSelected = activePresetId === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                className={`preset-chip ${isSelected ? 'is-active-chip' : ''}`}
                onClick={() => handlePresetClick(preset)}
                title={`Auto-fill brief for ${preset.label}`}
              >
                <span>{preset.icon}</span> {preset.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* FORM */}
      <form className="contact-form" onSubmit={handleSubmit} noValidate>
        {/* Dynamic Branch Sub-sections */}
        <div className="query-subsections-container">
          {/* BRANCH: PROJECT ENQUIRY */}
          {activeCategory === 'project_enquiry' && (
            <div className="query-branch is-active">
              <div className="branch-indicator">
                <span className="branch-indicator-dot" style={{ background: '#43A047' }} />
                <span className="branch-indicator-label">PROJECT COMMISSION PARAMETERS</span>
              </div>

              <div className="form-row form-row--two">
                <div className="form-group">
                  <label className="form-label" htmlFor="pe-typology">Project Typology *</label>
                  <select
                    className="form-input form-select"
                    id="pe-typology"
                    value={fields.typology}
                    onChange={(e) => updateField('typology', e.target.value)}
                  >
                    <option value="Residential Mountain Home">Residential Mountain Home</option>
                    <option value="Architectural Conservation / Heritage">Architectural Conservation / Heritage</option>
                    <option value="Hospitality / Eco-Retreat">Hospitality / Eco-Retreat</option>
                    <option value="Interiors & Spatial Craft">Interiors & Spatial Craft</option>
                    <option value="Public & Community Architecture">Public & Community Architecture</option>
                    <option value="Landscape & Master Planning">Landscape & Master Planning</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="pe-region">Site Region / Geography *</label>
                  <select
                    className="form-input form-select"
                    id="pe-region"
                    value={fields.region}
                    onChange={(e) => updateField('region', e.target.value)}
                  >
                    <option value="Kangra Valley / Palampur / Dharamshala (H.P.)">Kangra Valley / Palampur / Dharamshala (H.P.)</option>
                    <option value="Shimla / Solan / Kasauli (H.P.)">Shimla / Solan / Kasauli (H.P.)</option>
                    <option value="Kullu / Manali / Tirthan (H.P.)">Kullu / Manali / Tirthan (H.P.)</option>
                    <option value="Ladakh / Upper Indus / High Altitude">Ladakh / Upper Indus / High Altitude</option>
                    <option value="Garhwal / Kumaon (Uttarakhand)">Garhwal / Kumaon (Uttarakhand)</option>
                    <option value="Nepal / Central Himalayas">Nepal / Central Himalayas</option>
                    <option value="Chandigarh / Plains Region">Chandigarh / Plains Region</option>
                    <option value="Other Mountainous Region">Other Mountainous Region</option>
                  </select>
                </div>
              </div>

              <div className="form-row form-row--two">
                <div className="form-group">
                  <label className="form-label" htmlFor="pe-condition">Site Condition / Existing Fabric</label>
                  <select
                    className="form-input form-select"
                    id="pe-condition"
                    value={fields.condition}
                    onChange={(e) => updateField('condition', e.target.value)}
                  >
                    <option value="Vacant natural mountain slope">Vacant natural mountain slope</option>
                    <option value="Existing stone / timber structure to restore">Existing stone / timber structure to restore</option>
                    <option value="Ancestral kath-kuni / colonial building">Ancestral kath-kuni / colonial building</option>
                    <option value="Sanctioned / approved plot">Sanctioned / approved plot</option>
                    <option value="Currently exploring land acquisition">Currently exploring land acquisition</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="pe-budget">Estimated Budget Range</label>
                  <select
                    className="form-input form-select"
                    id="pe-budget"
                    value={fields.budget}
                    onChange={(e) => updateField('budget', e.target.value)}
                  >
                    <option value="₹25 – 75 Lakh">₹25 – 75 Lakh</option>
                    <option value="₹75 Lakh – 1.5 Cr">₹75 Lakh – 1.5 Cr</option>
                    <option value="₹1.5 Cr – 5 Cr">₹1.5 Cr – 5 Cr</option>
                    <option value="Above ₹5 Cr">Above ₹5 Cr</option>
                    <option value="Under ₹25 Lakh">Under ₹25 Lakh</option>
                    <option value="To be determined / discussed">To be determined / discussed</option>
                  </select>
                </div>
              </div>

              <div className="form-row form-row--two">
                <div className="form-group">
                  <label className="form-label" htmlFor="pe-timeline">Anticipated Construction Timeline</label>
                  <select
                    className="form-input form-select"
                    id="pe-timeline"
                    value={fields.timeline}
                    onChange={(e) => updateField('timeline', e.target.value)}
                  >
                    <option value="Immediate (within 1 month)">Immediate (within 1 month)</option>
                    <option value="Within 3 months">Within 3 months</option>
                    <option value="Within 6 months">Within 6 months</option>
                    <option value="1+ year / Long-term planning">1+ year / Long-term planning</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="pe-area">Approx. Plot or Built Area</label>
                  <input
                    className="form-input"
                    id="pe-area"
                    type="text"
                    placeholder="e.g. 2 Kanals / 4,000 sq ft"
                    value={fields.area}
                    onChange={(e) => updateField('area', e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* BRANCH: GENERAL MESSAGE */}
          {activeCategory === 'message' && (
            <div className="query-branch is-active">
              <div className="branch-indicator">
                <span className="branch-indicator-dot" style={{ background: '#8E24AA' }} />
                <span className="branch-indicator-label">GENERAL STUDIO INQUIRY &amp; CONSULTATION</span>
              </div>

              <div className="form-row form-row--two">
                <div className="form-group">
                  <label className="form-label" htmlFor="msg-topic">Query Topic *</label>
                  <select
                    className="form-input form-select"
                    id="msg-topic"
                    value={fields.msgTopic}
                    onChange={(e) => updateField('msgTopic', e.target.value)}
                  >
                    <option value="Site Visit / Initial Consultation">Site Visit / Initial Consultation</option>
                    <option value="Heritage Structure / Vernacular Advice">Heritage Structure / Vernacular Advice</option>
                    <option value="General Practice Information">General Practice Information</option>
                    <option value="Material, Slate & Stone Sourcing">Material, Slate & Stone Sourcing</option>
                    <option value="Other Direct Inquiry">Other Direct Inquiry</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="msg-studio">Studio to Contact</label>
                  <select
                    className="form-input form-select"
                    id="msg-studio"
                    value={fields.msgStudio}
                    onChange={(e) => updateField('msgStudio', e.target.value)}
                  >
                    <option value="Palampur HQ (Main Studio, H.P.)">Palampur HQ (Main Studio, H.P.)</option>
                    <option value="Ladakh Studio (Leh)">Ladakh Studio (Leh)</option>
                    <option value="Chandigarh Studio">Chandigarh Studio</option>
                    <option value="Kathmandu Studio">Kathmandu Studio</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* BRANCH: RECRUITMENT */}
          {activeCategory === 'recruitment' && (
            <div className="query-branch is-active">
              <div className="branch-indicator">
                <span className="branch-indicator-dot" style={{ background: '#1E88E5' }} />
                <span className="branch-indicator-label">CAREER &amp; INTERNSHIP APPLICATION DETAILS</span>
              </div>

              <div className="form-row form-row--two">
                <div className="form-group">
                  <label className="form-label" htmlFor="rec-role">Position Applied For *</label>
                  <select
                    className="form-input form-select"
                    id="rec-role"
                    value={fields.recRole}
                    onChange={(e) => updateField('recRole', e.target.value)}
                  >
                    <option value="Architectural Intern (6–12 Months)">Architectural Intern (6–12 Months)</option>
                    <option value="Junior Architect (1–3 Years)">Junior Architect (1–3 Years)</option>
                    <option value="Project Architect / Lead (3–5+ Years)">Project Architect / Lead (3–5+ Years)</option>
                    <option value="Conservation Architect / Specialist">Conservation Architect / Specialist</option>
                    <option value="Site Architect & Construction Coordinator">Site Architect & Construction Coordinator</option>
                    <option value="3D Visualizer & Physical Model Maker">3D Visualizer & Physical Model Maker</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="rec-exp">Your Experience Level *</label>
                  <select
                    className="form-input form-select"
                    id="rec-exp"
                    value={fields.recExp}
                    onChange={(e) => updateField('recExp', e.target.value)}
                  >
                    <option value="Current B.Arch / M.Arch Student">Current B.Arch / M.Arch Student</option>
                    <option value="Recent Architecture Graduate (0–1 yr)">Recent Architecture Graduate (0–1 yr)</option>
                    <option value="1–3 Years Experience">1–3 Years Experience</option>
                    <option value="3–5 Years Experience">3–5 Years Experience</option>
                    <option value="5+ Years Senior Experience">5+ Years Senior Experience</option>
                  </select>
                </div>
              </div>

              <div className="form-row form-row--two">
                <div className="form-group">
                  <label className="form-label" htmlFor="rec-start">Earliest Start Date / Availability *</label>
                  <select
                    className="form-input form-select"
                    id="rec-start"
                    value={fields.recStart}
                    onChange={(e) => updateField('recStart', e.target.value)}
                  >
                    <option value="Immediately (within 1–2 weeks)">Immediately (within 1–2 weeks)</option>
                    <option value="Within 1 month notice period">Within 1 month notice period</option>
                    <option value="Upcoming academic semester / internship cycle">Upcoming academic semester / internship cycle</option>
                    <option value="Flexible / Negotiable">Flexible / Negotiable</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="rec-studio">Preferred Studio Location</label>
                  <select
                    className="form-input form-select"
                    id="rec-studio"
                    value={fields.recStudio}
                    onChange={(e) => updateField('recStudio', e.target.value)}
                  >
                    <option value="Palampur HQ (Main Studio, H.P.)">Palampur HQ (Main Studio, H.P.)</option>
                    <option value="Ladakh Field Studio (Leh)">Ladakh Field Studio (Leh)</option>
                    <option value="Open to any studio location">Open to any studio location</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="rec-portfolio">Portfolio &amp; CV Link (Google Drive / ISSUU / Notion / Behance URL) *</label>
                  <input
                    className="form-input"
                    id="rec-portfolio"
                    type="url"
                    placeholder="https://drive.google.com/... or https://issuu.com/..."
                    value={fields.recPortfolio}
                    onChange={(e) => updateField('recPortfolio', e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* BRANCH: PARTNERSHIP */}
          {activeCategory === 'partnership' && (
            <div className="query-branch is-active">
              <div className="branch-indicator">
                <span className="branch-indicator-dot" style={{ background: '#FB8C00' }} />
                <span className="branch-indicator-label">COLLABORATION &amp; CRAFT PARTNERSHIP</span>
              </div>

              <div className="form-row form-row--two">
                <div className="form-group">
                  <label className="form-label" htmlFor="part-type">Partnership Domain *</label>
                  <select
                    className="form-input form-select"
                    id="part-type"
                    value={fields.partType}
                    onChange={(e) => updateField('partType', e.target.value)}
                  >
                    <option value="Traditional Wood / Stone / Slate Artisan">Traditional Wood / Stone / Slate Artisan</option>
                    <option value="Structural & Civil Engineering Specialist">Structural & Civil Engineering Specialist</option>
                    <option value="Native Landscape & Himalayan Flora Consultant">Native Landscape & Himalayan Flora Consultant</option>
                    <option value="Sustainable / Off-Grid Energy & Water Systems">Sustainable / Off-Grid Energy & Water Systems</option>
                    <option value="Vernacular Building Material Manufacturer">Vernacular Building Material Manufacturer</option>
                    <option value="Research & Academic Institution">Research & Academic Institution</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="part-org">Organization / Craft Workshop Name *</label>
                  <input
                    className="form-input"
                    id="part-org"
                    type="text"
                    placeholder="e.g. Kangra Slate Guild / Alpine Woodcraft"
                    value={fields.partOrg}
                    onChange={(e) => updateField('partOrg', e.target.value)}
                  />
                </div>
              </div>

              <div className="form-row form-row--two">
                <div className="form-group">
                  <label className="form-label" htmlFor="part-geo">Operational Base / Region</label>
                  <select
                    className="form-input form-select"
                    id="part-geo"
                    value={fields.partGeo}
                    onChange={(e) => updateField('partGeo', e.target.value)}
                  >
                    <option value="Himachal Pradesh">Himachal Pradesh</option>
                    <option value="Ladakh">Ladakh</option>
                    <option value="Uttarakhand">Uttarakhand</option>
                    <option value="Pan-Himalayan Region">Pan-Himalayan Region</option>
                    <option value="Nationwide / Pan-India">Nationwide / Pan-India</option>
                    <option value="International">International</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="part-web">Website / Portfolio / Catalogue (URL)</label>
                  <input
                    className="form-input"
                    id="part-web"
                    type="url"
                    placeholder="https://..."
                    value={fields.partWeb}
                    onChange={(e) => updateField('partWeb', e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* BRANCH: PRESS / ACADEMIC */}
          {activeCategory === 'media_academic' && (
            <div className="query-branch is-active">
              <div className="branch-indicator">
                <span className="branch-indicator-dot" style={{ background: '#FBC02D' }} />
                <span className="branch-indicator-label">PRESS, PUBLICATION &amp; ACADEMIC LECTURE</span>
              </div>

              <div className="form-row form-row--two">
                <div className="form-group">
                  <label className="form-label" htmlFor="med-type">Media / Institution Type *</label>
                  <select
                    className="form-input form-select"
                    id="med-type"
                    value={fields.medType}
                    onChange={(e) => updateField('medType', e.target.value)}
                  >
                    <option value="Architectural Journal / Magazine">Architectural Journal / Magazine</option>
                    <option value="Architecture School / University">Architecture School / University</option>
                    <option value="Digital Media / Podcast">Digital Media / Podcast</option>
                    <option value="Design Conference / Biennial">Design Conference / Biennial</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="med-intent">Nature of Request *</label>
                  <select
                    className="form-input form-select"
                    id="med-intent"
                    value={fields.medIntent}
                    onChange={(e) => updateField('medIntent', e.target.value)}
                  >
                    <option value="Feature a Built Project">Feature a Built Project</option>
                    <option value="Interview with Ar. Karan Sharma">Interview with Ar. Karan Sharma</option>
                    <option value="Guest Lecture / Studio Review">Guest Lecture / Studio Review</option>
                    <option value="Research Collaboration">Research Collaboration</option>
                  </select>
                </div>
              </div>

              <div className="form-row form-row--two">
                <div className="form-group">
                  <label className="form-label" htmlFor="med-org">Publication / University Name *</label>
                  <input
                    className="form-input"
                    id="med-org"
                    type="text"
                    placeholder="e.g. Architectural Digest / CEPT / SPA"
                    value={fields.medOrg}
                    onChange={(e) => updateField('medOrg', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="med-date">Target Date / Publishing Deadline</label>
                  <input
                    className="form-input"
                    id="med-date"
                    type="text"
                    placeholder="e.g. October 2026 / Spring Semester"
                    value={fields.medDate}
                    onChange={(e) => updateField('medDate', e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* AUTO PRE-FILLED MESSAGE AREA */}
        <div className="form-row">
          <div className="form-group" style={{ width: '100%' }}>
            <div className="message-label-row">
              <label className="form-label" htmlFor="contact-message">
                Your Message / Brief *
              </label>
              <button
                type="button"
                className="btn-refresh-draft"
                onClick={handleRegenerateDraft}
                title="Regenerate pre-filled query brief from selections"
              >
                ✨ Auto-Draft Message
              </button>
            </div>
            <textarea
              className="form-input form-textarea"
              id="contact-message"
              rows={5}
              required
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                setIsManualEdit(true);
              }}
              placeholder="Select your options above — your message will automatically formulate here, or you can write freely…"
            />
          </div>
        </div>

        {/* CONTACT DETAILS: NAME, EMAIL, PHONE, METHOD */}
        <div className="form-row form-row--two">
          <div className="form-group">
            <label className="form-label" htmlFor="contact-name">Full Name *</label>
            <input
              className="form-input"
              id="contact-name"
              type="text"
              required
              placeholder="Your full name"
              value={fields.fullName}
              onChange={(e) => updateField('fullName', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="contact-email">
              Email Address * <span className="label-hint">(Response sent here)</span>
            </label>
            <input
              className="form-input"
              id="contact-email"
              type="email"
              required
              placeholder="name@domain.com"
              value={fields.email}
              onChange={(e) => updateField('email', e.target.value)}
            />
          </div>
        </div>

        <div className="form-row form-row--two">
          <div className="form-group">
            <label className="form-label" htmlFor="contact-phone">
              Mobile / WhatsApp <span className="label-hint">(Optional)</span>
            </label>
            <input
              className="form-input"
              id="contact-phone"
              type="tel"
              placeholder="+91 98000 00000 (Optional)"
              value={fields.phone}
              onChange={(e) => updateField('phone', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="contact-pref">Preferred Contact Method</label>
            <select
              className="form-input form-select"
              id="contact-pref"
              value={fields.contactMethod}
              onChange={(e) => updateField('contactMethod', e.target.value)}
            >
              <option value="email_primary">Email (Primary response to your inbox)</option>
              <option value="whatsapp">WhatsApp / Phone Call (if provided)</option>
              <option value="studio_meeting">In-Person Studio Meeting (Palampur HQ)</option>
            </select>
          </div>
        </div>

        {/* Privacy Checkbox */}
        <div className="form-row">
          <div className="form-group form-group--check">
            <label className="form-check-label">
              <input
                type="checkbox"
                className="form-checkbox"
                checked={fields.privacy}
                onChange={(e) => updateField('privacy', e.target.checked)}
                required
              />
              <span>
                I agree that Dovetail Architecture may use this information to respond directly to my query via email / phone.
              </span>
            </label>
          </div>
        </div>

        {/* Submit Button & Meta */}
        <div className="form-submit-row">
          <button
            type="submit"
            className={`form-submit-btn ${status === 'submitting' ? 'is-loading' : ''}`}
            disabled={status === 'submitting'}
          >
            <span className="submit-text">
              {status === 'submitting' ? 'DISPATCHING BRIEF...' : 'SUBMIT QUERY'}
            </span>
            <span className="submit-arrow">&rarr;</span>
            <span className="submit-spinner" aria-hidden="true" />
          </button>

          <div className="form-submit-meta">
            <span className="meta-tag-highlight">✓ Confirmation logged immediately</span>
            <span className="meta-tag-sub">We personally review all submissions and respond within 2 working days</span>
          </div>
        </div>

        {/* Success state */}
        {status === 'success' && (
          <div className="form-success is-visible" aria-live="polite" style={{ marginTop: '20px' }}>
            <div className="form-success-icon">&#10003;</div>
            <div className="form-success-content">
              <div className="form-success-title">Query Dispatched Successfully</div>
              <div className="form-success-msg">
                Thank you, <strong>{fields.fullName || 'there'}</strong>. Your brief has been received and logged (Ref: <strong>{refNumber}</strong>). Ar. Karan Sharma and our studio team will review your parameters and reply to <strong>{fields.email}</strong> within 2 working days.
              </div>
              <div className="form-success-meta">
                CATEGORY: {activeCatInfo?.label.toUpperCase()} · METHOD: {fields.contactMethod.toUpperCase()}
              </div>
            </div>
          </div>
        )}

        {/* Error state */}
        {status === 'error' && (
          <div className="form-error is-visible" aria-live="polite" style={{ marginTop: '20px' }}>
            <span>Please verify all required fields (Name, Email, Message) or reach out directly at Studio@dovetailarchitecture.in / +91 80914 88858.</span>
          </div>
        )}
      </form>
    </div>
  );
};
