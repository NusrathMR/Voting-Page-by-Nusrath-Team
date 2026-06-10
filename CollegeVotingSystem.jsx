/**
 * College Voting Polling System
 * A complete single-file React application for university elections
 * 
 * Features:
 * - Login & Signup with validation
 * - Student/Staff Registration (stored in localStorage)
 * - Voting Instructions with acknowledgment
 * - Digital Ballot Paper for Student Union Election 2026
 * - Vote Success Page
 * - Admin Dashboard with charts
 * - Dark Mode Toggle
 * - Election Countdown Timer
 * - Progress Indicator
 * - Toast Notifications
 * - Fully Responsive
 */

import { useState, useEffect, useCallback } from "react";

// ─── Constants ───────────────────────────────────────────────────────────────

const CANDIDATES = [
  {
    id: "A",
    name: "Alexandra Chen",
    position: "President",
    motto: "\"Innovation, Integrity, Impact\"",
    manifesto: "Championing student welfare, modernizing campus facilities, and bridging the gap between students and administration.",
    color: "#1a56db",
    initials: "AC",
  },
  {
    id: "B",
    name: "Marcus Okonkwo",
    position: "President",
    motto: "\"Unity Through Diversity\"",
    manifesto: "Building an inclusive campus community, enhancing mental health resources, and improving academic support systems.",
    color: "#0694a2",
    initials: "MO",
  },
  {
    id: "C",
    name: "Priya Sharma",
    position: "President",
    motto: "\"Your Voice, Our Future\"",
    manifesto: "Strengthening student clubs, securing better career opportunities, and ensuring transparent governance.",
    color: "#7e3af2",
    initials: "PS",
  },
];

const ELECTION_DATE = new Date("2026-12-31T23:59:59");

const FACULTIES = [
  "Faculty of Engineering",
  "Faculty of Business",
  "Faculty of Arts & Humanities",
  "Faculty of Science",
  "Faculty of Medicine",
  "Faculty of Law",
  "Faculty of Education",
];

// ─── LocalStorage Helpers ─────────────────────────────────────────────────────

const storage = {
  getUsers: () => JSON.parse(localStorage.getItem("cvps_users") || "[]"),
  saveUsers: (u) => localStorage.setItem("cvps_users", JSON.stringify(u)),
  getRegistrations: () => JSON.parse(localStorage.getItem("cvps_registrations") || "[]"),
  saveRegistrations: (r) => localStorage.setItem("cvps_registrations", JSON.stringify(r)),
  getVotes: () => JSON.parse(localStorage.getItem("cvps_votes") || "[]"),
  saveVotes: (v) => localStorage.setItem("cvps_votes", JSON.stringify(v)),
  getSession: () => JSON.parse(localStorage.getItem("cvps_session") || "null"),
  saveSession: (s) => localStorage.setItem("cvps_session", JSON.stringify(s)),
  clearSession: () => localStorage.removeItem("cvps_session"),
};

