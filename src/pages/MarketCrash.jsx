import { useEffect } from 'react';
import { motion } from 'framer-motion';
import useStore from '../store/useStore';
import RiskScoreCard from '../components/RiskScoreCard';
import SignalChart from '../components/SignalChart';
import ExplainPanel from '../components/ExplainPanel';
import { SIGNALS } from '../utils/mockData';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts';

const MARKET_SIGNALS = SIGNALS.filter(s =>
  ['VIXCLS','SP500','BAMLH0','DTWEXBGS'].includes(s.id)
);

const VIX_REGIMES = [
  { label: 'Low (<15)',     value: 24, color: '#22c55e' },
  { label: 'Normal (15-20)',value: 38, color: '#3b82f6' },
  { label: 'Elevated (20-30)',value: 22, color: '#ffd60a' },
  { label: 'Stress (30-40)', value: 11, color: '#ff8c00' },
  { label: 'Crisis (40+)',   value: 5,  color: '#ff1744' },
];

export default function MarketCrash() {
  const { riskScores, isLoadingRisk, setSelectedCrisis } = useStore();
  
  useEffect(() => {
    setSelectedCrisis('market');
  }, [setSelectedCrisis]);

  const fadeUp = (d = 0) => ({
    initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, delay: d, ease: [0.22, 1, 0.36, 1] },
  });

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <motion.div {...fadeUp(0)}>
        <h1 style={{ fontSize: '22px', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '4px' }}>
          📉 Market Crash Risk
        </h1>
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-mono)' }}>
          VIX · S&amp;P 500 · High-yield spreads · Dollar strength · Contagion
        </p>
      </motion.div>

      {/* KPI row */}
      <motion.div {...fadeUp(0.05)} style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
        {[
          { icon: '😱', title: 'VIX Fear Gauge',  value: '28.4',  sub: '+12.7% this week',    color: '#ff4060' },
          { icon: '📊', title: 'S&P 500',          value: '4,892', sub: '−1.4% today',          color: '#ff8c00' },
          { icon: '💥', title: 'HY Spread',        value: '4.12%', sub: 'Credit stress elevated', color: '#ffd60a' },
          { icon: '💵', title: 'USD Index',         value: '124.8', sub: '14-month high',          color: '#3b82f6' },
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
        <RiskScoreCard type="market" data={riskScores.market} isLoading={isLoadingRisk} isSelected={true} onClick={() => {}} />
        <SignalChart crisisType="market" />
      </motion.div>

      {/* VIX regime + SHAP */}
      <motion.div {...fadeUp(0.15)} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {/* VIX Regime Distribution */}
        <div style={{
          background: 'rgba(13,13,26,0.8)', border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '16px', padding: '20px',
        }}>
          <h3 style={{ fontSize: '13px', fontWeight: 700, color: 'rgba(255,255,255,0.8)', marginBottom: '4px' }}>
            📈 VIX Regime Distribution
          </h3>
          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-mono)', marginBottom: '18px' }}>
            % of trading days 2000–2024
          </p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={VIX_REGIMES} margin={{ left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 9, fontFamily: 'var(--font-mono)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: 'rgba(13,13,26,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }}
                cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                formatter={(v) => [`${v}%`, 'Frequency']}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {VIX_REGIMES.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <ExplainPanel crisisType="market" />
      </motion.div>

      {/* Market signals */}
      <motion.div {...fadeUp(0.2)} style={{
        background: 'rgba(13,13,26,0.8)', border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '16px', padding: '20px',
      }}>
        <h3 style={{ fontSize: '13px', fontWeight: 700, color: 'rgba(255,255,255,0.8)', marginBottom: '14px' }}>
          🔑 Key Market Indicators
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
          {MARKET_SIGNALS.map(sig => {
            const isCrit = sig.status === 'critical' || sig.status === 'warning';
            const color = sig.status === 'critical' ? '#ff4060' : sig.status === 'warning' ? '#ff8c00' : sig.status === 'elevated' ? '#ffd60a' : '#22c55e';
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
