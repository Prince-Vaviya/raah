import { Stack } from 'expo-router';

export default function ConductorLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="operatorChat" />
      <Stack.Screen name="location" />
    </Stack>
  );
}
