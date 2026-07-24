import React from 'react';
import {  StyleSheet, View, Text, Image, Pressable, ScrollView } from 'react-native';
import {  useLocalSearchParams, useRouter } from 'expo-router';
import {  SafeAreaView } from 'react-native-safe-area-context';
import {  Ionicons } from '@expo/vector-icons';

export default function JourneyStartedScreen() {
  const { id, destination, from } = useLocalSearchParams<{ id: string, destination?: string, from?: string }>();
  const router = useRouter();

  const handleGoHome = () => {
    // Navigate directly back to the main home tab
    router.replace('/(commuter)/(tabs)');
  };

  const displayDestination = destination || 'Andheri Station';
  const displayFrom = from || 'Sanpada';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header (Back Button) */}
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={handleGoHome}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </Pressable>
        </View>

        {/* Mascot Image */}
        <View style={styles.imageContainer}>
          <Image 
            source={require('@/assets/images/mascot.png')} 
            style={styles.mascotImage}
            resizeMode="contain"
          />
        </View>

        {/* Text Content */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>Journey Started!</Text>
          <Text style={styles.subtitle}>
            You're on Bus {id} heading to {displayDestination}.
          </Text>
        </View>

        {/* Info Card */}
        <View style={styles.card}>
          
          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>Bus</Text>
            <Text style={styles.cardValue}>{id} — AC Express</Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>From</Text>
            <Text style={styles.cardValue}>{displayFrom}</Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>To</Text>
            <Text style={styles.cardValue}>{displayDestination}</Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>Stops remaining</Text>
            <Text style={styles.cardValue}>7 stops</Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>ETA</Text>
            <Text style={styles.cardValue}>9:40 AM</Text>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F8FF', // Light blue background matching reference
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  header: {
    paddingTop: 16,
    marginBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  mascotImage: {
    width: 280,
    height: 280,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 40,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#4B5563',
    textAlign: 'center',
    lineHeight: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  cardLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  cardValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    width: '100%',
  },
});
