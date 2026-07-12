import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import { fetchWithAuth } from './api';

export const LOCATION_TASK_NAME = 'BACKGROUND_LOCATION_TASK';

TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.error('Background Location Error:', error);
    return;
  }
  
  if (data) {
    const { locations } = data as any;
    if (locations && locations.length > 0) {
      const loc = locations[0];
      
      try {
        // We need a way to pass tripId. We can store it in AsyncStorage or pass it somehow.
        // TaskManager runs in the background, so we must rely on globally stored state.
        // For now, we'll try to fetch tripId from a secure store or async storage.
        const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
        const tripId = await AsyncStorage.getItem('activeTripId');
        
        if (tripId) {
          await fetchWithAuth('/telemetry', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              trip_id: tripId,
              lat: loc.coords.latitude,
              lng: loc.coords.longitude,
              current_speed: loc.coords.speed || 0,
              distance_along_route: 0, // In real life, calculate distance or let backend do it
              weather: 'clear',
              is_festival: 0,
              forward_headway: 0, // Let backend logic compute this
            })
          });
        }
      } catch (err) {
        console.error("Failed to post background telemetry", err);
      }
    }
  }
});
