import { useWebSocket } from './hooks/useWebSocket';
import useStore from './store/useStore';
import { motion, AnimatePresence } from 'framer-motion';

// Pages
import LoginPage from './pages/LoginPage';
import Overview from './pages/Overview';
import BankingRisk from './pages/BankingRisk';
import MarketCrash from './pages/MarketCrash';
import LiquidityWatch from './pages/LiquidityWatch';
import SignalsPage from './pages/SignalsPage';
import ExplainerPage from './pages/ExplainerPage';
import ModelPage from './pages/ModelPage';

// Components
import Sidebar from './components/Sidebar';
import Header from './components/Header';

export default function App() {
  const { isAuthenticated, activePage } = useStore();
  
  // Initialize WebSocket and live simulation data
  useWebSocket();

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  // Router switch
  const renderPage = () => {
    switch (activePage) {
      case 'overview':  return <Overview />;
      case 'banking':   return <BankingRisk />;
      case 'market':    return <MarketCrash />;
      case 'liquidity': return <LiquidityWatch />;
      case 'signals':   return <SignalsPage />;
      case 'explainer': return <ExplainerPage />;
      case 'model':     return <ModelPage />;
      default:          return <Overview />;
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--bg-base)' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Header />
        <main style={{ flex: 1, overflowY: 'auto' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activePage}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              style={{ minHeight: '100%' }}
            >
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
