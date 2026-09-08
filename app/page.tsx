import React from 'react';
import { getAllProjects } from '@/lib/data/projects';
import { HomePageClient } from '@/components/home/HomePageClient';

export const revalidate = 60;

export default async function HomePage() {
  const projects = await getAllProjects();

  return <HomePageClient projects={projects} />;
}
