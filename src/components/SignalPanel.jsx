import { SIGNALS } from '../utils/mockData';

const STATUS_CONFIG = {
  critical: { color: '#ff1744', bg: 'rgba(255,23,68,0.1)',  label: 'CRITICAL' },
  warning:  { color: '#ff8c00', bg: 'rgba(255,140,0,0.08)', label: 'WARNING'  },
  elevated: { color: '#ffd600', bg: 'rgba(255,214,0,0.07)', label: 'ELEVATED' },
  normal:   { color: '#22c55e', bg: 'rgba(34,197,94,0.06)', label: 'NORMAL'   },
};

function SparkBar({ value, max }) {
  const pct = Math.min(Math.abs(value / max) * 100, 100);
  const isNeg = value < 0;
  return (
    <div style={{ width: '60px', height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
      <div style={{
        height: '100%',
        width: `${pct}%`,
        background: isNeg ? '#ff4060' : value > 0 ? '#ff8c00' : '#22c55e',
        borderRadius: '2px',
        marginLeft: isNeg ? `${100 - pct}%` : 0,
        transition: 'width 0.4s ease',
      }} />
    </div>
  );
}

export default function SignalPanel() {
  return (
    <div style={{
      background: 'rgba(13,13,26,0.8)', border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: '16px', padding: '20px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h3 style={{ fontSize: '13px', fontWeight: 700, color: 'rgba(255,255,255,0.8)', marginBottom: '2px' }}>
            📡 FRED Signal Monitor
          </h3>
          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-mono)' }}>
            12 live indicators · 840K series available
          </p>
        </div>
        <span style={{
          fontSize: '10px', fontFamily: 'var(--font-mono)', padding: '3px 8px',
          background: 'rgba(34,197,94,0.08)', color: '#22c55e',
          border: '1px solid rgba(34,197,94,0.2)', borderRadius: '6px',
        }}>
          FRED API
        </span>
      </div>

      {/* Table header */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 80px 70px 80px 70px',
        gap: '8px', padding: '6px 8px',
        fontSize: '10px', fontFamily: 'var(--font-mono)',
        color: 'rgba(255,255,255,0.3)', letterSpacing: '0.06em',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        marginBottom: '6px',
      }}>
        <span>INDICATOR</span>
        <span style={{ textAlign: 'right' }}>VALUE</span>
        <span style={{ textAlign: 'right' }}>CHANGE</span>
        <span style={{ textAlign: 'center' }}>DELTA BAR</span>
        <span style={{ textAlign: 'center' }}>STATUS</span>
      </div>

      {/* Signal rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {SIGNALS.map((sig) => {
          const cfg = STATUS_CONFIG[sig.status] || STATUS_CONFIG.normal;
          const isUp = sig.change > 0;
          return (
            <div
              key={sig.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 80px 70px 80px 70px',
                gap: '8px', padding: '8px',
                borderRadius: '8px',
                background: 'rgba(255,255,255,0.015)',
                alignItems: 'center',
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.015)'}
            >
              <div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.75)', marginBottom: '1px' }}>
                  {sig.name}
                </div>
                <div style={{ fontSize: '9px', fontFamily: 'var(--font-mono)', color: 'rgba(255,255,255,0.25)' }}>
                  {sig.id}
                </div>
              </div>
              <div style={{
                textAlign: 'right', fontSize: '12px', fontFamily: 'var(--font-mono)',
                color: 'rgba(255,255,255,0.8)', fontWeight: 600,
              }}>
                {sig.value}{sig.unit}
              </div>
              <div style={{
                textAlign: 'right', fontSize: '11px', fontFamily: 'var(--font-mono)',
                color: sig.change > 0 ? '#ff8060' : sig.change < 0 ? '#22c55e' : '#666',
              }}>
                {sig.change > 0 ? '▲' : sig.change < 0 ? '▼' : '—'}{' '}
                {sig.change !== 0 ? Math.abs(sig.change) : '0'}
              </div>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <SparkBar value={sig.change} max={Math.max(Math.abs(sig.change) * 2, 1)} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <span style={{
                  fontSize: '9px', padding: '2px 6px', borderRadius: '4px',
                  background: cfg.bg, color: cfg.color,
                  border: `1px solid ${cfg.color}30`,
                  fontFamily: 'var(--font-mono)', fontWeight: 600,
                }}>
                  {cfg.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
