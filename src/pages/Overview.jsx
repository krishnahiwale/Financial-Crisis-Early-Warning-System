import { motion } from 'framer-motion';
import useStore from '../store/useStore';
import RiskScoreCard from '../components/RiskScoreCard';
import SignalChart from '../components/SignalChart';
import ExplainPanel from '../components/ExplainPanel';
import AlertFeed from '../components/AlertFeed';
import ContagionMap from '../components/ContagionMap';
import LiveTicker from '../components/LiveTicker';

export default function Overview() {
  const {
    riskScores, isLoadingRisk, selectedCrisis, setSelectedCrisis,
    refreshRiskScores, lastUpdated,
  } = useStore();

  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] },
  });

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', minHeight: '100vh' }}>

      {/* Page header */}
      <motion.div {...fadeUp(0)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '4px' }}>
            System Overview
          </h1>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-mono)' }}>
            3 ML models · 12 FRED signals · Real-time crisis detection
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-mono)' }}>
            Updated: {lastUpdated.toLocaleTimeString()}
          </span>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={refreshRiskScores}
            disabled={isLoadingRisk}
            style={{
              padding: '8px 14px', borderRadius: '8px',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.7)',
              fontSize: '12px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '6px',
              transition: 'all 0.2s',
            }}
          >
            <span style={{
              display: 'inline-block',
              animation: isLoadingRisk ? 'spin-slow 0.8s linear infinite' : 'none',
            }}>↻</span>
            Refresh
          </motion.button>
        </div>
      </motion.div>

      {/* ── Row 1: 3 Risk Cards ─────────────────────────────── */}
      <motion.div {...fadeUp(0.05)} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        {['banking', 'market', 'liquidity'].map((type) => (
          <RiskScoreCard
            key={type}
            type={type}
            data={riskScores[type]}
            isLoading={isLoadingRisk}
            isSelected={selectedCrisis === type}
            onClick={() => setSelectedCrisis(type)}
          />
        ))}
      </motion.div>

      {/* ── Row 2: Chart + SHAP ─────────────────────────────── */}
      <motion.div {...fadeUp(0.1)} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
        <SignalChart crisisType={selectedCrisis} />
        <ExplainPanel crisisType={selectedCrisis} />
      </motion.div>

      {/* ── Row 3: Contagion Map + Alert Feed ───────────────── */}
      <motion.div {...fadeUp(0.15)} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <ContagionMap />
        <AlertFeed />
      </motion.div>

      {/* ── Row 4: Live Ticker ──────────────────────────────── */}
      <motion.div {...fadeUp(0.2)}>
        <LiveTicker />
      </motion.div>
    </div>
  );
}
