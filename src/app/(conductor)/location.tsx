import { useRouter } from 'expo-router';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { Colors } from "@/constants/Colors";
import WavyHeader from '@/components/conductor/WavyHeader';
import { MapPin } from 'lucide-react-native';

type LocationPermissionScreenProps = {
  
};

export default function LocationPermissionScreen() { const router = useRouter();
  
  const handleProceed = () => {
    // Navigate to Home regardless of selection for now
    router.replace('/(tabs)/');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <WavyHeader />
        
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <MapPin size={64} color={Colors.primary} />
          </View>

          <Text style={styles.title}>Enable Location</Text>
          <Text style={styles.subtitle}>
            We need your location to show live tracking of your bus to the commuters and manage routes effectively.
          </Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.allowButton} onPress={handleProceed}>
              <Text style={styles.allowButtonText}>Allow Now</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.laterButton} onPress={handleProceed}>
              <Text style={styles.laterButtonText}>Maybe Later</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  iconContainer: {
    width: 120,
    height: 120,
    backgroundColor: Colors.white,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textLight,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 48,
  },
  buttonContainer: {
    width: '100%',
  },
  allowButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  allowButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  laterButton: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  laterButtonText: {
    color: Colors.textLight,
    fontSize: 16,
    fontWeight: '600',
  },
});
