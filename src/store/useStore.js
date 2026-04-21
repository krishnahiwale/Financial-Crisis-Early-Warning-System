import { create } from 'zustand';
import {
  generateRiskScores,
  generateHistoricalScores,
  ALERTS,
  SIGNALS,
  CONTAGION_SCORE,
} from '../utils/mockData';

const useStore = create((set, get) => ({
  // ── Auth ─────────────────────────────────────────────────────
  isAuthenticated: false,
  user: null,
  login: (email, password) => {
    // Demo: accept any credentials with valid format
    if (email && password.length >= 6) {
      set({
        isAuthenticated: true,
        user: { email, name: email.split('@')[0], role: 'Analyst' },
      });
      return true;
    }
    return false;
  },
  logout: () => set({ isAuthenticated: false, user: null }),

  // ── Navigation ────────────────────────────────────────────────
  activePage: 'overview',
  setActivePage: (page) => set({ activePage: page }),

  // ── Selected Crisis Type ──────────────────────────────────────
  selectedCrisis: 'banking',
  setSelectedCrisis: (type) => set({ selectedCrisis: type }),

  // ── Risk Scores ───────────────────────────────────────────────
  riskScores: generateRiskScores(),
  isLoadingRisk: false,
  lastUpdated: new Date(),
  refreshRiskScores: () => {
    set({ isLoadingRisk: true });
    setTimeout(() => {
      set({
        riskScores: generateRiskScores(),
        lastUpdated: new Date(),
        isLoadingRisk: false,
      });
    }, 1200);
  },

  // ── Historical Data ───────────────────────────────────────────
  historicalData: {
    banking:   generateHistoricalScores('banking'),
    market:    generateHistoricalScores('market'),
    liquidity: generateHistoricalScores('liquidity'),
  },

  // ── Alerts ───────────────────────────────────────────────────
  alerts: ALERTS,
  unreadCount: ALERTS.filter(a => !a.acknowledged).length,
  acknowledgeAlert: (id) => {
    const updated = get().alerts.map(a =>
      a.id === id ? { ...a, acknowledged: true } : a
    );
    set({
      alerts: updated,
      unreadCount: updated.filter(a => !a.acknowledged).length,
    });
  },

  // ── Signals ───────────────────────────────────────────────────
  signals: SIGNALS,

  // ── Contagion ─────────────────────────────────────────────────
  contagionScore: CONTAGION_SCORE,

  // ── WebSocket Connection Status ───────────────────────────────
  wsConnected: true,
  setWsConnected: (v) => set({ wsConnected: v }),

  // ── Live Ticker ───────────────────────────────────────────────
  ticker: [],
  addTicker: (item) => set((s) => ({
    ticker: [item, ...s.ticker].slice(0, 50),
  })),
}));

export default useStore;
