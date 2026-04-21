import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from 'recharts';
import useStore from '../store/useStore';

const TYPE_CONFIG = {
  banking:   { color: '#ff6060', label: 'Banking Instability Score' },
  market:    { color: '#ff8c00', label: 'Market Crash Risk Score' },
  liquidity: { color: '#3b82f6', label: 'Liquidity Shortage Score' },
};

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const score = payload[0]?.value;
  return (
    <div style={{
      background: 'rgba(13,13,26,0.95)', border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '10px', padding: '10px 14px', fontSize: '12px',
      fontFamily: 'var(--font-mono)',
    }}>
      <div style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>{label}</div>
      <div style={{ color: payload[0]?.color, fontWeight: 700, fontSize: '16px' }}>
        {score?.toFixed(1)} <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>/100</span>
      </div>
      <div style={{ color: score > 50 ? '#ff6060' : '#22c55e', fontSize: '10px', marginTop: '2px' }}>
        {score > 75 ? '🔴 CRITICAL' : score > 55 ? '🟠 HIGH' : score > 35 ? '🟡 ELEVATED' : '🟢 LOW'}
      </div>
    </div>
  );
}

export default function SignalChart({ crisisType }) {
  const { historicalData } = useStore();
  const data = historicalData[crisisType] || [];
  const cfg = TYPE_CONFIG[crisisType] || TYPE_CONFIG.banking;

  return (
    <div style={{
      background: 'rgba(13,13,26,0.8)', border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: '16px', padding: '20px', height: '100%',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h3 style={{ fontSize: '13px', fontWeight: 700, color: 'rgba(255,255,255,0.8)', marginBottom: '2px' }}>
            {cfg.label}
          </h3>
          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-mono)' }}>
            60-day rolling window · ML model output
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['30D', '60D'].map((d, i) => (
            <span key={d} style={{
              fontSize: '10px', padding: '3px 8px', borderRadius: '6px', cursor: 'pointer',
              background: i === 1 ? 'rgba(255,255,255,0.08)' : 'transparent',
              border: '1px solid rgba(255,255,255,0.08)',
              color: i === 1 ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.3)',
            }}>{d}</span>
          ))}
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
          <defs>
            <linearGradient id={`grad-${crisisType}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor={cfg.color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={cfg.color} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis
            dataKey="date"
            tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10, fontFamily: 'var(--font-mono)' }}
            tickLine={false} axisLine={false}
            interval={9}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10, fontFamily: 'var(--font-mono)' }}
            tickLine={false} axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine
            y={50} stroke="rgba(255,214,0,0.25)"
            strokeDasharray="4 4"
            label={{ value: 'Threshold', fill: 'rgba(255,214,0,0.5)', fontSize: 9 }}
          />
          <Area
            type="monotone" dataKey="score"
            stroke={cfg.color} strokeWidth={2}
            fill={`url(#grad-${crisisType})`}
            dot={false} activeDot={{ r: 4, fill: cfg.color, strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
