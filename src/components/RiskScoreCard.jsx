import { motion } from 'framer-motion';

const ALERT_CONFIG = {
  CRITICAL: { bg: 'rgba(255,23,68,0.12)',  border: 'rgba(255,23,68,0.4)',  text: '#ff4060', label: 'CRITICAL', pulse: true },
  HIGH:     { bg: 'rgba(255,109,0,0.10)', border: 'rgba(255,109,0,0.35)', text: '#ff8c00', label: 'HIGH',     pulse: false },
  ELEVATED: { bg: 'rgba(255,214,0,0.08)', border: 'rgba(255,214,0,0.3)',  text: '#ffd60a', label: 'ELEVATED', pulse: false },
  MODERATE: { bg: 'rgba(41,121,255,0.08)',border: 'rgba(41,121,255,0.3)', text: '#3b82f6', label: 'MODERATE', pulse: false },
  LOW:      { bg: 'rgba(0,230,118,0.06)', border: 'rgba(0,230,118,0.25)',  text: '#22c55e', label: 'LOW',      pulse: false },
};

const CRISIS_META = {
  banking:   { label: 'Banking Instability', icon: '🏦', desc: 'Interbank & Credit Risk' },
  market:    { label: 'Market Crash Risk',   icon: '📉', desc: 'Equity & Volatility' },
  liquidity: { label: 'Liquidity Shortage',  icon: '💧', desc: 'Money Market Stress' },
};

export default function RiskScoreCard({ type, data, isLoading, isSelected, onClick }) {
  if (isLoading || !data) {
    return (
      <div style={{
        borderRadius: '16px', height: '188px',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))',
        border: '1px solid rgba(255,255,255,0.06)',
        animation: 'pulse-ring 2s ease-out infinite',
      }} />
    );
  }

  const alert = data.alert_level || 'LOW';
  const cfg = ALERT_CONFIG[alert];
  const meta = CRISIS_META[type];
  const isUp = data.delta_24h > 0;

  return (
    <motion.div
      id={`risk-card-${type}`}
      layout
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      style={{
        cursor: 'pointer', borderRadius: '16px', padding: '22px',
        background: cfg.bg,
        border: `1px solid ${isSelected ? cfg.text : cfg.border}`,
        boxShadow: isSelected ? `0 0 0 1px ${cfg.border}, 0 8px 32px rgba(0,0,0,0.4)` : 'none',
        transition: 'border-color 0.2s, box-shadow 0.2s',
        position: 'relative', overflow: 'hidden',
      }}
    >
      {/* Animated glow blob */}
      <div style={{
        position: 'absolute', top: '-40px', right: '-40px',
        width: '120px', height: '120px', borderRadius: '50%',
        background: `radial-gradient(circle, ${cfg.text}22 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>{meta.icon}</span> {meta.label}
          </div>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-mono)' }}>{meta.desc}</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
          <span style={{
            fontSize: '10px', fontWeight: 700, padding: '3px 8px', borderRadius: '6px',
            background: `${cfg.text}20`, color: cfg.text,
            border: `1px solid ${cfg.text}40`,
            letterSpacing: '0.08em',
            ...(cfg.pulse ? { animation: 'blink 1.4s ease-in-out infinite' } : {}),
          }}>
            {cfg.label}
          </span>
        </div>
      </div>

      {/* Score */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', marginBottom: '10px' }}>
        <motion.span
          key={data.risk_score}
          initial={{ y: 8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          style={{
            fontSize: '52px', fontWeight: 900, lineHeight: 1,
            color: cfg.text, letterSpacing: '-0.04em',
          }}
        >
          {data.risk_score?.toFixed(1)}
        </motion.span>
        <div style={{ paddingBottom: '8px' }}>
          <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.3)' }}>/100</div>
          <div style={{
            fontSize: '11px', fontFamily: 'var(--font-mono)',
            color: isUp ? '#ff6060' : '#22c55e',
          }}>
            {isUp ? '▲' : '▼'} {Math.abs(data.delta_24h).toFixed(1)} 24h
          </div>
        </div>
      </div>

      {/* Confidence interval */}
      <div style={{ marginBottom: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-mono)', marginBottom: '4px' }}>
          <span>95% Confidence Interval</span>
          <span>[{data.confidence_low?.toFixed(1)} — {data.confidence_high?.toFixed(1)}]</span>
        </div>
        <div style={{ height: '4px', background: 'rgba(255,255,255,0.07)', borderRadius: '2px', position: 'relative' }}>
          <div style={{
            position: 'absolute',
            left: `${data.confidence_low}%`, width: `${data.confidence_high - data.confidence_low}%`,
            height: '100%', borderRadius: '2px',
            background: `linear-gradient(90deg, ${cfg.text}60, ${cfg.text}aa, ${cfg.text}60)`,
          }} />
          <div style={{
            position: 'absolute', left: `${data.risk_score}%`,
            width: '2px', height: '8px', top: '-2px',
            background: cfg.text, borderRadius: '1px',
          }} />
        </div>
      </div>

      {/* Signal quality */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px' }}>
        <span style={{
          width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
          background: data.signal_quality === 'GOOD' ? '#22c55e' : data.signal_quality === 'PARTIAL' ? '#ffd60a' : '#ff6060',
        }} />
        <span style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-mono)' }}>
          Signal: {data.signal_quality}
        </span>
        {isSelected && (
          <span style={{ marginLeft: 'auto', color: cfg.text, fontSize: '10px' }}>● Selected</span>
        )}
      </div>
    </motion.div>
  );
}
