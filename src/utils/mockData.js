// ============================================================
// CRISIS SENTINEL — Mock Data Engine
// Simulates real FRED API / ML model output for demo purposes
// ============================================================

import { subDays, format } from 'date-fns';

// ── Helper ───────────────────────────────────────────────────
const rand = (min, max) => Math.random() * (max - min) + min;
const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

// ── Risk Score Simulation ─────────────────────────────────────
export const generateRiskScores = () => ({
  banking: {
    risk_score: parseFloat(rand(42, 71).toFixed(1)),
    confidence_low: parseFloat(rand(30, 45).toFixed(1)),
    confidence_high: parseFloat(rand(72, 85).toFixed(1)),
    alert_level: 'HIGH',
    signal_quality: 'GOOD',
    delta_24h: parseFloat(rand(-5, 8).toFixed(1)),
  },
  market: {
    risk_score: parseFloat(rand(58, 82).toFixed(1)),
    confidence_low: parseFloat(rand(48, 58).toFixed(1)),
    confidence_high: parseFloat(rand(83, 91).toFixed(1)),
    alert_level: 'CRITICAL',
    signal_quality: 'GOOD',
    delta_24h: parseFloat(rand(2, 12).toFixed(1)),
  },
  liquidity: {
    risk_score: parseFloat(rand(25, 48).toFixed(1)),
    confidence_low: parseFloat(rand(15, 25).toFixed(1)),
    confidence_high: parseFloat(rand(49, 62).toFixed(1)),
    alert_level: 'ELEVATED',
    signal_quality: 'PARTIAL',
    delta_24h: parseFloat(rand(-3, 5).toFixed(1)),
  },
});

// ── Historical Time-Series ────────────────────────────────────
export const generateHistoricalScores = (type, days = 60) => {
  const baseValues = { banking: 55, market: 65, liquidity: 35 };
  let current = baseValues[type];
  return Array.from({ length: days }, (_, i) => {
    current = clamp(current + rand(-4, 5), 5, 95);
    return {
      date: format(subDays(new Date(), days - i), 'MMM dd'),
      score: parseFloat(current.toFixed(1)),
      threshold: 50,
    };
  });
};

// ── Signal Data (FRED-like metrics) ──────────────────────────
export const SIGNALS = [
  { id: 'STLFSI4',   name: 'Financial Stress Index',  value: 1.84,  unit: '',     change: +0.23, status: 'warning' },
  { id: 'TEDRATE',   name: 'TED Spread',               value: 0.52,  unit: '%',    change: +0.08, status: 'warning' },
  { id: 'T10Y2Y',    name: 'Yield Curve Spread',       value: -0.31, unit: '%',    change: -0.04, status: 'critical' },
  { id: 'BAMLH0',    name: 'High Yield Spread',        value: 4.12,  unit: '%',    change: +0.31, status: 'elevated' },
  { id: 'VIXCLS',    name: 'VIX Volatility',           value: 28.4,  unit: '',     change: +3.2,  status: 'warning' },
  { id: 'SP500',     name: 'S&P 500 Index',            value: 4892,  unit: '',     change: -68,   status: 'elevated' },
  { id: 'SOFR',      name: 'SOFR Rate',                value: 5.33,  unit: '%',    change: 0.00,  status: 'normal' },
  { id: 'IORB',      name: 'Interest on Reserves',     value: 5.40,  unit: '%',    change: 0.00,  status: 'normal' },
  { id: 'BOGMBASE',  name: 'Monetary Base',            value: 5842,  unit: 'B$',   change: -12,   status: 'elevated' },
  { id: 'DTWEXBGS',  name: 'USD Broad Index',          value: 124.8, unit: '',     change: +1.2,  status: 'warning' },
  { id: 'WRMFSL',    name: 'Money Market Funds',       value: 6102,  unit: 'B$',   change: +89,   status: 'warning' },
  { id: 'DPCREDIT',  name: 'Discount Window Credit',   value: 3.2,   unit: 'B$',   change: +0.8,  status: 'critical' },
];

// ── SHAP Explanations ─────────────────────────────────────────
export const SHAP_DRIVERS = {
  banking: [
    { feature: 'TED Spread (7d change)',      contribution: 0.182, direction: 'increases' },
    { feature: 'Yield Curve Inversion',       contribution: 0.167, direction: 'increases' },
    { feature: 'Discount Window Credit',      contribution: 0.143, direction: 'increases' },
    { feature: 'Financial Stress Index',      contribution: 0.118, direction: 'increases' },
    { feature: 'Money Market Funds (30d)',     contribution: 0.073, direction: 'decreases' },
  ],
  market: [
    { feature: 'VIX Volatility (7d change)',  contribution: 0.241, direction: 'increases' },
    { feature: 'S&P 500 (30d momentum)',      contribution: 0.198, direction: 'increases' },
    { feature: 'High Yield Spread',           contribution: 0.155, direction: 'increases' },
    { feature: 'USD Broad Index',             contribution: 0.109, direction: 'increases' },
    { feature: 'SOFR Rate (7d change)',       contribution: 0.044, direction: 'decreases' },
  ],
  liquidity: [
    { feature: 'SOFR Rate',                   contribution: 0.156, direction: 'increases' },
    { feature: 'Monetary Base (30d change)',  contribution: 0.134, direction: 'decreases' },
    { feature: 'Money Market Funds',          contribution: 0.121, direction: 'increases' },
    { feature: 'TED Spread',                  contribution: 0.098, direction: 'increases' },
    { feature: 'Interest on Reserves',        contribution: 0.062, direction: 'increases' },
  ],
};

