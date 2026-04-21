import { MODEL_METRICS } from '../utils/mockData';

const CRISIS_META = {
  banking:   { label: 'Banking Model', color: '#ff6060', icon: '🏦' },
  market:    { label: 'Market Model',  color: '#ff8c00', icon: '📉' },
  liquidity: { label: 'Liquidity Model', color: '#3b82f6', icon: '💧' },
};

function MetricBar({ value, color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{ flex: 1, height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: `${value * 100}%`, borderRadius: '3px',
          background: `linear-gradient(90deg, ${color}80, ${color})`,
          transition: 'width 0.6s ease',
        }} />
      </div>
      <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: color, width: '38px', textAlign: 'right', fontWeight: 600 }}>
        {(value * 100).toFixed(1)}%
      </span>
    </div>
  );
}

export default function ModelMetrics() {
  return (
    <div style={{
      background: 'rgba(13,13,26,0.8)', border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: '16px', padding: '20px',
    }}>
      <div style={{ marginBottom: '18px' }}>
        <h3 style={{ fontSize: '13px', fontWeight: 700, color: 'rgba(255,255,255,0.8)', marginBottom: '2px' }}>
          🤖 Model Performance
        </h3>
        <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-mono)' }}>
          Calibrated Random Forest · Gradient Boosting
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {Object.entries(MODEL_METRICS).map(([type, m]) => {
          const cfg = CRISIS_META[type];
          return (
            <div key={type}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                <span style={{ fontSize: '12px' }}>{cfg.icon}</span>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>{cfg.label}</span>
                <span style={{
                  marginLeft: 'auto', fontSize: '12px', fontFamily: 'var(--font-mono)',
                  color: cfg.color, fontWeight: 700,
                }}>
                  AUROC {(m.auroc * 100).toFixed(1)}%
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '70px 1fr', gap: '6px 12px', alignItems: 'center' }}>
                {[
                  ['Precision', m.precision],
                  ['Recall',    m.recall],
                  ['F1 Score',  m.f1],
                  ['False Alm', 1 - m.falseAlarm],
                ].map(([label, val]) => (
                  <>
                    <span key={`${type}-${label}-lbl`} style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-mono)' }}>
                      {label}
                    </span>
                    <MetricBar key={`${type}-${label}-bar`} value={val} color={cfg.color} />
                  </>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{
        marginTop: '16px', paddingTop: '14px',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        fontSize: '10px', color: 'rgba(255,255,255,0.2)',
        fontFamily: 'var(--font-mono)', lineHeight: 1.5,
      }}>
        Evaluated on held-out crisis episodes (2007–2023).
        Retrained quarterly with isotonic recalibration.
      </div>
    </div>
  );
}
