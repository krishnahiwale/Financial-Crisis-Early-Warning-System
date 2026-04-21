import { motion } from 'framer-motion';
import SignalPanel from '../components/SignalPanel';
import ContagionMap from '../components/ContagionMap';
import LiveTicker from '../components/LiveTicker';

export default function SignalsPage() {
  const fadeUp = (d = 0) => ({
    initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, delay: d, ease: [0.22, 1, 0.36, 1] },
  });

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <motion.div {...fadeUp(0)}>
        <h1 style={{ fontSize: '22px', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '4px' }}>
          📡 Signal Monitor
        </h1>
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-mono)' }}>
          12 live FRED indicators · 840K series available · Auto-refreshed every 60s
        </p>
      </motion.div>

      {/* Data source badges */}
      <motion.div {...fadeUp(0.05)} style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {[
          { label: 'FRED API',       sub: '840K series', color: '#22c55e' },
          { label: 'OFR FSI',        sub: 'Systemic stress', color: '#3b82f6' },
          { label: 'Alpha Vantage',  sub: 'Markets', color: '#ffd60a' },
          { label: 'World Bank',     sub: 'Sovereign data', color: '#a855f7' },
          { label: 'NewsAPI',        sub: 'Sentiment NLP', color: '#ff8c00' },
        ].map(s => (
          <div key={s.label} style={{
            padding: '8px 14px', borderRadius: '8px',
            background: `${s.color}0d`, border: `1px solid ${s.color}25`,
          }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: s.color }}>{s.label}</div>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-mono)' }}>{s.sub}</div>
          </div>
        ))}
      </motion.div>

      <motion.div {...fadeUp(0.1)}>
        <SignalPanel />
      </motion.div>

      <motion.div {...fadeUp(0.15)} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <ContagionMap />
        <LiveTicker />
      </motion.div>

      {/* API info */}
      <motion.div {...fadeUp(0.2)} style={{
        background: 'rgba(13,13,26,0.8)', border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '16px', padding: '20px',
      }}>
        <h3 style={{ fontSize: '13px', fontWeight: 700, color: 'rgba(255,255,255,0.8)', marginBottom: '12px' }}>
          💡 About This Data
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '12px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>
          <div>
            <p><strong style={{ color: 'rgba(255,255,255,0.7)' }}>St. Louis Fed STLFSI4</strong></p>
            <p>Constructed from 18 key financial market indicators: 7 interest rates, 6 yield spreads, and 5 other indicators. A reading above zero indicates stress above the long-run average.</p>
          </div>
          <div>
            <p><strong style={{ color: 'rgba(255,255,255,0.7)' }}>Update Frequency</strong></p>
            <p>FRED series update weekly or daily depending on the indicator. The backend scheduler pulls all 12 series every hour and stores observations in TimescaleDB for trend analysis.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
