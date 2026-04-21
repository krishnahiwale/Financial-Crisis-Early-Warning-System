import { useState } from 'react';
import { motion } from 'framer-motion';
import ExplainPanel from '../components/ExplainPanel';
import { SHAP_DRIVERS } from '../utils/mockData';

const CRISIS_TYPES = ['banking', 'market', 'liquidity'];
const CRISIS_META = {
  banking:   { label: 'Banking Instability', icon: '🏦', color: '#ff6060' },
  market:    { label: 'Market Crash',        icon: '📉', color: '#ff8c00' },
  liquidity: { label: 'Liquidity Shortage',  icon: '💧', color: '#3b82f6' },
};

const METHODOLOGY = [
  {
    step: '01', title: 'Feature Engineering',
    desc: 'Raw FRED signals are transformed into 60+ features: current values, 7d/30d momentum, volatility, and cross-signal ratios.',
    code: 'feat["ted_spread_7d_pct"] = (latest - week_ago) / abs(week_ago)',
  },
  {
    step: '02', title: 'SHAP Value Computation',
    desc: 'TreeExplainer computes exact Shapley values for each feature, decomposing the model output into additive feature contributions.',
    code: 'explainer = shap.TreeExplainer(model)\nshap_values = explainer(X)',
  },
  {
    step: '03', title: 'Direction Classification',
    desc: 'Positive SHAP values push the prediction toward crisis; negative values reduce risk. Magnitude indicates strength of influence.',
    code: 'direction = "increases" if shap_val > 0 else "decreases"',
  },
  {
    step: '04', title: 'Top-5 Driver Selection',
    desc: 'Drivers are sorted by absolute SHAP magnitude and the top 5 are surfaced to the analyst with bar-width encoding.',
    code: 'sorted(drivers, key=lambda x: x["magnitude"])[:5]',
  },
];

export default function ExplainerPage() {
  const [selected, setSelected] = useState('banking');
  const fadeUp = (d = 0) => ({
    initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, delay: d, ease: [0.22, 1, 0.36, 1] },
  });

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <motion.div {...fadeUp(0)}>
        <h1 style={{ fontSize: '22px', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '4px' }}>
          🔍 Explainability Deep-Dive
        </h1>
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-mono)' }}>
          SHAP · SHapley Additive exPlanations · Lundberg &amp; Lee (2017)
        </p>
      </motion.div>

      {/* Model selector */}
      <motion.div {...fadeUp(0.05)} style={{ display: 'flex', gap: '10px' }}>
        {CRISIS_TYPES.map(type => {
          const m = CRISIS_META[type];
          const isActive = selected === type;
          return (
            <button
              key={type}
              onClick={() => setSelected(type)}
              style={{
                padding: '10px 18px', borderRadius: '10px',
                background: isActive ? `${m.color}18` : 'rgba(255,255,255,0.03)',
                border: `1px solid ${isActive ? m.color + '44' : 'rgba(255,255,255,0.08)'}`,
                color: isActive ? m.color : 'rgba(255,255,255,0.45)',
                fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {m.icon} {m.label}
            </button>
          );
        })}
      </motion.div>

      {/* Side-by-side: all 3 SHAP panels */}
      <motion.div {...fadeUp(0.1)} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
        {CRISIS_TYPES.map(type => (
          <div key={type} style={{ opacity: selected === type ? 1 : 0.45, transition: 'opacity 0.2s' }}>
            <ExplainPanel crisisType={type} />
          </div>
        ))}
      </motion.div>

      {/* Methodology walkthrough */}
      <motion.div {...fadeUp(0.15)} style={{
        background: 'rgba(13,13,26,0.8)', border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '16px', padding: '24px',
      }}>
        <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'rgba(255,255,255,0.85)', marginBottom: '4px' }}>
          🧮 How SHAP Works in Crisis Sentinel
        </h3>
        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-mono)', marginBottom: '24px' }}>
          4-step pipeline from raw signals to analyst-facing explanations
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          {METHODOLOGY.map((m) => (
            <div key={m.step} style={{
              background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '12px', padding: '16px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <span style={{
                  fontSize: '11px', fontFamily: 'var(--font-mono)', fontWeight: 700,
                  color: '#a855f7', background: 'rgba(168,85,247,0.1)',
                  border: '1px solid rgba(168,85,247,0.2)',
                  padding: '2px 8px', borderRadius: '6px',
                }}>
                  STEP {m.step}
                </span>
                <span style={{ fontSize: '13px', fontWeight: 700, color: 'rgba(255,255,255,0.8)' }}>{m.title}</span>
              </div>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.6, marginBottom: '10px' }}>
                {m.desc}
              </p>
              <pre style={{
                fontSize: '10px', fontFamily: 'var(--font-mono)',
                color: 'rgba(34,197,94,0.7)', background: 'rgba(0,0,0,0.3)',
                padding: '8px 12px', borderRadius: '6px', margin: 0,
                border: '1px solid rgba(34,197,94,0.1)',
                overflow: 'auto', whiteSpace: 'pre-wrap',
              }}>
                {m.code}
              </pre>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Research citation */}
      <motion.div {...fadeUp(0.2)} style={{
        background: 'rgba(168,85,247,0.04)', border: '1px solid rgba(168,85,247,0.15)',
        borderRadius: '12px', padding: '16px 20px',
        fontSize: '12px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.7,
      }}>
        <strong style={{ color: 'rgba(168,85,247,0.9)' }}>📚 Research Foundation — </strong>
        "Identifying influential variables for early warning of financial network instability is challenging due to the complexity of the system, uncertainty of failure, and nonlinear, time-varying relationships between network participants — making a data-driven and statistical modeling approach essential." Advanced ML models (Random Forest, Extremely Randomised Trees) outperform Logistic Regression as measured by AUROC for financial crisis prediction. SHAP values provide model-agnostic explainability suitable for policymakers and researchers.
      </motion.div>
    </div>
  );
}
