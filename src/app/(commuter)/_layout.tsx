import { Stack } from 'expo-router';
import { JourneyProvider } from '@/context/commuter/JourneyContext';
import { AlertsProvider } from '@/context/commuter/AlertsContext';

export default function CommuterLayout() {
  return (
    <AlertsProvider>
      <JourneyProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </JourneyProvider>
    </AlertsProvider>
  );
}
