import React from 'react';
import type { Metadata } from 'next';
import { getAllProjects } from '@/lib/data/projects';
import { ProjectsClient } from '@/components/projects/ProjectsClient';

export const metadata: Metadata = {
  title: 'Selected Works — Dovetail Architecture',
  description: 'Exploration of Himalayan conservation, residential, interior and public architecture projects by Dovetail Architecture.',
};

export default async function ProjectsPage() {
  const projects = await getAllProjects();

  return <ProjectsClient initialProjects={projects} />;
}
