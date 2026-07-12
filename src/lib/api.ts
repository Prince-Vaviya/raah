import AsyncStorage from '@react-native-async-storage/async-storage';

// In Expo/React Native, localhost points to the device itself.
// We need to use the explicit IP address of the dev machine or 10.0.2.2 for Android emulators.
// Assuming iOS Simulator for now, but often 127.0.0.1 or localhost works on iOS sim.
export const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.0.102:4000/api';
export const WS_URL = process.env.EXPO_PUBLIC_WS_URL || 'ws://192.168.0.102:4000/ws';

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
