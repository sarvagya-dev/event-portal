-- Event Portal — Seed Data
-- Run this in the Supabase SQL Editor AFTER schema.sql to populate sample events.
-- All events, organizers, and descriptions are fictional.

INSERT INTO events (slug, title, description, category, date, time, mode, venue, organizer, registration_deadline, capacity)
VALUES
(
  'code-clash-2026',
  'Code Clash 2026',
  'A fast-paced competitive programming contest with three challenging rounds. Solve algorithmic problems under time pressure, compete for top rankings, and sharpen your problem-solving skills.',
  'Coding Competition',
  '2026-11-15',
  '10:00',
  'online',
  NULL,
  'ByteForce Coding Club',
  '2026-11-12 23:59:00+05:30',
  500
),
(
  'neural-networks-bootcamp',
  'Neural Networks Bootcamp',
  'A hands-on two-day workshop covering neural network fundamentals, backpropagation, CNNs, and practical model training with PyTorch. Suitable for beginners with basic Python knowledge.',
  'AI/ML Workshop',
  '2026-11-22',
  '09:30',
  'offline',
  'Seminar Hall B, Innovation Campus',
  'DataMinds Society',
  '2026-11-18 23:59:00+05:30',
  120
),
(
  'fullstack-forge',
  'Fullstack Forge',
  'Build a complete web application from scratch over a weekend. Covers React, Next.js, database design, API development, and deployment. Walk away with a portfolio-ready project.',
  'Web Development Workshop',
  '2026-12-06',
  '10:00',
  'hybrid',
  'Lab 3, Tech Block',
  'WebCraft Community',
  '2026-12-02 23:59:00+05:30',
  200
),
(
  'hacksprint-winter-2026',
  'HackSprint Winter 2026',
  'A 36-hour hackathon challenging teams of up to four to build innovative solutions for real-world problems. Tracks include health-tech, ed-tech, and sustainability. Prizes and mentorship included.',
  'Hackathon',
  '2026-12-13',
  '18:00',
  'offline',
  'Main Auditorium, Central Campus',
  'InnoVenture Labs',
  '2026-12-08 23:59:00+05:30',
  300
),
(
  'startup-launchpad',
  'Startup Launchpad',
  'Pitch your startup idea to a panel of experienced founders and investors. Get feedback, refine your business model, and network with fellow entrepreneurs. Open to individuals and teams.',
  'Entrepreneurship',
  '2026-12-20',
  '14:00',
  'offline',
  'Conference Room A, Business Incubation Centre',
  'E-Cell',
  '2026-12-16 23:59:00+05:30',
  80
),
(
  'cyberguard-ctf',
  'CyberGuard CTF',
  'A capture-the-flag competition covering web exploitation, cryptography, reverse engineering, and forensics. Compete solo or in teams of up to three. All skill levels welcome.',
  'Cybersecurity',
  '2027-01-10',
  '11:00',
  'online',
  NULL,
  'SecureNet Club',
  '2027-01-07 23:59:00+05:30',
  250
),
(
  'cloud-native-seminar',
  'Cloud Native Engineering Seminar',
  'Industry experts discuss container orchestration, microservices patterns, CI/CD pipelines, and observability in production systems. Includes a live demo of Kubernetes deployments.',
  'Technical Seminar',
  '2027-01-24',
  '15:00',
  'hybrid',
  'Auditorium 2, Engineering Block',
  'DevOps Circle',
  '2027-01-20 23:59:00+05:30',
  150
);
