import { motion } from 'framer-motion';
import ModelMetrics from '../components/ModelMetrics';
import { MODEL_METRICS } from '../utils/mockData';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts';

const AUROC_HISTORY = Array.from({ length: 12 }, (_, i) => ({
  month: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i],
  banking:   +(0.88 + Math.sin(i * 0.5) * 0.02 + i * 0.003).toFixed(3),
  market:    +(0.90 + Math.sin(i * 0.4) * 0.015 + i * 0.003).toFixed(3),
  liquidity: +(0.85 + Math.sin(i * 0.6) * 0.02 + i * 0.003).toFixed(3),
}));

const RADAR_COMPARE = [
  { subject: 'AUROC',     banking: 91.2, market: 93.4, liquidity: 88.9 },
  { subject: 'Precision', banking: 84.7, market: 87.1, liquidity: 82.3 },
  { subject: 'Recall',    banking: 88.1, market: 90.3, liquidity: 85.7 },
  { subject: 'F1 Score',  banking: 86.4, market: 88.7, liquidity: 84.0 },
  { subject: 'Specificity',banking: 91.2,market: 92.9, liquidity: 89.9 },
];

const TECH_STACK = [
  { name: 'Random Forest',           role: 'Banking & Liquidity base learner', color: '#ff6060' },
  { name: 'Gradient Boosting (GBM)', role: 'Market crash base learner',        color: '#ff8c00' },
  { name: 'Isotonic Calibration',    role: 'Probability calibration layer',    color: '#ffd60a' },
  { name: 'SHAP TreeExplainer',      role: 'Local + global feature attribution', color: '#a855f7' },
  { name: 'Bootstrap CI',            role: 'Uncertainty quantification (n=100)', color: '#3b82f6' },
  { name: 'APScheduler',             role: 'Hourly data pull + model refresh',  color: '#22c55e' },
];

export default function ModelPage() {
  const fadeUp = (d = 0) => ({
    initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, delay: d, ease: [0.22, 1, 0.36, 1] },
  });

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <motion.div {...fadeUp(0)}>
        <h1 style={{ fontSize: '22px', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '4px' }}>
          🤖 ML Model Performance
        </h1>
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-mono)' }}>
          3 calibrated ensemble models · Evaluated on 2007–2023 crisis episodes
        </p>
      </motion.div>

      {/* Summary AUROC badges */}
      <motion.div {...fadeUp(0.05)} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
        {[
          { type: 'banking',   label: 'Banking Model',   color: '#ff6060', algo: 'Calibrated Random Forest' },
          { type: 'market',    label: 'Market Model',    color: '#ff8c00', algo: 'Calibrated Gradient Boost' },
          { type: 'liquidity', label: 'Liquidity Model', color: '#3b82f6', algo: 'Calibrated Random Forest' },
        ].map(m => {
          const metrics = MODEL_METRICS[m.type];
          return (
            <div key={m.type} style={{
              background: 'rgba(13,13,26,0.8)', border: `1px solid ${m.color}22`,
              borderRadius: '14px', padding: '20px',
              display: 'flex', flexDirection: 'column', gap: '10px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.7)' }}>{m.label}</div>
                  <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>{m.algo}</div>
                </div>
                <div style={{
                  fontSize: '24px', fontWeight: 900, color: m.color,
                  fontFamily: 'var(--font-mono)', letterSpacing: '-0.04em',
                }}>
                  {(metrics.auroc * 100).toFixed(1)}
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>%</span>
                </div>
              </div>
              <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.25)', fontFamily: 'var(--font-mono)' }}>AUROC</div>
              <div style={{ height: '5px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                <motion.div
                  initial={{ width: 0 }} animate={{ width: `${metrics.auroc * 100}%` }}
                  transition={{ delay: 0.3, duration: 0.7, ease: 'easeOut' }}
                  style={{ height: '100%', background: `linear-gradient(90deg, ${m.color}80, ${m.color})`, borderRadius: '3px' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '12px', fontSize: '10px', fontFamily: 'var(--font-mono)' }}>
                {[['P', metrics.precision], ['R', metrics.recall], ['F1', metrics.f1]].map(([k, v]) => (
                  <div key={k}>
                    <span style={{ color: 'rgba(255,255,255,0.3)' }}>{k}: </span>
                    <span style={{ color: m.color }}>{(v * 100).toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* AUROC trend + Radar */}
      <motion.div {...fadeUp(0.1)} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
        {/* AUROC trend chart */}
        <div style={{
          background: 'rgba(13,13,26,0.8)', border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '16px', padding: '20px',
        }}>
          <h3 style={{ fontSize: '13px', fontWeight: 700, color: 'rgba(255,255,255,0.8)', marginBottom: '4px' }}>
            📈 AUROC Over Time
          </h3>
          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-mono)', marginBottom: '16px' }}>
            Rolling monthly evaluation on held-out windows
          </p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={AUROC_HISTORY} margin={{ left: -20, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10, fontFamily: 'var(--font-mono)' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0.82, 0.97]} tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: 'rgba(13,13,26,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '11px' }}
                formatter={(v, n) => [(v * 100).toFixed(2) + '%', n.charAt(0).toUpperCase() + n.slice(1)]}
              />
              <Line type="monotone" dataKey="banking"   stroke="#ff6060" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="market"    stroke="#ff8c00" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="liquidity" stroke="#3b82f6" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '8px' }}>
            {[['banking','#ff6060'],['market','#ff8c00'],['liquidity','#3b82f6']].map(([k,c]) => (
              <div key={k} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>
                <div style={{ width: 20, height: 2, background: c, borderRadius: 1 }} />
                {k.charAt(0).toUpperCase() + k.slice(1)}
              </div>
            ))}
          </div>
        </div>

        {/* Radar comparison */}
        <div style={{
          background: 'rgba(13,13,26,0.8)', border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '16px', padding: '20px',
        }}>
          <h3 style={{ fontSize: '13px', fontWeight: 700, color: 'rgba(255,255,255,0.8)', marginBottom: '4px' }}>
            🕸️ Model Comparison
          </h3>
          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-mono)', marginBottom: '4px' }}>
            All metrics ×100
          </p>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={RADAR_COMPARE}>
              <PolarGrid stroke="rgba(255,255,255,0.07)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 9, fontFamily: 'var(--font-mono)' }} />
              <Radar name="Banking"   dataKey="banking"   stroke="#ff6060" fill="#ff6060" fillOpacity={0.1} strokeWidth={1.5} />
              <Radar name="Market"    dataKey="market"    stroke="#ff8c00" fill="#ff8c00" fillOpacity={0.1} strokeWidth={1.5} />
              <Radar name="Liquidity" dataKey="liquidity" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} strokeWidth={1.5} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Detailed metrics */}
      <motion.div {...fadeUp(0.15)}>
        <ModelMetrics />
      </motion.div>

      {/* Tech stack */}
      <motion.div {...fadeUp(0.2)} style={{
        background: 'rgba(13,13,26,0.8)', border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '16px', padding: '20px',
      }}>
        <h3 style={{ fontSize: '13px', fontWeight: 700, color: 'rgba(255,255,255,0.8)', marginBottom: '14px' }}>
          ⚙️ ML Stack Components
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
          {TECH_STACK.map(t => (
            <div key={t.name} style={{
              background: `${t.color}08`, border: `1px solid ${t.color}20`,
              borderRadius: '10px', padding: '12px 14px',
            }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: t.color, marginBottom: '4px' }}>{t.name}</div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.4 }}>{t.role}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
