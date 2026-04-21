import { useEffect, useRef } from 'react';
import useStore from '../store/useStore';

// Simulates WebSocket connection with periodic live updates
export function useWebSocket() {
  const wsRef = useRef(null);
  const { setWsConnected, addTicker, refreshRiskScores } = useStore();

  const TICKER_EVENTS = [
    () => ({ type: 'market',    msg: `VIX update: ${(Math.random() * 5 + 25).toFixed(2)}` }),
    () => ({ type: 'banking',   msg: `TED Spread: ${(Math.random() * 0.2 + 0.4).toFixed(3)}%` }),
    () => ({ type: 'liquidity', msg: `SOFR: ${(Math.random() * 0.05 + 5.31).toFixed(2)}%` }),
    () => ({ type: 'market',    msg: `S&P 500: ${(Math.random() * 100 - 50 + 4890).toFixed(0)}` }),
    () => ({ type: 'banking',   msg: `Yield curve: ${(-Math.random() * 0.5 + 0.1).toFixed(3)}%` }),
    () => ({ type: 'liquidity', msg: `MMF inflows: +$${(Math.random() * 20 + 5).toFixed(1)}B` }),
  ];

  useEffect(() => {
    setWsConnected(true);

    // Simulate live ticker feed (every 3 seconds)
    const tickerInterval = setInterval(() => {
      const event = TICKER_EVENTS[Math.floor(Math.random() * TICKER_EVENTS.length)]();
      addTicker({ ...event, ts: new Date() });
    }, 3000);

    // Simulate risk score refresh (every 60 seconds)
    const refreshInterval = setInterval(() => {
      refreshRiskScores();
    }, 60000);

    // Simulate occasional disconnects
    const jitterInterval = setInterval(() => {
      setWsConnected(false);
      setTimeout(() => setWsConnected(true), 1500);
    }, 45000);

    return () => {
      clearInterval(tickerInterval);
      clearInterval(refreshInterval);
      clearInterval(jitterInterval);
      setWsConnected(false);
    };
  }, []);
}
