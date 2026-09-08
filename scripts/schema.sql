-- Dovetail Architecture Database Schema for Supabase (PostgreSQL + PostGIS)

CREATE EXTENSION IF NOT EXISTS postgis;

-- 1. Project Categories
CREATE TABLE IF NOT EXISTS project_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  color TEXT NOT NULL,
  sort_order INT DEFAULT 0
);

INSERT INTO project_categories (id, name, color, sort_order) VALUES
  ('conservation', 'Conservation', '#43A047', 1),
  ('residential', 'Residential', '#FBC02D', 2),
  ('hospitality', 'Hospitality', '#E53935', 3),
  ('interiors', 'Interiors', '#8E24AA', 4),
  ('planning', 'Planning', '#FB8C00', 5),
  ('public', 'Public', '#2d6a4f', 6)
ON CONFLICT (id) DO NOTHING;

-- 2. Projects Table
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  category_id TEXT REFERENCES project_categories(id),
  color TEXT,
  year TEXT NOT NULL,
  location TEXT NOT NULL,
  city TEXT,
  state TEXT,
  country TEXT DEFAULT 'India',
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  geom GEOMETRY(Point, 4326),
  alt TEXT,
  site_area TEXT,
  structure TEXT,
  lead TEXT NOT NULL,
  description TEXT NOT NULL,
  hero_image TEXT NOT NULL,
  model_3d_url TEXT,
  featured BOOLEAN DEFAULT FALSE,
  published BOOLEAN DEFAULT TRUE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_projects_geom ON projects USING GIST (geom);

-- 3. Inquiries Table
CREATE TABLE IF NOT EXISTS inquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  location TEXT,
  service_type TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'unread',
  is_important BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security (RLS)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

-- Public can read published projects and categories
CREATE POLICY "Allow public read access to published projects"
  ON projects FOR SELECT
  USING (published = true);

CREATE POLICY "Allow public read access to categories"
  ON project_categories FOR SELECT
  TO PUBLIC USING (true);

-- Public can insert inquiries
CREATE POLICY "Allow public to insert inquiries"
  ON inquiries FOR INSERT
  TO PUBLIC WITH CHECK (true);
