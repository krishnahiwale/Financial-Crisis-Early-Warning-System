import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import useStore from '../store/useStore';

const LEVEL_CONFIG = {
  CRITICAL: { color: '#ff1744', bg: 'rgba(255,23,68,0.1)',  border: 'rgba(255,23,68,0.3)',  icon: '🔴' },
  HIGH:     { color: '#ff6d00', bg: 'rgba(255,109,0,0.08)', border: 'rgba(255,109,0,0.25)', icon: '🟠' },
  ELEVATED: { color: '#ffd600', bg: 'rgba(255,214,0,0.06)', border: 'rgba(255,214,0,0.2)',  icon: '🟡' },
  MODERATE: { color: '#2979ff', bg: 'rgba(41,121,255,0.06)',border: 'rgba(41,121,255,0.2)', icon: '🔵' },
};

const TYPE_LABELS = { banking: '🏦', market: '📉', liquidity: '💧' };

export default function AlertFeed() {
  const { alerts, acknowledgeAlert } = useStore();
  const [filter, setFilter] = useState('ALL');

  const filtered = filter === 'ALL'
    ? alerts
    : filter === 'UNREAD'
    ? alerts.filter(a => !a.acknowledged)
    : alerts.filter(a => a.type === filter.toLowerCase());

  return (
    <div style={{
      background: 'rgba(13,13,26,0.8)', border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column',
      height: '100%', minHeight: '380px',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <h3 style={{ fontSize: '13px', fontWeight: 700, color: 'rgba(255,255,255,0.8)' }}>
            🚨 Alert Feed
          </h3>
          <span style={{
            fontSize: '10px', fontWeight: 700, padding: '2px 7px', borderRadius: '4px',
            background: 'rgba(255,27,27,0.15)', color: '#ff6060',
            animation: 'blink 2s ease-in-out infinite',
          }}>
            {alerts.filter(a => !a.acknowledged).length} NEW
          </span>
        </div>
        <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-mono)' }}>
          Live · Auto-refresh
        </span>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '14px', flexWrap: 'wrap' }}>
        {['ALL', 'UNREAD', 'BANKING', 'MARKET', 'LIQUIDITY'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              fontSize: '10px', padding: '4px 10px', borderRadius: '6px',
              border: `1px solid ${filter === f ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.06)'}`,
              background: filter === f ? 'rgba(255,255,255,0.08)' : 'transparent',
              color: filter === f ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.35)',
              cursor: 'pointer', fontFamily: 'var(--font-mono)',
              transition: 'all 0.15s',
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Alert list */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <AnimatePresence>
          {filtered.map((alert, i) => {
            const cfg = LEVEL_CONFIG[alert.level] || LEVEL_CONFIG.MODERATE;
            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ delay: i * 0.05 }}
                style={{
                  borderRadius: '10px', padding: '12px 14px',
                  background: alert.acknowledged ? 'rgba(255,255,255,0.02)' : cfg.bg,
                  border: `1px solid ${alert.acknowledged ? 'rgba(255,255,255,0.05)' : cfg.border}`,
                  opacity: alert.acknowledged ? 0.6 : 1,
                  transition: 'all 0.2s',
                }}
              >
                {/* Alert header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1, minWidth: 0 }}>
                    <span style={{ fontSize: '12px' }}>{cfg.icon}</span>
                    <span style={{
                      fontSize: '12px', fontWeight: 600, color: alert.acknowledged ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.85)',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {alert.title}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexShrink: 0, marginLeft: '8px' }}>
                    <span style={{
                      fontSize: '9px', fontFamily: 'var(--font-mono)',
                      color: 'rgba(255,255,255,0.3)',
                    }}>
                      {formatDistanceToNow(alert.timestamp, { addSuffix: true })}
                    </span>
                    {!alert.acknowledged && (
                      <button
                        onClick={() => acknowledgeAlert(alert.id)}
                        style={{
                          fontSize: '9px', padding: '1px 6px', borderRadius: '4px',
                          background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                          color: 'rgba(255,255,255,0.5)', cursor: 'pointer',
                        }}
                        title="Acknowledge"
                      >
                        ACK
                      </button>
                    )}
                  </div>
                </div>

                {/* Detail */}
                <p style={{
                  fontSize: '11px', color: 'rgba(255,255,255,0.45)',
                  lineHeight: 1.5, marginBottom: '8px',
                }}>
                  {alert.detail}
                </p>

                {/* Signal tags */}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
                  <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.2)', fontFamily: 'var(--font-mono)', marginRight: '2px' }}>
                    {TYPE_LABELS[alert.type]} {alert.type.toUpperCase()}
                  </span>
                  {alert.signals.map(sig => (
                    <span key={sig} style={{
                      fontSize: '9px', padding: '1px 7px', borderRadius: '4px',
                      background: `${cfg.color}15`, color: cfg.color,
                      border: `1px solid ${cfg.color}25`,
                      fontFamily: 'var(--font-mono)',
                    }}>
                      {sig}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: '12px', padding: '32px 0' }}>
            No alerts match this filter.
          </div>
        )}
      </div>
    </div>
  );
}
