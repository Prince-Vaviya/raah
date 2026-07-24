import AsyncStorage from '@react-native-async-storage/async-storage';

import Constants from 'expo-constants';

const getHostIP = () => {
  if (process.env.EXPO_PUBLIC_API_URL) return process.env.EXPO_PUBLIC_API_URL;
  const debuggerHost = Constants.expoConfig?.hostUri;
  if (debuggerHost) {
    return `http://${debuggerHost.split(':')[0]}:4000/api`;
  }
  return 'http://localhost:4000/api';
};

const getWsIP = () => {
  if (process.env.EXPO_PUBLIC_WS_URL) return process.env.EXPO_PUBLIC_WS_URL;
  const debuggerHost = Constants.expoConfig?.hostUri;
  if (debuggerHost) {
    return `ws://${debuggerHost.split(':')[0]}:4000/ws`;
  }
  return 'ws://localhost:4000/ws';
};

export const API_URL = getHostIP();
export const WS_URL = getWsIP();

export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = await AsyncStorage.getItem('token');
  return fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`
    }
  });
}

import { cacheRoutes, getCachedRoutes, initDB } from './db';

// Ensure DB is initialized
let dbInitialized = false;

export async function getLiveRoutes() {
  if (!dbInitialized) {
    await initDB();
    dbInitialized = true;
  }

  try {
    const res = await fetch(`${API_URL}/routes`);
    if (!res.ok) throw new Error('Failed to fetch routes');
    const data = await res.json();

    // Cache for offline use (fire and forget to not block UI)
    cacheRoutes(data).catch(e => console.error('Cache write failed:', e));

    return data;
  } catch (err) {
    console.warn('Network failed, falling back to cache:', err);
    const cachedData = await getCachedRoutes();
    return cachedData;
  }
}

export async function getRouteDetails(id: string) {
  const res = await fetch(`${API_URL}/routes/${id}`);
  if (!res.ok) throw new Error('Failed to fetch route');
  return res.json();
}

export async function getLiveBuses() {
  const res = await fetch(`${API_URL}/telemetry`);
  if (!res.ok) throw new Error('Failed to fetch buses');
  return res.json();
}

export async function getBusCommands(tripId: string) {
  const res = await fetchWithAuth(`/commands?tripId=${tripId}`);
  if (!res.ok) throw new Error('Failed to fetch commands');
  return res.json();
}

export async function respondToCommand(id: string, status: 'ACCEPTED' | 'REJECTED') {
  const res = await fetchWithAuth(`/commands/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });
  if (!res.ok) throw new Error('Failed to update command');
  return res.json();
}
