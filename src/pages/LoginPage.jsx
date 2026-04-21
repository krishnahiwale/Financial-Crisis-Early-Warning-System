import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '../store/useStore';

// ── 3D Particle Field Canvas ─────────────────────────────────
function ParticleCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;

    const PARTICLE_COUNT = 120;
    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      z: Math.random() * 1000,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      vz: Math.random() * 2 + 0.5,
      hue: Math.random() > 0.7 ? 0 : Math.random() > 0.5 ? 220 : 180,
    }));

    const NODES = Array.from({ length: 18 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 3 + 1.5,
      hue: Math.random() > 0.6 ? 0 : 220,
      pulsePhase: Math.random() * Math.PI * 2,
    }));

    let t = 0;

    const draw = () => {
      ctx.fillStyle = 'rgba(7, 7, 16, 0.18)';
      ctx.fillRect(0, 0, w, h);
      t += 0.012;

      // ── Draw network connections ──────────────────────────
      for (let i = 0; i < NODES.length; i++) {
        const n = NODES[i];
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;

        for (let j = i + 1; j < NODES.length; j++) {
          const m = NODES[j];
          const dx = n.x - m.x;
          const dy = n.y - m.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 220) {
            const alpha = (1 - dist / 220) * 0.25;
            const hue = n.hue === 0 ? 0 : 220;
            ctx.beginPath();
            ctx.strokeStyle = `hsla(${hue}, 80%, 60%, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(m.x, m.y);
            ctx.stroke();
          }
        }

        // Node pulse
        const pulse = Math.sin(t * 2 + n.pulsePhase) * 0.5 + 0.5;
        const grd = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 4);
        grd.addColorStop(0, `hsla(${n.hue}, 90%, 65%, ${0.6 + pulse * 0.4})`);
        grd.addColorStop(1, `hsla(${n.hue}, 90%, 65%, 0)`);
        ctx.beginPath();
        ctx.fillStyle = grd;
        ctx.arc(n.x, n.y, n.r * 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = `hsla(${n.hue}, 90%, 75%, 0.9)`;
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // ── Draw particles (depth simulation) ────────────────
      for (const p of particles) {
        p.z -= p.vz;
        if (p.z <= 0) {
          p.x = Math.random() * w;
          p.y = Math.random() * h;
          p.z = 1000;
        }
        const scale = 1000 / p.z;
        const px = (p.x - w / 2) * scale + w / 2;
        const py = (p.y - h / 2) * scale + h / 2;
        const size = scale * 0.6;
        const alpha = Math.min(scale * 0.3, 0.7);

        if (px > 0 && px < w && py > 0 && py < h) {
          ctx.beginPath();
          ctx.fillStyle = `hsla(${p.hue}, 80%, 70%, ${alpha})`;
          ctx.arc(px, py, Math.max(size, 0.5), 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // ── Scanline overlay ──────────────────────────────────
      const scanY = ((t * 60) % (h + 40)) - 20;
      const scanGrad = ctx.createLinearGradient(0, scanY - 40, 0, scanY + 40);
      scanGrad.addColorStop(0, 'rgba(59,130,246,0)');
      scanGrad.addColorStop(0.5, 'rgba(59,130,246,0.04)');
      scanGrad.addColorStop(1, 'rgba(59,130,246,0)');
      ctx.fillStyle = scanGrad;
      ctx.fillRect(0, scanY - 40, w, 80);

      animId = requestAnimationFrame(draw);
    };

    draw();

    const onResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed', inset: 0, width: '100%', height: '100%',
        display: 'block', zIndex: 0, background: '#070710',
      }}
    />
  );
}

// ── Floating Risk Ticker ─────────────────────────────────────
const TICKER_ITEMS = [
  '🏦 TED Spread: 0.52% ↑', '📉 VIX: 28.4 (+12.7%)', '⚠️ Yield Curve: -0.31%',
  '🔴 S&P 500: -1.4%', '💧 SOFR: 5.33%', '💵 USD Index: 124.8 ↑',
  '🚨 FSI: 1.84 (HIGH)', '📊 MMF Inflows: +$89B',
];

function LiveTicker() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % TICKER_ITEMS.length), 2800);
    return () => clearInterval(t);
  }, []);
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 10,
      background: 'rgba(255,27,27,0.08)', borderBottom: '1px solid rgba(255,27,27,0.2)',
      padding: '6px 0', overflow: 'hidden',
    }}>
      <div style={{ display: 'flex', gap: '60px', fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'rgba(255,200,200,0.7)', padding: '0 24px' }}>
        <span style={{ color: 'var(--accent-red)', fontWeight: 600 }}>● LIVE</span>
        <AnimatePresence mode="wait">
          <motion.span
            key={idx}
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -8, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {TICKER_ITEMS[idx]}
          </motion.span>
        </AnimatePresence>
        {TICKER_ITEMS.slice(0, 5).map((item, i) => (
          <span key={i} style={{ opacity: 0.4 }}>{item}</span>
        ))}
      </div>
    </div>
  );
}

// ── Main Login Page ──────────────────────────────────────────
export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { login } = useStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 1400));
    const ok = login(email, password);
    if (!ok) {
      setError('Invalid credentials. Use any email + 6+ char password.');
      setLoading(false);
    }
  };

  const fillDemo = () => {
    setEmail('analyst@crisissentinel.ai');
    setPassword('demo2026');
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
      <ParticleCanvas />
      <LiveTicker />

      {/* Radial glow effects */}
      <div style={{
        position: 'fixed', top: '20%', left: '15%', width: '400px', height: '400px',
        background: 'radial-gradient(circle, rgba(255,27,27,0.08) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 1, borderRadius: '50%',
      }} />
      <div style={{
        position: 'fixed', bottom: '15%', right: '12%', width: '500px', height: '500px',
        background: 'radial-gradient(circle, rgba(59,130,246,0.07) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 1, borderRadius: '50%',
      }} />

      {/* Center card */}
      <div style={{
        position: 'relative', zIndex: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh', padding: '80px 16px 24px',
      }}>
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{
            width: '100%', maxWidth: '440px',
            background: 'rgba(13,13,26,0.85)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '24px',
            padding: '40px 36px',
            boxShadow: '0 0 80px rgba(255,27,27,0.08), 0 32px 64px rgba(0,0,0,0.6)',
          }}
        >
          {/* Logo mark */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
              style={{
                width: 72, height: 72, margin: '0 auto 16px',
                borderRadius: '50%',
                border: '2px solid transparent',
                backgroundImage: 'linear-gradient(#0d0d1a, #0d0d1a), linear-gradient(135deg, #ff3b3b, #ff8c00, #ffd60a)',
                backgroundOrigin: 'border-box',
                backgroundClip: 'padding-box, border-box',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '28px',
                boxShadow: '0 0 32px rgba(255,55,55,0.2)',
              }}
            >
              🚨
            </motion.div>
            <h1 style={{
              fontSize: '22px', fontWeight: 800, letterSpacing: '-0.03em',
              background: 'linear-gradient(135deg, #ff3b3b, #ff8c00, #ffd60a)',
              backgroundSize: '200% 200%',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              animation: 'gradient-shift 4s ease infinite',
            }}>
              CRISIS SENTINEL
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '6px' }}>
              Real-Time Financial Crisis Early Warning
            </p>
          </div>

          {/* Status bar */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.15)',
            borderRadius: '8px', padding: '8px 12px', marginBottom: '28px',
            fontSize: '11px', fontFamily: 'var(--font-mono)',
          }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', animation: 'blink 1.4s ease-in-out infinite', flexShrink: 0 }} />
            <span style={{ color: 'rgba(34,197,94,0.9)' }}>SYSTEM OPERATIONAL</span>
            <span style={{ marginLeft: 'auto', color: 'var(--text-muted)' }}>
              {new Date().toLocaleTimeString()}
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Analyst Email
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="analyst@institution.com"
                required
                style={{
                  width: '100%', padding: '12px 14px',
                  background: 'rgba(255,255,255,0.04)',
                  border: `1px solid ${error ? 'rgba(255,55,55,0.4)' : 'rgba(255,255,255,0.08)'}`,
                  borderRadius: '10px', color: 'var(--text-primary)',
                  fontSize: '14px', fontFamily: 'var(--font-sans)',
                  outline: 'none', transition: 'border-color 0.2s',
                  boxSizing: 'border-box',
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(59,130,246,0.5)'}
                onBlur={e => e.target.style.borderColor = error ? 'rgba(255,55,55,0.4)' : 'rgba(255,255,255,0.08)'}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Access Code
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="login-password"
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{
                    width: '100%', padding: '12px 42px 12px 14px',
                    background: 'rgba(255,255,255,0.04)',
                    border: `1px solid ${error ? 'rgba(255,55,55,0.4)' : 'rgba(255,255,255,0.08)'}`,
                    borderRadius: '10px', color: 'var(--text-primary)',
                    fontSize: '14px', fontFamily: 'var(--font-sans)',
                    outline: 'none', transition: 'border-color 0.2s',
                    boxSizing: 'border-box',
                  }}
                  onFocus={e => e.target.style.borderColor = 'rgba(59,130,246,0.5)'}
                  onBlur={e => e.target.style.borderColor = error ? 'rgba(255,55,55,0.4)' : 'rgba(255,255,255,0.08)'}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(s => !s)}
                  style={{
                    position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)',
                    fontSize: '14px', padding: 0,
                  }}
                >
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Error message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{
                    background: 'rgba(255,27,27,0.08)',
                    border: '1px solid rgba(255,27,27,0.25)',
                    borderRadius: '8px', padding: '10px 12px',
                    fontSize: '12px', color: '#ff8080', fontFamily: 'var(--font-mono)',
                  }}
                >
                  ⚠️ {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit button */}
            <motion.button
              id="login-submit"
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              style={{
                width: '100%', padding: '13px',
                background: loading
                  ? 'rgba(255,59,59,0.3)'
                  : 'linear-gradient(135deg, #ff3b3b, #cc0000)',
                border: '1px solid rgba(255,59,59,0.3)',
                borderRadius: '10px', color: '#fff',
                fontSize: '14px', fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                letterSpacing: '0.05em', textTransform: 'uppercase',
                boxShadow: loading ? 'none' : '0 0 20px rgba(255,59,59,0.3)',
                transition: 'all 0.2s',
              }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin-slow 0.8s linear infinite', display: 'inline-block' }} />
                  Authenticating...
                </span>
              ) : '🔐 Access Platform'}
            </motion.button>
          </form>

          {/* Demo access */}
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <button
              onClick={fillDemo}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--accent-cyan)', fontSize: '12px',
                fontFamily: 'var(--font-mono)', textDecoration: 'underline',
                textDecorationStyle: 'dashed',
              }}
            >
              ← Use demo credentials
            </button>
          </div>

          {/* Footer tags */}
          <div style={{
            display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center',
            marginTop: '28px', paddingTop: '20px',
            borderTop: '1px solid rgba(255,255,255,0.05)',
          }}>
            {['ML-Powered', 'SHAP Explainable', 'FRED API', 'Real-Time'].map(tag => (
              <span key={tag} style={{
                fontSize: '10px', padding: '3px 8px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '4px', color: 'var(--text-muted)',
                fontFamily: 'var(--font-mono)',
              }}>{tag}</span>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
