import { useEffect, useRef } from 'react';
import { CONTAGION_DATA } from '../utils/mockData';

// SVG World Map approximation with contagion hotspots
const WORLD_PATHS = {
  usa:    "M 150 120 L 220 115 L 235 140 L 210 160 L 160 155 Z",
  europe: "M 420 95 L 470 90 L 480 115 L 450 125 L 415 118 Z",
  uk:     "M 410 90 L 422 88 L 424 102 L 410 105 Z",
  china:  "M 600 115 L 660 110 L 675 145 L 640 158 L 595 148 Z",
  japan:  "M 680 115 L 695 112 L 698 132 L 682 136 Z",
  brazil: "M 235 205 L 285 200 L 290 250 L 250 258 L 228 240 Z",
  india:  "M 550 145 L 590 140 L 595 185 L 560 190 L 545 170 Z",
  aus:    "M 640 230 L 700 225 L 705 270 L 655 275 L 635 258 Z",
};

const RISK_COLOR = (risk) => {
  if (risk >= 70) return '#ff1744';
  if (risk >= 55) return '#ff6d00';
  if (risk >= 40) return '#ffd600';
  return '#22c55e';
};

export default function ContagionMap() {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let t = 0;
    const W = canvas.width;
    const H = canvas.height;

    // Project lat/lon to canvas coords (simple equirectangular)
    const project = (lat, lon) => ({
      x: ((lon + 180) / 360) * W,
      y: ((90 - lat) / 180) * H,
    });

    const nodes = CONTAGION_DATA.map(d => ({
      ...d,
      ...project(d.lat, d.lon),
      pulsePhase: Math.random() * Math.PI * 2,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      // Background grid
      ctx.strokeStyle = 'rgba(255,255,255,0.03)';
      ctx.lineWidth = 0.5;
      for (let x = 0; x < W; x += 40) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      }
      for (let y = 0; y < H; y += 30) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }

      // Draw connections between high-risk nodes
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const combinedRisk = (a.risk + b.risk) / 2;
          if (combinedRisk < 45) continue;

          const alpha = ((combinedRisk - 45) / 55) * 0.4 * (0.5 + 0.5 * Math.sin(t * 1.5 + i));
          const color = RISK_COLOR(combinedRisk);

          ctx.beginPath();
          ctx.setLineDash([3, 6]);
          ctx.strokeStyle = color.replace('#', 'rgba(').replace(')', '') + `, ${alpha})`;

          // Build hex from named color
          ctx.strokeStyle = `rgba(${parseInt(color.slice(1,3),16)},${parseInt(color.slice(3,5),16)},${parseInt(color.slice(5,7),16)},${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.moveTo(a.x, a.y);

          // Arc path
          const cpx = (a.x + b.x) / 2;
          const cpy = Math.min(a.y, b.y) - 30;
          ctx.quadraticCurveTo(cpx, cpy, b.x, b.y);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }

      // Draw nodes
      for (const node of nodes) {
        const pulse = Math.sin(t * 2 + node.pulsePhase) * 0.5 + 0.5;
        const color = RISK_COLOR(node.risk);
        const r = parseInt(color.slice(1,3),16);
        const g = parseInt(color.slice(3,5),16);
        const b = parseInt(color.slice(5,7),16);

        // Outer pulse ring
        const ringR = 12 + pulse * 8;
        const grd = ctx.createRadialGradient(node.x, node.y, 2, node.x, node.y, ringR);
        grd.addColorStop(0, `rgba(${r},${g},${b},${0.4 + pulse * 0.2})`);
        grd.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.beginPath();
        ctx.fillStyle = grd;
        ctx.arc(node.x, node.y, ringR, 0, Math.PI * 2);
        ctx.fill();

        // Core dot
        ctx.beginPath();
        ctx.fillStyle = `rgba(${r},${g},${b},0.95)`;
        ctx.arc(node.x, node.y, 4, 0, Math.PI * 2);
        ctx.fill();

        // Label
        ctx.font = '9px JetBrains Mono, monospace';
        ctx.fillStyle = `rgba(${r},${g},${b},0.85)`;
        ctx.fillText(`${node.label} ${node.risk}`, node.x + 6, node.y - 5);
      }

      t += 0.025;
      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  return (
    <div style={{
      background: 'rgba(13,13,26,0.8)', border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: '16px', padding: '20px', height: '100%',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <div>
          <h3 style={{ fontSize: '13px', fontWeight: 700, color: 'rgba(255,255,255,0.8)', marginBottom: '2px' }}>
            🌐 Global Contagion Map
          </h3>
          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-mono)' }}>
            Cross-geography correlation · DCC-GARCH model
          </p>
        </div>
        <div style={{
          fontSize: '11px', fontFamily: 'var(--font-mono)',
          color: '#ff8c00', background: 'rgba(255,140,0,0.1)',
          border: '1px solid rgba(255,140,0,0.2)',
          borderRadius: '6px', padding: '4px 10px',
        }}>
          Contagion Index: 0.74
        </div>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={560}
        height={240}
        style={{ width: '100%', height: 'auto', borderRadius: '8px', display: 'block' }}
      />

      {/* Legend */}
      <div style={{ display: 'flex', gap: '16px', marginTop: '12px', flexWrap: 'wrap' }}>
        {[
          { label: 'Critical (70+)', color: '#ff1744' },
          { label: 'High (55-70)',   color: '#ff6d00' },
          { label: 'Elevated (40-55)',color: '#ffd600' },
          { label: 'Low (<40)',       color: '#22c55e' },
        ].map(({ label, color }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }} />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}
