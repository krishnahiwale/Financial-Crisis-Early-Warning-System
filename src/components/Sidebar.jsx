import { motion } from 'framer-motion';
import useStore from '../store/useStore';

const NAV_ITEMS = [
  { id: 'overview',   icon: '⚡', label: 'Overview',       sub: 'All risk scores' },
  { id: 'banking',    icon: '🏦', label: 'Banking Risk',   sub: 'Credit & interbank' },
  { id: 'market',     icon: '📉', label: 'Market Crash',   sub: 'Equity & volatility' },
  { id: 'liquidity',  icon: '💧', label: 'Liquidity',      sub: 'Money market stress' },
  { id: 'signals',    icon: '📡', label: 'Signals',        sub: 'FRED indicators' },
  { id: 'explainer',  icon: '🔍', label: 'Explainer',      sub: 'SHAP deep-dive' },
  { id: 'model',      icon: '🤖', label: 'ML Models',      sub: 'Performance metrics' },
];

export default function Sidebar() {
  const { activePage, setActivePage, user, logout, unreadCount, wsConnected } = useStore();

  return (
    <aside style={{
      width: '220px', flexShrink: 0,
      background: 'rgba(10,10,20,0.95)',
      borderRight: '1px solid rgba(255,255,255,0.06)',
      display: 'flex', flexDirection: 'column',
      height: '100vh', position: 'sticky', top: 0,
      backdropFilter: 'blur(20px)',
    }}>
      {/* Logo */}
      <div style={{
        padding: '20px 18px 16px',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            style={{
              width: 32, height: 32, borderRadius: '50%',
              border: '1.5px solid transparent',
              backgroundImage: 'linear-gradient(#0a0a14, #0a0a14), linear-gradient(135deg, #ff3b3b, #ff8c00)',
              backgroundOrigin: 'border-box',
              backgroundClip: 'padding-box, border-box',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '14px', flexShrink: 0,
            }}
          >
            🚨
          </motion.div>
          <div>
            <div style={{
              fontSize: '13px', fontWeight: 800, letterSpacing: '-0.02em',
              background: 'linear-gradient(135deg, #ff3b3b, #ff8c00)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              CRISIS SENTINEL
            </div>
            <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.1em', fontFamily: 'var(--font-mono)' }}>
              EARLY WARNING v1.0
            </div>
          </div>
        </div>

        {/* WS status */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          fontSize: '10px', fontFamily: 'var(--font-mono)',
          color: wsConnected ? 'rgba(34,197,94,0.8)' : 'rgba(255,70,70,0.8)',
          background: wsConnected ? 'rgba(34,197,94,0.06)' : 'rgba(255,70,70,0.06)',
          border: `1px solid ${wsConnected ? 'rgba(34,197,94,0.15)' : 'rgba(255,70,70,0.15)'}`,
          borderRadius: '6px', padding: '4px 8px',
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: '50%',
            background: wsConnected ? '#22c55e' : '#ff4646',
            animation: wsConnected ? 'blink 1.4s ease-in-out infinite' : 'none',
            flexShrink: 0,
          }} />
          {wsConnected ? 'LIVE FEED ACTIVE' : 'RECONNECTING...'}
        </div>
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, padding: '12px 10px', overflowY: 'auto' }}>
        {NAV_ITEMS.map((item) => {
          const isActive = activePage === item.id;
          return (
            <motion.button
              key={item.id}
              id={`nav-${item.id}`}
              onClick={() => setActivePage(item.id)}
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.97 }}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                padding: '10px 10px', borderRadius: '10px', marginBottom: '2px',
                background: isActive ? 'rgba(255,59,59,0.1)' : 'transparent',
                border: `1px solid ${isActive ? 'rgba(255,59,59,0.2)' : 'transparent'}`,
                cursor: 'pointer', textAlign: 'left',
                transition: 'background 0.15s, border-color 0.15s',
              }}
            >
              <span style={{ fontSize: '16px', width: '20px', textAlign: 'center', flexShrink: 0 }}>
                {item.icon}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: '12px', fontWeight: 600,
                  color: isActive ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.55)',
                  transition: 'color 0.15s',
                }}>
                  {item.label}
                  {item.id === 'overview' && unreadCount > 0 && (
                    <span style={{
                      marginLeft: '6px', fontSize: '9px', padding: '1px 5px',
                      background: '#ff1744', borderRadius: '8px',
                      color: '#fff', fontWeight: 700,
                      animation: 'blink 2s ease-in-out infinite',
                    }}>
                      {unreadCount}
                    </span>
                  )}
                </div>
                <div style={{
                  fontSize: '10px', color: 'rgba(255,255,255,0.25)',
                  fontFamily: 'var(--font-mono)', marginTop: '1px',
                }}>
                  {item.sub}
                </div>
              </div>
              {isActive && (
                <div style={{
                  width: 3, height: 20, borderRadius: '2px',
                  background: 'linear-gradient(180deg, #ff3b3b, #ff8c00)',
                  flexShrink: 0,
                }} />
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* Footer — user info */}
      <div style={{
        padding: '14px 16px',
        borderTop: '1px solid rgba(255,255,255,0.05)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
          <div style={{
            width: 30, height: 30, borderRadius: '50%',
            background: 'linear-gradient(135deg, #ff3b3b, #ff8c00)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '12px', fontWeight: 800, color: '#fff', flexShrink: 0,
          }}>
            {user?.name?.[0]?.toUpperCase() || 'A'}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.75)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.name || 'Analyst'}
            </div>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-mono)' }}>
              {user?.role || 'Risk Analyst'}
            </div>
          </div>
        </div>
        <button
          onClick={logout}
          style={{
            width: '100%', padding: '8px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '8px', color: 'rgba(255,255,255,0.4)',
            fontSize: '11px', cursor: 'pointer',
            fontFamily: 'var(--font-mono)',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,59,59,0.08)'; e.currentTarget.style.color = '#ff6060'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; }}
        >
          ⏻ Sign Out
        </button>
      </div>
    </aside>
  );
}