// ── Alert Feed ────────────────────────────────────────────────
export const ALERTS = [
  {
    id: '1',
    timestamp: new Date(Date.now() - 1000 * 60 * 3),
    type: 'market',
    level: 'CRITICAL',
    title: 'VIX Spike Detected — 28.4 (+12.7%)',
    detail: 'VIX crossed the 25-point threshold. Historical precedent indicates elevated probability of S&P correction within 10 days.',
    signals: ['VIX: 28.4', 'S&P: -1.4%'],
    acknowledged: false,
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 1000 * 60 * 18),
    type: 'banking',
    level: 'HIGH',
    title: 'Yield Curve Inversion Deepened to -0.31%',
    detail: 'T10Y2Y spread turned negative, a historically reliable 12-18 month recession predictor. Banking sector stress models elevated.',
    signals: ['T10Y2Y: -0.31%', 'TED: 0.52%'],
    acknowledged: false,
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 1000 * 60 * 47),
    type: 'banking',
    level: 'HIGH',
    title: 'Discount Window Usage Up $0.8B',
    detail: 'Emergency Fed lending climbed. Historically a leading indicator of banking stress. Monitoring TED spread correlation.',
    signals: ['Discount: $3.2B', 'TED: 0.52%'],
    acknowledged: true,
  },
  {
    id: '4',
    timestamp: new Date(Date.now() - 1000 * 60 * 92),
    type: 'liquidity',
    level: 'ELEVATED',
    title: 'Money Market Inflows Surge $89B',
    detail: 'Flight-to-safety signal. Retail and institutional investors rotating out of equities into money market instruments.',
    signals: ['MMF: $6.1T', 'SOFR: 5.33%'],
    acknowledged: true,
  },
  {
    id: '5',
    timestamp: new Date(Date.now() - 1000 * 60 * 180),
    type: 'market',
    level: 'ELEVATED',
    title: 'USD Broad Index at 14-Month High',
    detail: 'DXY strength is compressing emerging market dollar-denominated debt. Contagion risk index elevated at 0.74.',
    signals: ['USD Index: 124.8', 'EM Debt: -2.1%'],
    acknowledged: true,
  },
];

// ── Contagion Map Data ────────────────────────────────────────
export const CONTAGION_DATA = [
  { region: 'North America', lat: 40.7, lon: -74.0, risk: 74, label: 'USA' },
  { region: 'Europe',        lat: 51.5, lon: -0.1,  risk: 58, label: 'UK' },
  { region: 'Europe',        lat: 48.9, lon: 2.3,   risk: 62, label: 'France' },
  { region: 'Asia Pacific',  lat: 35.7, lon: 139.7, risk: 45, label: 'Japan' },
  { region: 'Asia Pacific',  lat: 22.3, lon: 114.2, risk: 68, label: 'HK' },
  { region: 'Emerging',      lat: 23.1, lon: 113.3, risk: 52, label: 'China' },
  { region: 'Emerging',      lat: -23,  lon: -43.2, risk: 41, label: 'Brazil' },
  { region: 'Emerging',      lat: 28.6, lon: 77.2,  risk: 38, label: 'India' },
];

// ── Model Performance Metrics ─────────────────────────────────
export const MODEL_METRICS = {
  banking:   { auroc: 0.912, precision: 0.847, recall: 0.881, f1: 0.864, falseAlarm: 0.088 },
  market:    { auroc: 0.934, precision: 0.871, recall: 0.903, f1: 0.887, falseAlarm: 0.071 },
  liquidity: { auroc: 0.889, precision: 0.823, recall: 0.857, f1: 0.840, falseAlarm: 0.101 },
};

// ── Contagion Score ───────────────────────────────────────────
export const CONTAGION_SCORE = 0.74;

// ── Signal Sparkline Data ─────────────────────────────────────
export const generateSparkline = (baseline, volatility = 1, points = 30) => {
  let v = baseline;
  return Array.from({ length: points }, () => {
    v = clamp(v + rand(-volatility, volatility), baseline * 0.7, baseline * 1.5);
    return parseFloat(v.toFixed(2));
  });
};
