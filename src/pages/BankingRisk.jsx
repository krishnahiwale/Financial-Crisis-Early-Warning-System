import { useEffect } from 'react';
import { motion } from 'framer-motion';
import useStore from '../store/useStore';
import RiskScoreCard from '../components/RiskScoreCard';
import SignalChart from '../components/SignalChart';
import ExplainPanel from '../components/ExplainPanel';
import AlertFeed from '../components/AlertFeed';
import { SIGNALS } from '../utils/mockData';

const BANKING_SIGNALS = SIGNALS.filter(s =>
  ['STLFSI4','TEDRATE','T10Y2Y','BAMLH0','DPCREDIT'].includes(s.id)
);

function InfoCard({ icon, title, value, sub, color }) {
  return (
    <div style={{
      background: 'rgba(13,13,26,0.8)', border: `1px solid ${color}22`,
      borderRadius: '12px', padding: '16px',
    }}>
      <div style={{ fontSize: '20px', marginBottom: '8px' }}>{icon}</div>
      <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: '4px' }}>{title}</div>
      <div style={{ fontSize: '22px', fontWeight: 800, color, letterSpacing: '-0.03em', fontFamily: 'var(--font-mono)' }}>{value}</div>
      <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', marginTop: '4px' }}>{sub}</div>
    </div>
  );
}

export default function BankingRisk() {
  const { riskScores, isLoadingRisk, setSelectedCrisis } = useStore();
  
  useEffect(() => {
    setSelectedCrisis('banking');
  }, [setSelectedCrisis]);

  const fadeUp = (d = 0) => ({
    initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, delay: d, ease: [0.22, 1, 0.36, 1] },
  });

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <motion.div {...fadeUp(0)}>
        <h1 style={{ fontSize: '22px', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '4px' }}>
          🏦 Banking Instability Risk
        </h1>
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-mono)' }}>
          Interbank lending · Credit spreads · Emergency Fed lending · Yield curve
        </p>
      </motion.div>

      {/* KPI row */}
      <motion.div {...fadeUp(0.05)} style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
        <InfoCard icon="📊" title="TED Spread"       value="0.52%" sub="Interbank risk premium" color="#ff6060" />
        <InfoCard icon="📉" title="Yield Curve"      value="-0.31%" sub="T10Y2Y inversion active" color="#ff8c00" />
        <InfoCard icon="🏛️" title="Discount Window" value="$3.2B"  sub="Emergency Fed lending" color="#ffd60a" />
        <InfoCard icon="⚠️" title="Stress Index"    value="1.84"  sub="STLFSI4 · HIGH regime"  color="#ff4060" />
      </motion.div>

      {/* Main cards */}
      <motion.div {...fadeUp(0.1)} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px' }}>
        <RiskScoreCard
          type="banking"
          data={riskScores.banking}
          isLoading={isLoadingRisk}
          isSelected={true}
          onClick={() => {}}
        />
        <SignalChart crisisType="banking" />
      </motion.div>

      {/* SHAP + Alerts */}
      <motion.div {...fadeUp(0.15)} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <ExplainPanel crisisType="banking" />
        <AlertFeed />
      </motion.div>

      {/* Banking-specific signals */}
      <motion.div {...fadeUp(0.2)} style={{
        background: 'rgba(13,13,26,0.8)', border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '16px', padding: '20px',
      }}>
        <h3 style={{ fontSize: '13px', fontWeight: 700, color: 'rgba(255,255,255,0.8)', marginBottom: '16px' }}>
          🔑 Key Banking Indicators
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
          {BANKING_SIGNALS.map(sig => {
            const isUp = sig.change > 0;
            const isCrit = sig.status === 'critical';
            return (
              <div key={sig.id} style={{
                background: isCrit ? 'rgba(255,23,68,0.06)' : 'rgba(255,255,255,0.02)',
                border: `1px solid ${isCrit ? 'rgba(255,23,68,0.2)' : 'rgba(255,255,255,0.06)'}`,
                borderRadius: '10px', padding: '12px',
              }}>
                <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-mono)', marginBottom: '6px' }}>{sig.id}</div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.75)', marginBottom: '4px' }}>{sig.name}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: '18px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: isCrit ? '#ff4060' : 'rgba(255,255,255,0.8)' }}>
                    {sig.value}{sig.unit}
                  </span>
                  <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: isUp ? '#ff8060' : '#22c55e' }}>
                    {isUp ? '▲' : '▼'}{Math.abs(sig.change)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
