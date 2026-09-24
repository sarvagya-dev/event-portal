-- Event Portal — Database Schema
-- Run this in the Supabase SQL Editor to create the required tables.

-- ============================================
-- EVENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS events (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          TEXT UNIQUE NOT NULL,
  title         TEXT NOT NULL,
  description   TEXT NOT NULL,
  category      TEXT NOT NULL,
  date          DATE NOT NULL,
  time          TIME,
  mode          TEXT NOT NULL CHECK (mode IN ('online', 'offline', 'hybrid')),
  venue         TEXT,
  organizer     TEXT NOT NULL,
  registration_deadline TIMESTAMPTZ NOT NULL,
  capacity      INTEGER NOT NULL CHECK (capacity > 0),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- REGISTRATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS registrations (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id      UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  email         TEXT NOT NULL,
  phone         TEXT,
  college       TEXT,
  year          TEXT,
  branch        TEXT,
  linkedin      TEXT,
  github        TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE (event_id, email)
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_events_slug ON events(slug);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_registrations_event_id ON registrations(event_id);
