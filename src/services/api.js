/**
 * API Service Layer
 * ─────────────────
 * All functions are async and return mock data with a simulated network delay.
 * To connect a real backend, replace the mock return inside each function with
 * a fetch() call to BASE_URL. The function signatures stay identical.
 *
 * Usage pattern (future):
 *   const data = await fetch(`${BASE_URL}/records`).then(r => r.json());
 *   return data;
 */

// TODO: Set this to your backend URL when deploying
const BASE_URL = 'http://localhost:8000/api/v1';

// Simulated network delay (ms) – remove when using real API
const DELAY_MS = 400;
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

import recordsData         from '../data/records.json';
import predictionsData     from '../data/predictions.json';
import recommendationsData from '../data/recommendations.json';
import alertsData          from '../data/alerts.json';
import sustainabilityData  from '../data/sustainability.json';

// ── Records ─────────────────────────────────────────────────────────────────

/**
 * Fetch all food records.
 * TODO: replace with → fetch(`${BASE_URL}/records`).then(r => r.json())
 */
export async function getRecords() {
  await delay(DELAY_MS);
  return [...recordsData];
}

/**
 * Add a new food record.
 * @param {object} record - New record object (without id; server assigns it)
 * TODO: replace with → fetch(`${BASE_URL}/records`, { method: 'POST', body: JSON.stringify(record) })
 */
export async function addRecord(record) {
  await delay(DELAY_MS);
  // Mock: generate id and return the record as-if saved
  const id = `rec-${String(Date.now()).slice(-6)}`;
  return { ...record, id };
}

// ── Predictions ──────────────────────────────────────────────────────────────

/**
 * Fetch upcoming quantity predictions.
 * TODO: replace with → fetch(`${BASE_URL}/predictions`).then(r => r.json())
 */
export async function getPredictions() {
  await delay(DELAY_MS);
  return [...predictionsData];
}

/**
 * Get today's smart recommendation (quantity to prepare).
 * Returns the top prediction with the highest confidence.
 * TODO: replace with → fetch(`${BASE_URL}/predictions/today`).then(r => r.json())
 */
export async function getTodayRecommendation() {
  await delay(DELAY_MS);
  const sorted = [...predictionsData].sort((a, b) => b.confidence - a.confidence);
  return sorted[0] ?? null;
}

// ── Recommendations ──────────────────────────────────────────────────────────

/**
 * Fetch all smart recommendation cards.
 * TODO: replace with → fetch(`${BASE_URL}/recommendations`).then(r => r.json())
 */
export async function getRecommendations() {
  await delay(DELAY_MS);
  return [...recommendationsData];
}

// ── Alerts ───────────────────────────────────────────────────────────────────

/**
 * Fetch all alerts.
 * TODO: replace with → fetch(`${BASE_URL}/alerts`).then(r => r.json())
 */
export async function getAlerts() {
  await delay(DELAY_MS);
  return [...alertsData];
}

/**
 * Mark an alert as read.
 * TODO: replace with → fetch(`${BASE_URL}/alerts/${id}/read`, { method: 'PATCH' })
 */
export async function markAlertRead(id) {
  await delay(100);
  return { success: true, id };
}

/**
 * Dismiss (soft-delete) an alert.
 * TODO: replace with → fetch(`${BASE_URL}/alerts/${id}`, { method: 'DELETE' })
 */
export async function dismissAlert(id) {
  await delay(100);
  return { success: true, id };
}

// ── Sustainability ────────────────────────────────────────────────────────────

/**
 * Fetch sustainability impact metrics.
 * TODO: replace with → fetch(`${BASE_URL}/sustainability`).then(r => r.json())
 */
export async function getSustainability() {
  await delay(DELAY_MS);
  return { ...sustainabilityData };
}
