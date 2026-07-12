import { useEffect, useState, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL, WS_URL } from './api';

export function useTelemetrySocket(tripId?: string | null) {
  const [telemetry, setTelemetry] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    let ws: WebSocket;
    let reconnectTimer: any;
    
    const connect = () => {
      ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        const channel = tripId ? `telemetry:${tripId}` : 'telemetry';
        ws.send(JSON.stringify({ type: 'subscribe', channels: [channel] }));
      };

      ws.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload.channel.startsWith('telemetry')) {
            setTelemetry(payload.data);
          }
        } catch (e) {
          console.error("WS parse error", e);
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
        // Attempt to reconnect after 3 seconds
        reconnectTimer = setTimeout(connect, 3000);
      };

      ws.onerror = (e) => {
        console.error("WS Error", e);
      };
    };

    connect();

    return () => {
      clearTimeout(reconnectTimer);
      if (wsRef.current) {
        if (tripId) {
           wsRef.current.send(JSON.stringify({ type: 'unsubscribe', channels: [`telemetry:${tripId}`] }));
        } else {
           wsRef.current.send(JSON.stringify({ type: 'unsubscribe', channels: ['telemetry'] }));
        }
        wsRef.current.close();
      }
    };
  }, [tripId]);

  return { telemetry, isConnected };
}
