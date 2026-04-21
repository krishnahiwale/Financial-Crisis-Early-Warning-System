import { motion, AnimatePresence } from 'framer-motion';
import useStore from '../store/useStore';

const TYPE_COLORS = {
  market:    '#ff8c00',
  banking:   '#ff4060',
  liquidity: '#3b82f6',
};

export default function LiveTicker() {
  const { ticker, wsConnected } = useStore();

  return (
    <div style={{
      background: 'rgba(13,13,26,0.8)', border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: '16px', padding: '16px 20px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{
            width: 7, height: 7, borderRadius: '50%', flexShrink: 0,
            background: wsConnected ? '#22c55e' : '#ff4060',
            animation: wsConnected ? 'blink 1.4s ease-in-out infinite' : 'none',
          }} />
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.7)' }}>
            WebSocket Feed
          </span>
        </div>
        <span style={{
          fontSize: '10px', fontFamily: 'var(--font-mono)',
          color: wsConnected ? '#22c55e' : '#ff4060',
        }}>
          {wsConnected ? '● CONNECTED' : '○ RECONNECTING...'}
        </span>
        <span style={{ marginLeft: 'auto', fontSize: '10px', color: 'rgba(255,255,255,0.25)', fontFamily: 'var(--font-mono)' }}>
          {ticker.length} events
        </span>
      </div>

      <div style={{
        display: 'flex', flexDirection: 'column', gap: '6px',
        maxHeight: '140px', overflowY: 'auto',
      }}>
        <AnimatePresence initial={false}>
          {ticker.slice(0, 12).map((item, i) => (
            <motion.div
              key={`${item.ts?.getTime()}-${i}`}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                fontSize: '11px', fontFamily: 'var(--font-mono)',
                padding: '4px 0',
                borderBottom: '1px solid rgba(255,255,255,0.03)',
              }}
            >
              <span style={{ color: 'rgba(255,255,255,0.2)', width: '70px', flexShrink: 0 }}>
                {item.ts?.toLocaleTimeString('en', { hour12: false })}
              </span>
              <span style={{
                width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
                background: TYPE_COLORS[item.type] || '#888',
              }} />
              <span style={{ color: 'rgba(255,255,255,0.6)' }}>{item.msg}</span>
            </motion.div>
          ))}
        </AnimatePresence>

        {ticker.length === 0 && (
          <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: '11px', fontFamily: 'var(--font-mono)', padding: '8px 0' }}>
            Waiting for live signals...
          </div>
        )}
      </div>
    </div>
  );
}
