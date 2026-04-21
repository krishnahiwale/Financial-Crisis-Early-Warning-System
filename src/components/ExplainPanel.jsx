import { motion } from 'framer-motion';
import { SHAP_DRIVERS } from '../utils/mockData';

const DIR_CONFIG = {
  increases: { color: '#ff6060', arrow: '▲', label: 'Risk ↑' },
  decreases: { color: '#22c55e', arrow: '▼', label: 'Risk ↓' },
};

const CRISIS_LABELS = {
  banking:   '🏦 Banking',
  market:    '📉 Market',
  liquidity: '💧 Liquidity',
};

export default function ExplainPanel({ crisisType }) {
  const drivers = SHAP_DRIVERS[crisisType] || [];
  const maxContrib = Math.max(...drivers.map(d => d.contribution));

  return (
    <div style={{
      background: 'rgba(13,13,26,0.8)', border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: '16px', padding: '20px', height: '100%',
    }}>
      {/* Header */}
      <div style={{ marginBottom: '18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <h3 style={{ fontSize: '13px', fontWeight: 700, color: 'rgba(255,255,255,0.8)' }}>
            🔍 Why This Score?
          </h3>
          <span style={{
            fontSize: '10px', padding: '2px 7px', borderRadius: '4px',
            background: 'rgba(168,85,247,0.12)', color: 'rgba(168,85,247,0.9)',
            border: '1px solid rgba(168,85,247,0.2)',
            fontFamily: 'var(--font-mono)',
          }}>
            SHAP
          </span>
        </div>
        <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-mono)' }}>
          Top 5 drivers · {CRISIS_LABELS[crisisType]} model
        </p>
      </div>

      {/* Driver bars */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {drivers.map((driver, i) => {
          const dir = DIR_CONFIG[driver.direction];
          const widthPct = (driver.contribution / maxContrib) * 100;
          return (
            <motion.div
              key={driver.feature}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span style={{
                  fontSize: '11px', color: 'rgba(255,255,255,0.7)',
                  maxWidth: '65%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }} title={driver.feature}>
                  {driver.feature}
                </span>
                <span style={{
                  fontSize: '11px', fontFamily: 'var(--font-mono)',
                  color: dir.color, fontWeight: 600,
                }}>
                  {dir.arrow} {driver.contribution.toFixed(3)}
                </span>
              </div>
              <div style={{
                height: '6px', background: 'rgba(255,255,255,0.06)',
                borderRadius: '3px', overflow: 'hidden',
              }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${widthPct}%` }}
                  transition={{ delay: i * 0.07 + 0.1, duration: 0.5, ease: 'easeOut' }}
                  style={{
                    height: '100%', borderRadius: '3px',
                    background: `linear-gradient(90deg, ${dir.color}aa, ${dir.color})`,
                  }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Legend */}
      <div style={{
        marginTop: '20px', paddingTop: '14px',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        display: 'flex', gap: '16px', fontSize: '10px', fontFamily: 'var(--font-mono)',
        color: 'rgba(255,255,255,0.3)',
      }}>
        <span><span style={{ color: '#ff6060' }}>▲</span> Increases risk</span>
        <span><span style={{ color: '#22c55e' }}>▼</span> Reduces risk</span>
        <span style={{ marginLeft: 'auto' }}>Bar = magnitude</span>
      </div>

      <div style={{
        marginTop: '10px', fontSize: '10px', color: 'rgba(255,255,255,0.2)',
        fontFamily: 'var(--font-mono)', lineHeight: 1.4,
      }}>
        SHapley Additive exPlanations — Lundberg &amp; Lee (2017)
      </div>
    </div>
  );
}
