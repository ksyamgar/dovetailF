'use client';

import React, { useState } from 'react';
import { INITIAL_PROJECTS } from '@/lib/data/projects';
import { Project } from '@/types/project';

export default function AdminPage() {
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [activeTab, setActiveTab] = useState<'projects' | 'inquiries' | 'settings'>('projects');
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const togglePublish = (id: string) => {
    setProjects(prev =>
      prev.map(p => (p.id === id ? { ...p, published: !p.published } : p))
    );
  };

  const toggleFeatured = (id: string) => {
    setProjects(prev =>
      prev.map(p => (p.id === id ? { ...p, featured: !p.featured } : p))
    );
  };

  return (
    <div style={{ maxWidth: '1440px', margin: '100px auto 80px', padding: '0 48px' }}>
      <header style={{ borderBottom: '1px solid var(--line)', paddingBottom: '24px', marginBottom: '36px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ fontFamily: 'var(--mono)', fontSize: '10px', letterSpacing: '0.14em', color: 'var(--muted)' }}>
            STUDIO CONTENT MANAGEMENT SYSTEM
          </span>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: '40px', margin: '4px 0 0' }}>
            Dovetail Admin Portal
          </h1>
        </div>

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setActiveTab('projects')}
            style={{
              padding: '8px 16px',
              fontFamily: 'var(--mono)',
              fontSize: '11px',
              border: '1px solid var(--line)',
              backgroundColor: activeTab === 'projects' ? 'var(--ink)' : 'transparent',
              color: activeTab === 'projects' ? '#fff' : 'var(--ink)'
            }}
          >
            PROJECTS ({projects.length})
          </button>
          <button
            onClick={() => setActiveTab('inquiries')}
            style={{
              padding: '8px 16px',
              fontFamily: 'var(--mono)',
              fontSize: '11px',
              border: '1px solid var(--line)',
              backgroundColor: activeTab === 'inquiries' ? 'var(--ink)' : 'transparent',
              color: activeTab === 'inquiries' ? '#fff' : 'var(--ink)'
            }}
          >
            INQUIRIES
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            style={{
              padding: '8px 16px',
              fontFamily: 'var(--mono)',
              fontSize: '11px',
              border: '1px solid var(--line)',
              backgroundColor: activeTab === 'settings' ? 'var(--ink)' : 'transparent',
              color: activeTab === 'settings' ? '#fff' : 'var(--ink)'
            }}
          >
            SETTINGS
          </button>
        </div>
      </header>

      {/* TAB: PROJECTS */}
      {activeTab === 'projects' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontFamily: 'var(--mono)', fontSize: '12px', letterSpacing: '0.12em', color: 'var(--muted)' }}>
              MANAGE ARCHITECTURAL PROJECTS
            </h2>
            <button
              onClick={() => {
                const newP: Project = {
                  id: `new-project-${Date.now()}`,
                  slug: `new-project-${Date.now()}`,
                  name: 'Untitled Project',
                  type: 'Architecture',
                  category: 'Residential',
                  color: '#2c5f8a',
                  year: new Date().getFullYear().toString(),
                  location: 'Palampur, Kangra, H.P.',
                  lat: 32.1196,
                  lng: 76.5399,
                  alt: '1,312 m',
                  lead: 'A new architectural exploration...',
                  description: 'Detailed description...',
                  heroImage: '/projects/shey-palace/west-facade-of-the-palace.webp',
                  images: [],
                  published: true
                };
                setProjects([newP, ...projects]);
                setEditingProject(newP);
              }}
              className="hero-statement-cta"
              style={{ padding: '8px 16px', fontSize: '11px' }}
            >
              + NEW PROJECT
            </button>
          </div>

          <div style={{ border: '1px solid var(--line)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontFamily: 'var(--mono)', fontSize: '11px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--line)', backgroundColor: '#faf9f5' }}>
                  <th style={{ padding: '12px 16px' }}>NAME</th>
                  <th style={{ padding: '12px 16px' }}>CATEGORY</th>
                  <th style={{ padding: '12px 16px' }}>LOCATION</th>
                  <th style={{ padding: '12px 16px' }}>COORDINATES</th>
                  <th style={{ padding: '12px 16px' }}>FEATURED</th>
                  <th style={{ padding: '12px 16px' }}>STATUS</th>
                  <th style={{ padding: '12px 16px' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((p) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid var(--line)' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 500 }}>{p.name}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ color: p.color }}>● {p.category}</span>
                    </td>
                    <td style={{ padding: '12px 16px', color: '#555' }}>{p.location}</td>
                    <td style={{ padding: '12px 16px', color: 'var(--muted)' }}>
                      {p.lat.toFixed(3)}°N, {p.lng.toFixed(3)}°E
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <button
                        onClick={() => toggleFeatured(p.id)}
                        style={{ textDecoration: 'underline', color: p.featured ? '#2e7d32' : 'var(--muted)' }}
                      >
                        {p.featured ? 'FEATURED' : 'STANDARD'}
                      </button>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <button
                        onClick={() => togglePublish(p.id)}
                        style={{
                          padding: '4px 8px',
                          backgroundColor: p.published ? '#e8f5e9' : '#ffebee',
                          color: p.published ? '#2e7d32' : '#c62828'
                        }}
                      >
                        {p.published ? 'PUBLISHED' : 'DRAFT'}
                      </button>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <button
                        onClick={() => setEditingProject(p)}
                        style={{ textDecoration: 'underline', marginRight: '12px' }}
                      >
                        EDIT
                      </button>
                      <button
                        onClick={() => setProjects(projects.filter(item => item.id !== p.id))}
                        style={{ color: '#c62828', textDecoration: 'underline' }}
                      >
                        DELETE
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL / DRAWER FOR EDITING */}
      {editingProject && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'flex-end', zIndex: 10000 }}>
          <div style={{ width: '600px', height: '100%', backgroundColor: '#fff', padding: '40px', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontFamily: 'var(--serif)', fontSize: '28px' }}>Edit Project</h2>
              <button onClick={() => setEditingProject(null)} style={{ fontFamily: 'var(--mono)', fontSize: '11px' }}>
                CLOSE ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontFamily: 'var(--mono)', fontSize: '11px' }}>
              <div>
                <label style={{ display: 'block', color: 'var(--muted)', marginBottom: '4px' }}>PROJECT NAME</label>
                <input
                  type="text"
                  value={editingProject.name}
                  onChange={(e) => setEditingProject({ ...editingProject, name: e.target.value })}
                  style={{ width: '100%', padding: '10px', border: '1px solid var(--line)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', color: 'var(--muted)', marginBottom: '4px' }}>URL SLUG</label>
                <input
                  type="text"
                  value={editingProject.slug}
                  onChange={(e) => setEditingProject({ ...editingProject, slug: e.target.value })}
                  style={{ width: '100%', padding: '10px', border: '1px solid var(--line)' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', color: 'var(--muted)', marginBottom: '4px' }}>LATITUDE</label>
                  <input
                    type="number"
                    step="any"
                    value={editingProject.lat}
                    onChange={(e) => setEditingProject({ ...editingProject, lat: parseFloat(e.target.value) || 0 })}
                    style={{ width: '100%', padding: '10px', border: '1px solid var(--line)' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', color: 'var(--muted)', marginBottom: '4px' }}>LONGITUDE</label>
                  <input
                    type="number"
                    step="any"
                    value={editingProject.lng}
                    onChange={(e) => setEditingProject({ ...editingProject, lng: parseFloat(e.target.value) || 0 })}
                    style={{ width: '100%', padding: '10px', border: '1px solid var(--line)' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', color: 'var(--muted)', marginBottom: '4px' }}>LEAD QUOTE</label>
                <textarea
                  rows={3}
                  value={editingProject.lead}
                  onChange={(e) => setEditingProject({ ...editingProject, lead: e.target.value })}
                  style={{ width: '100%', padding: '10px', border: '1px solid var(--line)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', color: 'var(--muted)', marginBottom: '4px' }}>FULL DESCRIPTION</label>
                <textarea
                  rows={6}
                  value={editingProject.description}
                  onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                  style={{ width: '100%', padding: '10px', border: '1px solid var(--line)' }}
                />
              </div>

              <button
                onClick={() => {
                  setProjects(projects.map(p => (p.id === editingProject.id ? editingProject : p)));
                  setEditingProject(null);
                }}
                className="hero-statement-cta"
                style={{ width: '100%', justifyContent: 'center', padding: '12px', marginTop: '12px' }}
              >
                SAVE CHANGES
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
