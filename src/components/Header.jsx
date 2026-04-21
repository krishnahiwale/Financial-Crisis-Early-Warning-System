import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '../store/useStore';

export default function Header() {
  const { activePage, lastUpdated, wsConnected, unreadCount } = useStore();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const PAGE_TITLES = {
    overview:  'System Overview',
    banking:   'Banking Instability Risk',
    market:    'Market Crash Risk',
    liquidity: 'Liquidity Watch',
    signals:   'Signal Monitor',
    explainer: 'Explainability Deep-Dive',
    model:     'ML Model Performance',
  };

  return (
    <header style={{
      height: '52px', flexShrink: 0,
      background: 'rgba(10,10,20,0.9)',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
      backdropFilter: 'blur(20px)',
      display: 'flex', alignItems: 'center',
      padding: '0 24px', gap: '16px',
      position: 'sticky', top: 0, zIndex: 50,
    }}>
      {/* Breadcrumb */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.25)', fontFamily: 'var(--font-mono)' }}>
          Crisis Sentinel
        </span>
        <span style={{ color: 'rgba(255,255,255,0.15)' }}>/</span>
        <AnimatePresence mode="wait">
          <motion.span
            key={activePage}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}
          >
            {PAGE_TITLES[activePage] || activePage}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Right-side status row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* Unread alerts */}
        {unreadCount > 0 && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '5px',
            fontSize: '11px', color: '#ff6060',
            background: 'rgba(255,23,68,0.08)',
            border: '1px solid rgba(255,23,68,0.2)',
            padding: '3px 9px', borderRadius: '6px',
            fontFamily: 'var(--font-mono)',
          }}>
            <span style={{ animation: 'blink 1.4s ease-in-out infinite' }}>🚨</span>
            {unreadCount} ALERTS
          </div>
        )}

        {/* Live update time */}
        <div style={{
          fontSize: '11px', fontFamily: 'var(--font-mono)',
          color: 'rgba(255,255,255,0.25)',
        }}>
          Updated {lastUpdated.toLocaleTimeString('en', { hour12: false })}
        </div>

        {/* System clock */}
        <div style={{
          fontSize: '12px', fontFamily: 'var(--font-mono)',
          color: 'rgba(255,255,255,0.5)', fontWeight: 600,
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.07)',
          padding: '3px 10px', borderRadius: '6px',
          letterSpacing: '0.05em',
        }}>
          {time.toLocaleTimeString('en', { hour12: false })} UTC+5:30
        </div>

        {/* WS dot */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
          <span style={{
            width: 7, height: 7, borderRadius: '50%',
            background: wsConnected ? '#22c55e' : '#ff4646',
            animation: wsConnected ? 'blink 1.4s ease-in-out infinite' : 'none',
            flexShrink: 0,
          }} />
          <span style={{ color: wsConnected ? 'rgba(34,197,94,0.7)' : 'rgba(255,70,70,0.7)' }}>
            {wsConnected ? 'WS LIVE' : 'RECONNECTING'}
          </span>
        </div>
      </div>
    </header>
  );
}
