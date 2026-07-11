import React from 'react';
import { StyleSheet, Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/commuter/themed-view';
import { ThemedText } from '@/components/commuter/themed-text';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LocationPermissionScreen() {
  const router = useRouter();

  const handleProceed = () => {
    // Navigate to the main tabs layout
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.content}>
        <View style={styles.iconContainer}>
          <ThemedText style={styles.icon}>📍</ThemedText>
        </View>

        <ThemedText type="title" style={styles.title}>Allow Location</ThemedText>
        <ThemedText style={styles.subtitle}>
          We need your location to show you nearby stops and buses in real-time.
        </ThemedText>
        
        <View style={styles.actions}>
          <Pressable style={styles.primaryButton} onPress={handleProceed}>
            <ThemedText style={styles.primaryButtonText}>Allow Now</ThemedText>
          </Pressable>

          <Pressable style={styles.secondaryButton} onPress={handleProceed}>
            <ThemedText style={styles.secondaryButtonText}>Maybe Later</ThemedText>
          </Pressable>
        </View>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#ffffff' },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff'
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0f8ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  icon: {
    fontSize: 40,
  },
  title: { marginBottom: 12, textAlign: 'center' },
  subtitle: { color: '#666', textAlign: 'center', marginBottom: 48, lineHeight: 24 },
  actions: {
    width: '100%',
    gap: 16,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  }
});
