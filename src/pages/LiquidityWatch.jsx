import { useEffect } from 'react';
import { motion } from 'framer-motion';
import useStore from '../store/useStore';
import RiskScoreCard from '../components/RiskScoreCard';
import SignalChart from '../components/SignalChart';
import ExplainPanel from '../components/ExplainPanel';
import { SIGNALS } from '../utils/mockData';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
} from 'recharts';

const LIQ_SIGNALS = SIGNALS.filter(s =>
  ['SOFR','IORB','WRMFSL','BOGMBASE'].includes(s.id)
);

const RADAR_DATA = [
  { subject: 'SOFR Pressure',  A: 72 },
  { subject: 'MMF Inflows',    A: 68 },
  { subject: 'Reserve Drain',  A: 45 },
  { subject: 'Repo Stress',    A: 38 },
  { subject: 'FX Swap Demand', A: 55 },
  { subject: 'TBill Demand',   A: 61 },
];

export default function LiquidityWatch() {
  const { riskScores, isLoadingRisk, setSelectedCrisis } = useStore();
  
  useEffect(() => {
    setSelectedCrisis('liquidity');
  }, [setSelectedCrisis]);

  const fadeUp = (d = 0) => ({
    initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, delay: d, ease: [0.22, 1, 0.36, 1] },
  });

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <motion.div {...fadeUp(0)}>
        <h1 style={{ fontSize: '22px', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '4px' }}>
          💧 Liquidity Shortage Watch
        </h1>
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-mono)' }}>
          SOFR · Money market funds · Monetary base · Reserve requirements
        </p>
      </motion.div>

      {/* KPIs */}
      <motion.div {...fadeUp(0.05)} style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
        {[
          { icon: '💵', title: 'SOFR Rate',     value: '5.33%', sub: 'Stable · within target', color: '#3b82f6' },
          { icon: '🏦', title: 'MMF Total',      value: '$6.1T', sub: '+$89B inflows (7d)',     color: '#ffd60a' },
          { icon: '💰', title: 'Monetary Base',  value: '$5.8T', sub: '−$12B monthly',          color: '#ff8c00' },
          { icon: '📦', title: 'Reserve Rate',  value: '5.40%', sub: 'Interest on reserves',    color: '#22c55e' },
        ].map(c => (
          <div key={c.title} style={{
            background: 'rgba(13,13,26,0.8)', border: `1px solid ${c.color}22`,
            borderRadius: '12px', padding: '16px',
          }}>
            <div style={{ fontSize: '20px', marginBottom: '8px' }}>{c.icon}</div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: '4px' }}>{c.title}</div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: c.color, letterSpacing: '-0.03em', fontFamily: 'var(--font-mono)' }}>{c.value}</div>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', marginTop: '4px' }}>{c.sub}</div>
          </div>
        ))}
      </motion.div>

      {/* Risk card + chart */}
      <motion.div {...fadeUp(0.1)} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px' }}>
        <RiskScoreCard type="liquidity" data={riskScores.liquidity} isLoading={isLoadingRisk} isSelected={true} onClick={() => {}} />
        <SignalChart crisisType="liquidity" />
      </motion.div>

      {/* Radar + SHAP */}
      <motion.div {...fadeUp(0.15)} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {/* Liquidity Radar */}
        <div style={{
          background: 'rgba(13,13,26,0.8)', border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '16px', padding: '20px',
        }}>
          <h3 style={{ fontSize: '13px', fontWeight: 700, color: 'rgba(255,255,255,0.8)', marginBottom: '4px' }}>
            🕸️ Liquidity Stress Radar
          </h3>
          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-mono)', marginBottom: '8px' }}>
            Multi-dimension stress scoring (0–100)
          </p>
          <ResponsiveContainer width="100%" height={210}>
            <RadarChart data={RADAR_DATA}>
              <PolarGrid stroke="rgba(255,255,255,0.07)" />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 9, fontFamily: 'var(--font-mono)' }}
              />
              <Radar
                name="Stress"
                dataKey="A"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.18}
                strokeWidth={1.5}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <ExplainPanel crisisType="liquidity" />
      </motion.div>

      {/* Liquidity signals */}
      <motion.div {...fadeUp(0.2)} style={{
        background: 'rgba(13,13,26,0.8)', border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '16px', padding: '20px',
      }}>
        <h3 style={{ fontSize: '13px', fontWeight: 700, color: 'rgba(255,255,255,0.8)', marginBottom: '14px' }}>
          🔑 Key Liquidity Indicators
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
          {LIQ_SIGNALS.map(sig => {
            const color = sig.status === 'critical' ? '#ff4060' : sig.status === 'warning' ? '#ff8c00' : sig.status === 'elevated' ? '#ffd60a' : '#3b82f6';
            return (
              <div key={sig.id} style={{
                background: 'rgba(255,255,255,0.02)', border: `1px solid ${color}22`,
                borderRadius: '10px', padding: '14px',
              }}>
                <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-mono)', marginBottom: '6px' }}>{sig.id}</div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.65)', marginBottom: '8px', lineHeight: 1.3 }}>{sig.name}</div>
                <div style={{ fontSize: '20px', fontWeight: 800, color, fontFamily: 'var(--font-mono)' }}>
                  {sig.value}{sig.unit}
                </div>
                <div style={{ fontSize: '10px', color: sig.change > 0 ? '#ff8060' : '#22c55e', marginTop: '4px', fontFamily: 'var(--font-mono)' }}>
                  {sig.change > 0 ? '▲' : '▼'} {Math.abs(sig.change)}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