// ─── CSS ──────────────────────────────────────────────────────────────────────

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --primary: #1a56db;
    --primary-dark: #1246be;
    --primary-light: #e8f0fe;
    --accent: #0694a2;
    --success: #057a55;
    --success-bg: #f3faf7;
    --danger: #c81e1e;
    --danger-bg: #fdf2f2;
    --warning: #92400e;
    --warning-bg: #fffbeb;
    --gray-50: #f9fafb;
    --gray-100: #f3f4f6;
    --gray-200: #e5e7eb;
    --gray-300: #d1d5db;
    --gray-400: #9ca3af;
    --gray-500: #6b7280;
    --gray-600: #4b5563;
    --gray-700: #374151;
    --gray-800: #1f2937;
    --gray-900: #111827;
    --bg: #f0f4ff;
    --surface: #ffffff;
    --text: #1f2937;
    --text-muted: #6b7280;
    --border: #e5e7eb;
    --shadow: 0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06);
    --shadow-md: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06);
    --shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05);
    --radius: 8px;
    --radius-lg: 12px;
    --radius-xl: 16px;
    --font: 'Inter', system-ui, sans-serif;
    --transition: 0.2s ease;
  }

  .dark {
    --primary: #3b82f6;
    --primary-dark: #2563eb;
    --primary-light: #1e3a5f;
    --success: #10b981;
    --success-bg: #064e3b;
    --danger: #f87171;
    --danger-bg: #450a0a;
    --bg: #0f172a;
    --surface: #1e293b;
    --text: #f1f5f9;
    --text-muted: #94a3b8;
    --border: #334155;
    --gray-50: #1e293b;
    --gray-100: #1e293b;
    --gray-200: #334155;
    --gray-300: #475569;
    --gray-400: #64748b;
    --gray-500: #94a3b8;
    --gray-600: #cbd5e1;
    --gray-700: #e2e8f0;
    --gray-800: #f1f5f9;
    --gray-900: #f8fafc;
  }

  html, body, #root { height: 100%; }

  body {
    font-family: var(--font);
    background: var(--bg);
    color: var(--text);
    transition: background var(--transition), color var(--transition);
    min-height: 100vh;
  }

  /* Layout */
  .app { min-height: 100vh; display: flex; flex-direction: column; }
  .page { flex: 1; display: flex; flex-direction: column; }

  /* Navbar */
  .navbar {
    background: var(--surface);
    border-bottom: 1px solid var(--border);
    padding: 0 1.5rem;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    z-index: 100;
    box-shadow: var(--shadow);
  }
  .navbar-brand {
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 700;
    font-size: 1.1rem;
    color: var(--primary);
    text-decoration: none;
  }
  .navbar-logo {
    width: 36px;
    height: 36px;
    background: var(--primary);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 700;
    font-size: 14px;
    flex-shrink: 0;
  }
  .navbar-actions { display: flex; align-items: center; gap: 8px; }
  .icon-btn {
    background: var(--gray-100);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 7px 10px;
    cursor: pointer;
    color: var(--text);
    font-size: 16px;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: background var(--transition);
  }
  .icon-btn:hover { background: var(--gray-200); }
  .icon-btn span { font-size: 13px; font-weight: 500; }

  /* Progress bar */
  .progress-bar {
    background: var(--surface);
    border-bottom: 1px solid var(--border);
    padding: 0 1.5rem;
  }
  .progress-steps {
    display: flex;
    align-items: center;
    max-width: 640px;
    margin: 0 auto;
    padding: 12px 0;
    overflow-x: auto;
  }
  .progress-step {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-shrink: 0;
  }
  .step-circle {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 600;
    border: 2px solid var(--border);
    background: var(--surface);
    color: var(--text-muted);
    transition: all var(--transition);
  }
  .step-circle.active { background: var(--primary); border-color: var(--primary); color: white; }
  .step-circle.done { background: var(--success); border-color: var(--success); color: white; }
  .step-label { font-size: 11px; color: var(--text-muted); font-weight: 500; white-space: nowrap; }
  .step-label.active { color: var(--primary); font-weight: 600; }
  .step-label.done { color: var(--success); }
  .step-connector {
    flex: 1;
    min-width: 20px;
    height: 2px;
    background: var(--border);
    margin: 0 6px;
  }
  .step-connector.done { background: var(--success); }

  /* Main content area */
  .main { flex: 1; padding: 2rem 1.5rem; max-width: 1100px; margin: 0 auto; width: 100%; }
  .main-centered { max-width: 480px; }
  .main-wide { max-width: 800px; }

  /* Cards */
  .card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-xl);
    padding: 2rem;
    box-shadow: var(--shadow);
  }
  .card-sm { padding: 1.25rem; border-radius: var(--radius-lg); }
  .card-header { margin-bottom: 1.5rem; }
  .card-title { font-size: 1.5rem; font-weight: 700; color: var(--text); }
  .card-subtitle { font-size: 0.875rem; color: var(--text-muted); margin-top: 4px; }

  /* Auth pages */
  .auth-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem 1rem;
    background: linear-gradient(135deg, #1a56db08 0%, #0694a208 100%);
  }
  .auth-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-xl);
    padding: 2.5rem;
    width: 100%;
    max-width: 440px;
    box-shadow: var(--shadow-lg);
    animation: slideUp 0.3s ease;
  }
  .auth-logo {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 2rem;
  }
  .auth-logo-icon {
    width: 72px;
    height: 72px;
    background: linear-gradient(135deg, var(--primary), #0694a2);
    border-radius: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 28px;
    font-weight: 800;
    margin-bottom: 12px;
  }
  .auth-logo-text { font-size: 1.25rem; font-weight: 700; color: var(--text); }
  .auth-logo-sub { font-size: 0.8rem; color: var(--text-muted); text-align: center; }

  /* Form elements */
  .form-group { margin-bottom: 1.25rem; }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
  @media (max-width: 480px) { .form-row { grid-template-columns: 1fr; } }
  label { font-size: 0.875rem; font-weight: 500; color: var(--gray-700); display: block; margin-bottom: 6px; }
  .dark label { color: var(--gray-300); }
  input[type="text"],
  input[type="email"],
  input[type="password"],
  input[type="tel"],
  select,
  textarea {
    width: 100%;
    padding: 10px 14px;
    border: 1.5px solid var(--border);
    border-radius: var(--radius);
    font-size: 0.9rem;
    font-family: var(--font);
    background: var(--surface);
    color: var(--text);
    transition: border-color var(--transition), box-shadow var(--transition);
    outline: none;
  }
  input:focus, select:focus, textarea:focus {
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(26,86,219,0.12);
  }
  .input-error { border-color: var(--danger) !important; }
  .field-error { font-size: 0.8rem; color: var(--danger); margin-top: 4px; }

  /* Buttons */
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 10px 20px;
    border-radius: var(--radius);
    font-size: 0.9rem;
    font-weight: 600;
    font-family: var(--font);
    cursor: pointer;
    border: none;
    transition: all var(--transition);
    text-decoration: none;
  }
  .btn-primary {
    background: var(--primary);
    color: white;
  }
  .btn-primary:hover { background: var(--primary-dark); transform: translateY(-1px); box-shadow: var(--shadow-md); }
  .btn-primary:active { transform: translateY(0); }
  .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
  .btn-secondary {
    background: var(--gray-100);
    color: var(--text);
    border: 1px solid var(--border);
  }
  .btn-secondary:hover { background: var(--gray-200); }
  .btn-success { background: var(--success); color: white; }
  .btn-danger { background: var(--danger); color: white; }
  .btn-lg { padding: 14px 28px; font-size: 1rem; border-radius: var(--radius-lg); }
  .btn-full { width: 100%; }
  .btn-outline {
    background: transparent;
    color: var(--primary);
    border: 1.5px solid var(--primary);
  }
  .btn-outline:hover { background: var(--primary-light); }

  /* Checkbox */
  .checkbox-group { display: flex; align-items: flex-start; gap: 10px; }
  .checkbox-group input[type="checkbox"] { width: 18px; height: 18px; cursor: pointer; margin-top: 2px; flex-shrink: 0; accent-color: var(--primary); }
  .checkbox-group label { font-size: 0.875rem; color: var(--text); cursor: pointer; margin-bottom: 0; }

  /* Divider */
  .divider { display: flex; align-items: center; gap: 12px; margin: 1.25rem 0; color: var(--text-muted); font-size: 0.8rem; }
  .divider::before, .divider::after { content: ''; flex: 1; height: 1px; background: var(--border); }

  /* Link */
  .link { color: var(--primary); text-decoration: none; font-weight: 500; }
  .link:hover { text-decoration: underline; }

  /* Auth footer */
  .auth-footer { text-align: center; margin-top: 1.5rem; font-size: 0.875rem; color: var(--text-muted); }

  /* Alerts */
  .alert {
    padding: 12px 16px;
    border-radius: var(--radius);
    font-size: 0.875rem;
    margin-bottom: 1rem;
    display: flex;
    align-items: flex-start;
    gap: 10px;
    animation: fadeIn 0.25s ease;
  }
  .alert-success { background: var(--success-bg); color: var(--success); border: 1px solid var(--success); }
  .alert-danger { background: var(--danger-bg); color: var(--danger); border: 1px solid var(--danger); }
  .alert-warning { background: var(--warning-bg); color: var(--warning); border: 1px solid #fbbf24; }

  /* Toast */
  .toast-container {
    position: fixed;
    top: 80px;
    right: 1rem;
    z-index: 999;
    display: flex;
    flex-direction: column;
    gap: 8px;
    pointer-events: none;
  }
  .toast {
    background: var(--gray-900);
    color: white;
    padding: 12px 16px;
    border-radius: var(--radius-lg);
    font-size: 0.875rem;
    font-weight: 500;
    box-shadow: var(--shadow-lg);
    animation: slideInRight 0.3s ease;
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 200px;
    max-width: 320px;
  }
  .toast.success { background: #065f46; }
  .toast.error { background: #7f1d1d; }
  .toast.info { background: #1e3a5f; }
  .toast.exit { animation: slideOutRight 0.3s ease forwards; }

  /* Instructions page */
  .instructions-box {
    background: var(--gray-50);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 1.5rem;
    max-height: 320px;
    overflow-y: auto;
    margin-bottom: 1.5rem;
  }
  .instruction-item {
    display: flex;
    gap: 14px;
    padding: 12px 0;
    border-bottom: 1px solid var(--border);
  }
  .instruction-item:last-child { border-bottom: none; }
  .instruction-num {
    width: 32px;
    height: 32px;
    background: var(--primary-light);
    color: var(--primary);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 0.9rem;
    flex-shrink: 0;
  }
  .instruction-text { font-size: 0.9rem; color: var(--text); line-height: 1.6; }
  .instruction-text strong { color: var(--gray-800); }

  /* Ballot */
  .ballot-header {
    background: linear-gradient(135deg, #1a56db, #0694a2);
    color: white;
    padding: 2rem;
    border-radius: var(--radius-xl) var(--radius-xl) 0 0;
    text-align: center;
    margin: -2rem -2rem 2rem;
  }
  .ballot-header h1 { font-size: 1.4rem; font-weight: 700; margin-bottom: 4px; }
  .ballot-header p { font-size: 0.85rem; opacity: 0.85; }
  .ballot-seal {
    width: 60px;
    height: 60px;
    background: rgba(255,255,255,0.15);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    margin: 0 auto 12px;
    border: 2px solid rgba(255,255,255,0.3);
  }
  .candidates-grid {
    display: grid;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }
  .candidate-card {
    border: 2px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 1.25rem;
    cursor: pointer;
    transition: all var(--transition);
    display: flex;
    align-items: center;
    gap: 1rem;
    background: var(--surface);
    position: relative;
  }
  .candidate-card:hover { border-color: var(--primary); background: var(--primary-light); transform: translateX(2px); }
  .candidate-card.selected { border-color: var(--primary); background: var(--primary-light); box-shadow: 0 0 0 3px rgba(26,86,219,0.15); }
  .candidate-avatar {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 700;
    font-size: 1.1rem;
    flex-shrink: 0;
  }
  .candidate-info { flex: 1; }
  .candidate-name { font-weight: 700; font-size: 1rem; color: var(--text); }
  .candidate-position { font-size: 0.8rem; color: var(--text-muted); font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; }
  .candidate-motto { font-size: 0.8rem; color: var(--text-muted); font-style: italic; margin-top: 4px; }
  .candidate-manifesto { font-size: 0.8rem; color: var(--text-muted); margin-top: 6px; line-height: 1.5; }
  .candidate-radio {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    border: 2px solid var(--border);
    background: var(--surface);
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all var(--transition);
  }
  .candidate-card.selected .candidate-radio { border-color: var(--primary); background: var(--primary); }
  .candidate-card.selected .candidate-radio::after {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: white;
    display: block;
  }
  .candidate-badge {
    position: absolute;
    top: 10px;
    right: 10px;
    background: var(--primary);
    color: white;
    font-size: 0.65rem;
    font-weight: 700;
    padding: 3px 8px;
    border-radius: 20px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  /* Modal */
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.5);
    z-index: 200;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    animation: fadeIn 0.2s ease;
  }
  .modal {
    background: var(--surface);
    border-radius: var(--radius-xl);
    padding: 2rem;
    width: 100%;
    max-width: 420px;
    box-shadow: var(--shadow-lg);
    animation: scaleIn 0.2s ease;
  }
  .modal-title { font-size: 1.2rem; font-weight: 700; margin-bottom: 0.5rem; }
  .modal-body { color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1.5rem; line-height: 1.6; }
  .modal-actions { display: flex; gap: 10px; justify-content: flex-end; }

  /* Success page */
  .success-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    min-height: 60vh;
    padding: 2rem;
  }
  .success-icon {
    width: 100px;
    height: 100px;
    background: linear-gradient(135deg, var(--success), #10b981);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 48px;
    margin-bottom: 1.5rem;
    animation: bounceIn 0.6s cubic-bezier(0.36,0.07,0.19,0.97);
    box-shadow: 0 10px 30px rgba(5,122,85,0.3);
  }
  .success-title { font-size: 2rem; font-weight: 700; color: var(--text); margin-bottom: 0.5rem; }
  .success-subtitle { font-size: 1rem; color: var(--text-muted); margin-bottom: 0.25rem; }
  .success-id { font-size: 0.85rem; color: var(--text-muted); background: var(--gray-100); padding: 6px 16px; border-radius: 20px; margin: 1rem 0; }
  .confetti-emoji { font-size: 2rem; margin: 0.5rem 0; animation: sway 2s ease-in-out infinite; }

  /* Admin dashboard */
  .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
  .stat-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 1.25rem;
    text-align: center;
  }
  .stat-value { font-size: 2rem; font-weight: 700; color: var(--primary); }
  .stat-label { font-size: 0.8rem; color: var(--text-muted); margin-top: 4px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; }
  .vote-bar-section { margin-bottom: 2rem; }
  .vote-bar-item { margin-bottom: 1rem; }
  .vote-bar-header { display: flex; justify-content: space-between; font-size: 0.875rem; font-weight: 600; margin-bottom: 6px; color: var(--text); }
  .vote-bar-track { height: 12px; background: var(--gray-200); border-radius: 6px; overflow: hidden; }
  .vote-bar-fill { height: 100%; border-radius: 6px; transition: width 1s cubic-bezier(0.4,0,0.2,1); }
  .registrations-table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
  .registrations-table th { background: var(--gray-100); padding: 10px 12px; text-align: left; font-weight: 600; color: var(--text-muted); border-bottom: 1px solid var(--border); }
  .registrations-table td { padding: 10px 12px; border-bottom: 1px solid var(--border); color: var(--text); }
  .registrations-table tr:last-child td { border-bottom: none; }
  .registrations-table tr:hover td { background: var(--gray-50); }
  .badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 600; }
  .badge-student { background: #e8f0fe; color: #1a56db; }
  .badge-staff { background: #f3faf7; color: #057a55; }
  .dark .badge-student { background: #1e3a5f; color: #3b82f6; }
  .dark .badge-staff { background: #064e3b; color: #10b981; }

  /* Countdown timer */
  .countdown {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
    margin: 1rem 0;
  }
  .countdown-unit {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 1rem 1.25rem;
    text-align: center;
    min-width: 72px;
  }
  .countdown-num { font-size: 2rem; font-weight: 700; color: var(--primary); line-height: 1; }
  .countdown-label { font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; margin-top: 4px; }

  /* Footer */
  .footer {
    background: var(--surface);
    border-top: 1px solid var(--border);
    padding: 1.5rem;
    text-align: center;
    font-size: 0.8rem;
    color: var(--text-muted);
    margin-top: auto;
  }

  /* Animations */
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.9); }
    to { opacity: 1; transform: scale(1); }
  }
  @keyframes slideInRight {
    from { opacity: 0; transform: translateX(40px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes slideOutRight {
    from { opacity: 1; transform: translateX(0); }
    to { opacity: 0; transform: translateX(40px); }
  }
  @keyframes bounceIn {
    0% { transform: scale(0); opacity: 0; }
    60% { transform: scale(1.2); }
    100% { transform: scale(1); opacity: 1; }
  }
  @keyframes sway {
    0%, 100% { transform: rotate(-10deg); }
    50% { transform: rotate(10deg); }
  }
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  .spinner {
    width: 20px; height: 20px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    display: inline-block;
  }
  .page-enter { animation: slideUp 0.3s ease; }

  /* Already voted */
  .voted-banner {
    background: var(--warning-bg);
    border: 1px solid #fbbf24;
    border-radius: var(--radius-lg);
    padding: 1.5rem;
    text-align: center;
    margin-top: 1rem;
  }
  .voted-banner-icon { font-size: 2.5rem; margin-bottom: 0.5rem; }
  .voted-banner-title { font-weight: 700; color: var(--warning); font-size: 1.1rem; }
  .voted-banner-text { color: var(--text-muted); font-size: 0.875rem; margin-top: 4px; }

  /* Registration type selector */
  .role-selector { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem; }
  .role-card {
    border: 2px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 1.25rem;
    cursor: pointer;
    text-align: center;
    transition: all var(--transition);
  }
  .role-card:hover { border-color: var(--primary); }
  .role-card.selected { border-color: var(--primary); background: var(--primary-light); }
  .role-card-icon { font-size: 2rem; margin-bottom: 8px; }
  .role-card-label { font-weight: 600; font-size: 0.9rem; color: var(--text); }
  .role-card-sub { font-size: 0.75rem; color: var(--text-muted); margin-top: 2px; }

  /* Responsive */
  @media (max-width: 640px) {
    .navbar { padding: 0 1rem; }
    .navbar-brand-text { display: none; }
    .main { padding: 1.5rem 1rem; }
    .auth-card { padding: 1.75rem 1.5rem; }
    .ballot-header { padding: 1.5rem; margin: -1.5rem -1.5rem 1.5rem; }
    .card { padding: 1.5rem; }
    .stats-grid { grid-template-columns: repeat(2, 1fr); }
    .countdown { gap: 0.5rem; }
    .countdown-unit { min-width: 60px; padding: 0.75rem 1rem; }
    .countdown-num { font-size: 1.5rem; }
  }

  /* Scrollbar */
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--gray-300); border-radius: 3px; }

  /* Admin secret link */
  .admin-hint { font-size: 0.75rem; color: transparent; user-select: none; }
  .admin-hint:hover { color: var(--text-muted); cursor: pointer; }

  /* Table wrapper */
  .table-wrapper { overflow-x: auto; }

  /* Section header */
  .section-title { font-size: 1.1rem; font-weight: 700; color: var(--text); margin-bottom: 1rem; display: flex; align-items: center; gap: 8px; }
`;

// ─── Toast System ─────────────────────────────────────────────────────────────

function ToastContainer({ toasts }) {
  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div key={t.id} className={`toast ${t.type} ${t.exiting ? "exit" : ""}`}>
          <span>{t.type === "success" ? "✓" : t.type === "error" ? "✕" : "ℹ"}</span>
          {t.message}
        </div>
      ))}
    </div>
  );
}

function useToast() {
  const [toasts, setToasts] = useState([]);
  const addToast = useCallback((message, type = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type, exiting: false }]);
    setTimeout(() => {
      setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, exiting: true } : t)));
      setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 350);
    }, 3000);
  }, []);
  return { toasts, addToast };
}

// ─── Countdown Timer ──────────────────────────────────────────────────────────

function Countdown() {
  const [time, setTime] = useState({});
  useEffect(() => {
    const calc = () => {
      const diff = ELECTION_DATE - new Date();
      if (diff <= 0) return setTime({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setTime({ days, hours, minutes, seconds });
    };
    calc();
    const iv = setInterval(calc, 1000);
    return () => clearInterval(iv);
  }, []);
  return (
    <div className="countdown">
      {["days", "hours", "minutes", "seconds"].map((unit) => (
        <div key={unit} className="countdown-unit">
          <div className="countdown-num">{String(time[unit] ?? 0).padStart(2, "0")}</div>
          <div className="countdown-label">{unit}</div>
        </div>
      ))}
    </div>
  );
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────

const STEPS = ["Login", "Register", "Instructions", "Vote", "Complete"];

function ProgressBar({ currentStep }) {
  if (currentStep < 0) return null;
  return (
    <div className="progress-bar">
      <div className="progress-steps">
        {STEPS.map((step, i) => (
          <div key={step} style={{ display: "flex", alignItems: "center", flex: i < STEPS.length - 1 ? "1" : "0", minWidth: "fit-content" }}>
            <div className="progress-step">
              <div className={`step-circle ${i < currentStep ? "done" : i === currentStep ? "active" : ""}`}>
                {i < currentStep ? "✓" : i + 1}
              </div>
              <span className={`step-label ${i < currentStep ? "done" : i === currentStep ? "active" : ""}`}>{step}</span>
            </div>
            {i < STEPS.length - 1 && <div className={`step-connector ${i < currentStep ? "done" : ""}`} style={{ flex: 1, minWidth: 16 }} />}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

function Navbar({ session, onLogout, darkMode, toggleDark, onAdmin }) {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <div className="navbar-logo">CU</div>
        <span className="navbar-brand-text">College Voting System</span>
      </div>
      <div className="navbar-actions">
        {onAdmin && (
          <button className="icon-btn" onClick={onAdmin} title="Admin">
            <span>⚙</span>
          </button>
        )}
        <button className="icon-btn" onClick={toggleDark} title="Toggle dark mode">
          <span>{darkMode ? "☀" : "🌙"}</span>
        </button>
        {session && (
          <button className="icon-btn" onClick={onLogout} title="Logout">
            <span>👤</span>
            <span>{session.name?.split(" ")[0]}</span>
          </button>
        )}
      </div>
    </nav>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="footer">
      <p>© 2026 College Voting Polling System · Student Union Election · All votes are confidential</p>
    </footer>
  );
}

// ─── Login Page ───────────────────────────────────────────────────────────────

function LoginPage({ onLogin, onGotoSignup, addToast }) {
  const [form, setForm] = useState({ email: "", password: "", remember: false });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email address";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 6) e.password = "Password must be at least 6 characters";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) return setErrors(e2);
    setLoading(true);
    setTimeout(() => {
      // Check admin
      if (form.email === "admin@college.edu" && form.password === "admin123") {
        setLoading(false);
        onLogin({ email: form.email, name: "Administrator", role: "admin" });
        addToast("Welcome, Administrator!", "success");
        return;
      }
      const users = storage.getUsers();
      const user = users.find((u) => u.email === form.email);
      if (!user) {
        setLoading(false);
        setErrors({ general: "No account found with this email. Please sign up." });
        return;
      }
      if (user.password !== form.password) {
        setLoading(false);
        setErrors({ general: "Incorrect password. Please try again." });
        return;
      }
      setLoading(false);
      onLogin(user);
      addToast(`Welcome back, ${user.name.split(" ")[0]}!`, "success");
    }, 800);
  };

  const set = (k) => (v) => { setForm((f) => ({ ...f, [k]: v })); setErrors((e) => ({ ...e, [k]: undefined, general: undefined })); };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon">🏛</div>
          <div className="auth-logo-text">College Voting System</div>
          <div className="auth-logo-sub">Student Union Election 2026</div>
        </div>
        {errors.general && <div className="alert alert-danger">⚠ {errors.general}</div>}
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="login-email">Email address</label>
            <input id="login-email" type="email" placeholder="you@university.edu" value={form.email} className={errors.email ? "input-error" : ""} onChange={(e) => set("email")(e.target.value)} autoComplete="email" />
            {errors.email && <div className="field-error">{errors.email}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="login-pw">Password</label>
            <input id="login-pw" type="password" placeholder="••••••••" value={form.password} className={errors.password ? "input-error" : ""} onChange={(e) => set("password")(e.target.value)} autoComplete="current-password" />
            {errors.password && <div className="field-error">{errors.password}</div>}
          </div>
          <div className="form-group">
            <div className="checkbox-group">
              <input id="remember" type="checkbox" checked={form.remember} onChange={(e) => set("remember")(e.target.checked)} />
              <label htmlFor="remember">Remember me on this device</label>
            </div>
          </div>
          <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
            {loading ? <><span className="spinner" /> Signing in...</> : "Sign In"}
          </button>
        </form>
        <div className="divider">or</div>
        <div className="auth-footer">
          Don't have an account?{" "}
          <a href="#" className="link" onClick={(e) => { e.preventDefault(); onGotoSignup(); }}>
            Create account
          </a>
        </div>
        <div className="auth-footer" style={{ marginTop: 8, fontSize: "0.75rem" }}>
          Admin? Use <code>admin@college.edu</code> / <code>admin123</code>
        </div>
      </div>
    </div>
  );
}

// ─── Signup Page ──────────────────────────────────────────────────────────────

function SignupPage({ onSignup, onGotoLogin, addToast }) {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Full name is required";
    else if (form.name.trim().split(" ").length < 2) e.name = "Please enter your full name";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email address";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 6) e.password = "Must be at least 6 characters";
    if (!form.confirm) e.confirm = "Please confirm your password";
    else if (form.confirm !== form.password) e.confirm = "Passwords do not match";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) return setErrors(e2);
    setLoading(true);
    setTimeout(() => {
      const users = storage.getUsers();
      if (users.find((u) => u.email === form.email)) {
        setLoading(false);
        setErrors({ email: "An account with this email already exists" });
        return;
      }
      const newUser = { id: Date.now(), name: form.name.trim(), email: form.email.toLowerCase(), password: form.password, createdAt: new Date().toISOString() };
      storage.saveUsers([...users, newUser]);
      setLoading(false);
      onSignup(newUser);
      addToast("Account created! Please complete registration.", "success");
    }, 800);
  };

  const set = (k) => (v) => { setForm((f) => ({ ...f, [k]: v })); setErrors((e) => ({ ...e, [k]: undefined })); };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon">🏛</div>
          <div className="auth-logo-text">Create Account</div>
          <div className="auth-logo-sub">Join the College Voting System</div>
        </div>
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="su-name">Full name</label>
            <input id="su-name" type="text" placeholder="e.g. Alexandra Chen" value={form.name} className={errors.name ? "input-error" : ""} onChange={(e) => set("name")(e.target.value)} />
            {errors.name && <div className="field-error">{errors.name}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="su-email">Email address</label>
            <input id="su-email" type="email" placeholder="you@university.edu" value={form.email} className={errors.email ? "input-error" : ""} onChange={(e) => set("email")(e.target.value)} />
            {errors.email && <div className="field-error">{errors.email}</div>}
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="su-pw">Password</label>
              <input id="su-pw" type="password" placeholder="Min 6 characters" value={form.password} className={errors.password ? "input-error" : ""} onChange={(e) => set("password")(e.target.value)} />
              {errors.password && <div className="field-error">{errors.password}</div>}
            </div>
            <div className="form-group">
              <label htmlFor="su-confirm">Confirm password</label>
              <input id="su-confirm" type="password" placeholder="Repeat password" value={form.confirm} className={errors.confirm ? "input-error" : ""} onChange={(e) => set("confirm")(e.target.value)} />
              {errors.confirm && <div className="field-error">{errors.confirm}</div>}
            </div>
          </div>
          <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
            {loading ? <><span className="spinner" /> Creating account...</> : "Create Account"}
          </button>
        </form>
        <div className="auth-footer" style={{ marginTop: "1.25rem" }}>
          Already have an account?{" "}
          <a href="#" className="link" onClick={(e) => { e.preventDefault(); onGotoLogin(); }}>
            Sign in
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── Registration Page ────────────────────────────────────────────────────────

function RegisterPage({ user, onRegistered, addToast }) {
  const [role, setRole] = useState("student");
  const [form, setForm] = useState({ fullName: user?.name || "", idNumber: "", faculty: "", department: "", contact: "", email: user?.email || "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = "Full name is required";
    if (!form.idNumber.trim()) e.idNumber = `${role === "student" ? "Student" : "Staff"} ID is required`;
    if (!form.faculty) e.faculty = "Faculty is required";
    if (!form.department.trim()) e.department = "Department is required";
    if (!form.contact.trim()) e.contact = "Contact number is required";
    else if (!/^\+?[\d\s\-]{8,15}$/.test(form.contact)) e.contact = "Enter a valid phone number";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) return setErrors(e2);
    setLoading(true);
    setTimeout(() => {
      const regs = storage.getRegistrations();
      const reg = { ...form, role, userId: user.id, registeredAt: new Date().toISOString() };
      storage.saveRegistrations([...regs, reg]);
      setLoading(false);
      onRegistered(reg);
      addToast("Registration complete! Please read the voting instructions.", "success");
    }, 800);
  };

  const set = (k) => (v) => { setForm((f) => ({ ...f, [k]: v })); setErrors((e) => ({ ...e, [k]: undefined })); };

  return (
    <div className="page-enter">
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Voter Registration</h2>
          <p className="card-subtitle">Complete your profile to participate in the election</p>
        </div>
        <div className="role-selector">
          {["student", "staff"].map((r) => (
            <div key={r} className={`role-card ${role === r ? "selected" : ""}`} onClick={() => setRole(r)}>
              <div className="role-card-icon">{r === "student" ? "🎓" : "👔"}</div>
              <div className="role-card-label">{r === "student" ? "Student" : "Staff Member"}</div>
              <div className="role-card-sub">{r === "student" ? "Undergraduate / Postgraduate" : "Faculty / Administrative"}</div>
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-row">
            <div className="form-group">
              <label>Full name</label>
              <input type="text" placeholder="As per college records" value={form.fullName} className={errors.fullName ? "input-error" : ""} onChange={(e) => set("fullName")(e.target.value)} />
              {errors.fullName && <div className="field-error">{errors.fullName}</div>}
            </div>
            <div className="form-group">
              <label>{role === "student" ? "Student ID" : "Staff ID"}</label>
              <input type="text" placeholder={role === "student" ? "e.g. STU2026001" : "e.g. STF2026001"} value={form.idNumber} className={errors.idNumber ? "input-error" : ""} onChange={(e) => set("idNumber")(e.target.value)} />
              {errors.idNumber && <div className="field-error">{errors.idNumber}</div>}
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Faculty</label>
              <select value={form.faculty} className={errors.faculty ? "input-error" : ""} onChange={(e) => set("faculty")(e.target.value)}>
                <option value="">Select faculty</option>
                {FACULTIES.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
              {errors.faculty && <div className="field-error">{errors.faculty}</div>}
            </div>
            <div className="form-group">
              <label>Department</label>
              <input type="text" placeholder="e.g. Computer Science" value={form.department} className={errors.department ? "input-error" : ""} onChange={(e) => set("department")(e.target.value)} />
              {errors.department && <div className="field-error">{errors.department}</div>}
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Contact number</label>
              <input type="tel" placeholder="+94 77 123 4567" value={form.contact} className={errors.contact ? "input-error" : ""} onChange={(e) => set("contact")(e.target.value)} />
              {errors.contact && <div className="field-error">{errors.contact}</div>}
            </div>
            <div className="form-group">
              <label>Email address</label>
              <input type="email" placeholder="you@university.edu" value={form.email} className={errors.email ? "input-error" : ""} onChange={(e) => set("email")(e.target.value)} />
              {errors.email && <div className="field-error">{errors.email}</div>}
            </div>
          </div>
          <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading} style={{ marginTop: "0.5rem" }}>
            {loading ? <><span className="spinner" /> Registering...</> : "Complete Registration →"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Instructions Page ────────────────────────────────────────────────────────

const INSTRUCTIONS = [
  { title: "One vote per voter", body: "Each registered voter is permitted to cast exactly one vote. Duplicate voting is prohibited and will be detected by the system." },
  { title: "Select only one candidate", body: "You must select exactly one candidate for the position of President. Ballots without a selection cannot be submitted." },
  { title: "Review your selection carefully", body: "Before submitting, review your choice. A confirmation dialog will appear — read it carefully before confirming." },
  { title: "Votes are final and cannot be changed", body: "Once your vote has been submitted, it cannot be reversed, altered, or reassigned under any circumstances." },
  { title: "Your vote is confidential", body: "All voting data is anonymized. Your specific vote is not associated with your personal details in any reports." },
  { title: "Eligibility requirements", body: "Only registered students and staff of this college may vote. Impersonation or proxy voting is a disciplinary offence." },
];

function InstructionsPage({ onContinue }) {
  const [agreed, setAgreed] = useState(false);
  return (
    <div className="page-enter">
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">📋 Voting Instructions</h2>
          <p className="card-subtitle">Student Union Election 2026 — Please read all instructions before proceeding</p>
        </div>
        <div className="instructions-box">
          {INSTRUCTIONS.map((ins, i) => (
            <div key={i} className="instruction-item">
              <div className="instruction-num">{i + 1}</div>
              <div className="instruction-text">
                <strong>{ins.title}.</strong> {ins.body}
              </div>
            </div>
          ))}
        </div>
        <div className="alert alert-warning" style={{ marginBottom: "1.25rem" }}>
          <span>⚠</span>
          <span>Violation of any of these rules may result in your vote being disqualified and disciplinary action.</span>
        </div>
        <div className="form-group">
          <div className="checkbox-group">
            <input id="agree" type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
            <label htmlFor="agree">I have read, understood, and agree to comply with all the voting instructions listed above.</label>
          </div>
        </div>
        <button className="btn btn-primary btn-full btn-lg" disabled={!agreed} onClick={onContinue}>
          Proceed to Ballot →
        </button>
      </div>
    </div>
  );
}

// ─── Ballot Page ──────────────────────────────────────────────────────────────

function BallotPage({ user, registration, onVoted, addToast }) {
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alreadyVoted, setAlreadyVoted] = useState(false);

  useEffect(() => {
    const votes = storage.getVotes();
    if (votes.find((v) => v.userId === user.id)) setAlreadyVoted(true);
  }, [user]);

  const candidate = CANDIDATES.find((c) => c.id === selected);

  const handleSubmit = () => {
    if (!selected) { addToast("Please select a candidate before submitting.", "error"); return; }
    setShowModal(true);
  };

  const confirmVote = () => {
    setLoading(true);
    setTimeout(() => {
      const votes = storage.getVotes();
      // Double-check no vote exists
      if (votes.find((v) => v.userId === user.id)) {
        setLoading(false);
        setShowModal(false);
        setAlreadyVoted(true);
        addToast("You have already cast your vote.", "error");
        return;
      }
      storage.saveVotes([...votes, { userId: user.id, candidateId: selected, castAt: new Date().toISOString() }]);
      setLoading(false);
      setShowModal(false);
      onVoted(selected);
      addToast("Your vote has been successfully recorded!", "success");
    }, 1200);
  };

  if (alreadyVoted) {
    return (
      <div className="page-enter">
        <div className="voted-banner">
          <div className="voted-banner-icon">🔒</div>
          <div className="voted-banner-title">You have already cast your vote.</div>
          <div className="voted-banner-text">Your vote has been recorded. Thank you for participating in the Student Union Election 2026.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-enter">
      <div className="card">
        <div className="ballot-header">
          <div className="ballot-seal">🏛</div>
          <h1>Student Union Election 2026</h1>
          <p>Official Digital Ballot Paper · {registration?.role === "student" ? "Student" : "Staff"} Voter</p>
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "8px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Position: President of the Student Union
          </div>
          <div style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
            Select exactly one (1) candidate below. Your selection will be highlighted in blue.
          </div>
        </div>

        <div className="candidates-grid">
          {CANDIDATES.map((c) => (
            <div key={c.id} className={`candidate-card ${selected === c.id ? "selected" : ""}`} onClick={() => setSelected(c.id)}>
              {selected === c.id && <div className="candidate-badge">✓ Selected</div>}
              <div className="candidate-avatar" style={{ background: c.color }}>{c.initials}</div>
              <div className="candidate-info">
                <div className="candidate-name">{c.name}</div>
                <div className="candidate-position">{c.position}</div>
                <div className="candidate-motto">{c.motto}</div>
                <div className="candidate-manifesto">{c.manifesto}</div>
              </div>
              <div className="candidate-radio" />
            </div>
          ))}
        </div>

        <div style={{ borderTop: "1px dashed var(--border)", paddingTop: "1.25rem" }}>
          {!selected && (
            <div className="alert alert-warning" style={{ marginBottom: "1rem" }}>
              <span>⚠</span> Please select a candidate to enable the submit button.
            </div>
          )}
          <button className="btn btn-primary btn-full btn-lg" onClick={handleSubmit} disabled={!selected}>
            Submit My Vote →
          </button>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => !loading && setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-title">⚠ Confirm your vote</div>
            <div className="modal-body">
              You are about to vote for <strong style={{ color: "var(--text)" }}>{candidate?.name}</strong> for the position of{" "}
              <strong style={{ color: "var(--text)" }}>President</strong>.<br /><br />
              This action <strong style={{ color: "var(--danger)" }}>cannot be undone</strong>. Are you sure you want to proceed?
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)} disabled={loading}>Cancel</button>
              <button className="btn btn-primary" onClick={confirmVote} disabled={loading}>
                {loading ? <><span className="spinner" /> Submitting...</> : "Yes, submit my vote"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Success Page ─────────────────────────────────────────────────────────────

function SuccessPage({ user, votedFor, onLogout }) {
  const candidate = CANDIDATES.find((c) => c.id === votedFor);
  const voteId = `VT-${Date.now().toString(36).toUpperCase()}`;
  return (
    <div className="page-enter">
      <div className="success-page">
        <div className="success-icon">✓</div>
        <div className="confetti-emoji">🎉</div>
        <h1 className="success-title">Vote Submitted!</h1>
        <p className="success-subtitle">Your vote has been successfully recorded.</p>
        <p className="success-subtitle">Thank you for participating in the</p>
        <p className="success-subtitle" style={{ fontWeight: 700, color: "var(--primary)", marginTop: "4px" }}>Student Union Election 2026</p>
        <div className="success-id">Vote Reference: {voteId}</div>
        <div style={{ background: "var(--gray-50)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "1.25rem", margin: "1rem 0", maxWidth: 360, width: "100%", textAlign: "left" }}>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>Your Ballot Summary</div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div className="candidate-avatar" style={{ background: candidate?.color, width: 40, height: 40, fontSize: "0.9rem" }}>{candidate?.initials}</div>
            <div>
              <div style={{ fontWeight: 700, color: "var(--text)" }}>{candidate?.name}</div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>President · Student Union 2026</div>
            </div>
          </div>
        </div>
        <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "1.5rem", maxWidth: 360, lineHeight: 1.6 }}>
          Your vote is confidential and has been anonymized in our records. Results will be announced at the Election Ceremony.
        </p>
        <button className="btn btn-primary btn-lg" onClick={onLogout}>
          Sign Out Securely
        </button>
      </div>
    </div>
  );
}

// ─── Admin Dashboard ──────────────────────────────────────────────────────────

function AdminPage({ onBack }) {
  const [data, setData] = useState({ users: [], regs: [], votes: [] });
  useEffect(() => {
    setData({ users: storage.getUsers(), regs: storage.getRegistrations(), votes: storage.getVotes() });
  }, []);

  const students = data.regs.filter((r) => r.role === "student").length;
  const staff = data.regs.filter((r) => r.role === "staff").length;
  const totalVotes = data.votes.length;

  const voteCounts = CANDIDATES.map((c) => ({ ...c, count: data.votes.filter((v) => v.candidateId === c.id).length }));
  const maxVotes = Math.max(...voteCounts.map((c) => c.count), 1);

  const COLORS = ["#1a56db", "#0694a2", "#7e3af2"];

  return (
    <div className="page-enter">
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "1.5rem" }}>
        <button className="btn btn-secondary" onClick={onBack}>← Back</button>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700 }}>⚙ Admin Dashboard</h1>
      </div>

      <div className="stats-grid">
        {[
          { label: "Registered Users", value: data.users.length, icon: "👥" },
          { label: "Students", value: students, icon: "🎓" },
          { label: "Staff", value: staff, icon: "👔" },
          { label: "Total Votes Cast", value: totalVotes, icon: "🗳" },
        ].map((s) => (
          <div key={s.label} className="stat-card">
            <div style={{ fontSize: "1.5rem", marginBottom: 4 }}>{s.icon}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginBottom: "1.5rem" }}>
        <div className="section-title">🗳 Vote Count Per Candidate</div>
        {voteCounts.map((c, i) => (
          <div key={c.id} className="vote-bar-item">
            <div className="vote-bar-header">
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: COLORS[i], display: "inline-block" }} />
                {c.name}
              </span>
              <span>{c.count} vote{c.count !== 1 ? "s" : ""} ({totalVotes > 0 ? Math.round((c.count / totalVotes) * 100) : 0}%)</span>
            </div>
            <div className="vote-bar-track">
              <div className="vote-bar-fill" style={{ width: `${totalVotes > 0 ? (c.count / maxVotes) * 100 : 0}%`, background: COLORS[i] }} />
            </div>
          </div>
        ))}
        {totalVotes === 0 && <div style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginTop: 8 }}>No votes have been cast yet.</div>}
      </div>

      <div className="card">
        <div className="section-title">📋 Recent Registrations</div>
        {data.regs.length === 0 ? (
          <div style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>No registrations yet.</div>
        ) : (
          <div className="table-wrapper">
            <table className="registrations-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>ID Number</th>
                  <th>Role</th>
                  <th>Faculty</th>
                  <th>Registered</th>
                </tr>
              </thead>
              <tbody>
                {[...data.regs].reverse().slice(0, 20).map((r, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 500 }}>{r.fullName}</td>
                    <td><code style={{ fontSize: "0.8rem" }}>{r.idNumber}</code></td>
                    <td><span className={`badge badge-${r.role}`}>{r.role === "student" ? "Student" : "Staff"}</span></td>
                    <td>{r.faculty?.replace("Faculty of ", "")}</td>
                    <td style={{ color: "var(--text-muted)" }}>{new Date(r.registeredAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [darkMode, setDarkMode] = useState(() => window.matchMedia?.("(prefers-color-scheme: dark)").matches);
  const [page, setPage] = useState("login");
  const [session, setSession] = useState(() => storage.getSession());
  const [registration, setRegistration] = useState(null);
  const [votedFor, setVotedFor] = useState(null);
  const { toasts, addToast } = useToast();

  // Inject CSS
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = CSS;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // Dark mode class on body
  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

  // Restore session
  useEffect(() => {
    if (session) {
      // Check if already registered
      const regs = storage.getRegistrations();
      const reg = regs.find((r) => r.userId === session.id);
      if (reg) setRegistration(reg);
      // Check if already voted
      const votes = storage.getVotes();
      const vote = votes.find((v) => v.userId === session.id);
      if (vote) { setVotedFor(vote.candidateId); }
      // Navigate to correct page
      if (session.role === "admin") { setPage("admin"); return; }
      if (vote) { setPage("success"); return; }
      if (reg) { setPage("instructions"); return; }
      setPage("register");
    }
  }, []); // eslint-disable-line

  const handleLogin = (user) => {
    storage.saveSession(user);
    setSession(user);
    if (user.role === "admin") { setPage("admin"); return; }
    const regs = storage.getRegistrations();
    const reg = regs.find((r) => r.userId === user.id);
    if (reg) { setRegistration(reg); setPage("instructions"); }
    else setPage("register");
  };

  const handleLogout = () => {
    storage.clearSession();
    setSession(null);
    setRegistration(null);
    setVotedFor(null);
    setPage("login");
    addToast("You have been signed out.", "info");
  };

  const getStep = () => {
    const map = { register: 1, instructions: 2, ballot: 3, success: 4 };
    if (page === "login" || page === "signup") return 0;
    if (page === "admin") return -1;
    return map[page] ?? 0;
  };

  // Page routing
  const renderPage = () => {
    if (page === "login") return <LoginPage onLogin={handleLogin} onGotoSignup={() => setPage("signup")} addToast={addToast} />;
    if (page === "signup") return <SignupPage onSignup={handleLogin} onGotoLogin={() => setPage("login")} addToast={addToast} />;

    if (page === "admin") return (
      <div className="main main-wide">
        <AdminPage onBack={() => { storage.clearSession(); setSession(null); setPage("login"); }} />
      </div>
    );

    return (
      <>
        <ProgressBar currentStep={getStep()} />
        <div className={`main ${page === "ballot" ? "main-wide" : "main-centered"}`}>
          {page === "register" && <RegisterPage user={session} onRegistered={(reg) => { setRegistration(reg); setPage("instructions"); }} addToast={addToast} />}
          {page === "instructions" && <InstructionsPage onContinue={() => setPage("ballot")} />}
          {page === "ballot" && <BallotPage user={session} registration={registration} onVoted={(c) => { setVotedFor(c); setPage("success"); }} addToast={addToast} />}
          {page === "success" && <SuccessPage user={session} votedFor={votedFor} onLogout={handleLogout} />}
        </div>
      </>
    );
  };

  const showAuthPage = page === "login" || page === "signup";
  const showCountdown = page === "instructions" || page === "ballot";

  return (
    <div className="app">
      <style>{`html, body { margin: 0; padding: 0; } .app { min-height: 100vh; }`}</style>
      <ToastContainer toasts={toasts} />

      {!showAuthPage && (
        <Navbar
          session={session}
          onLogout={handleLogout}
          darkMode={darkMode}
          toggleDark={() => setDarkMode((d) => !d)}
          onAdmin={session?.role === "admin" ? () => setPage("admin") : null}
        />
      )}

      {showCountdown && (
        <div style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)", padding: "1rem 1.5rem", textAlign: "center" }}>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>
            🗓 Election closes in
          </div>
          <Countdown />
        </div>
      )}

      <div className="page" style={showAuthPage ? {} : {}}>
        {renderPage()}
      </div>

      {!showAuthPage && page !== "success" && <Footer />}
    </div>
  );
}
