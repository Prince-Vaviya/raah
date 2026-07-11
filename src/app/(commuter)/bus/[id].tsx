import React from 'react';
import {  StyleSheet, View, Text, Pressable, Dimensions, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {  Ionicons } from '@expo/vector-icons';
import {  SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import MapView, { Marker, Polyline } from 'react-native-maps';
import {  useJourney } from '@/context/commuter/JourneyContext';

const { width, height } = Dimensions.get('window');

// Mock route coordinates for the polyline (California Bay Area like the reference)
const routeCoordinates = [
  { latitude: 37.871, longitude: -122.272 }, // Berkeley
  { latitude: 37.865, longitude: -122.285 },
  { latitude: 37.840, longitude: -122.290 },
  { latitude: 37.810, longitude: -122.280 },
  { latitude: 37.804, longitude: -122.271 }, // Oakland
];

const defaultTimelineData = [
  { id: 1, name: 'Bandra Station (W)', time: '9:08 AM', status: 'passed' },
  { id: 2, name: 'Turner Road', time: '9:12 AM', status: 'passed' },
  { id: 3, name: 'Linking Road Junction', time: '9:15 AM', status: 'passed' },
  { id: 4, name: 'Santacruz Station', time: '9:22 AM', status: 'current' },
  { id: 5, name: 'Vile Parle (W)', time: '9:28 AM', status: 'upcoming' },
  { id: 6, name: 'Andheri Station', time: '9:36 AM', status: 'upcoming' },
  { id: 7, name: 'BKC Office', time: '9:40 AM', status: 'destination' },
];

const nerulTimelineData = [
  { id: 1, name: 'Sanpada', time: '10:00 AM', status: 'passed' },
  { id: 2, name: 'Juinagar', time: '10:15 AM', status: 'current' },
  { id: 3, name: 'Nerul', time: '10:30 AM', status: 'destination' },
];

export default function BusDetailScreen() {
  const { id, destination, fare, from } = useLocalSearchParams<{ id: string, destination?: string, fare?: string, from?: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const isNerulRoute = destination?.toLowerCase().includes('nerul');
  const activeTimeline = isNerulRoute ? nerulTimelineData : defaultTimelineData;
  const displayDestination = destination || 'Andheri Station';
  const displayFare = fare || '₹18';
  const displayTime = isNerulRoute ? '15 min' : '32 min';
  const displayFrom = from || 'Bandra Station (W)';

  const { activeJourney, boardBus } = useJourney();

  const handleBoardBus = () => {
    if (activeJourney) {
      Alert.alert(
        'Journey in Progress',
        'First mark your current journey as completed on the live map.',
        [
          { text: 'Go to Live Map', onPress: () => router.replace('/(tabs)/live') },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
    } else {
      boardBus(id, displayDestination, displayFrom);
      router.push(`/bus/journey/${id}?destination=${displayDestination}&from=${displayFrom}`);
    }
  };

  return (
    <View style={styles.container}>
      {/* Map View */}
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 37.840,
            longitude: -122.280,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
          }}
        >
          <Polyline
            coordinates={routeCoordinates}
            strokeColor="#4A90E2"
            strokeWidth={5}
          />
          <Marker coordinate={routeCoordinates[0]} pinColor="red" />
          <Marker coordinate={routeCoordinates[routeCoordinates.length - 1]} pinColor="blue" />
        </MapView>
      </View>

      {/* Header Overlay */}
      <View style={[styles.headerContainer, { paddingTop: insets.top || 20 }]}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </Pressable>
        <Text style={styles.headerTitle}>Route {id}</Text>
        <View style={styles.liveBadge}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>LIVE</Text>
        </View>
      </View>

      {/* Bottom Sheet */}
      <View style={styles.bottomSheet}>
        <View style={styles.dragHandle} />
        
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          {/* Info Header */}
          <View style={styles.infoHeader}>
            <View style={styles.infoLeft}>
              <View style={styles.busNumberBadge}>
                <Text style={styles.busNumberText}>{id}</Text>
              </View>
              <Text style={styles.destinationTitle}>{displayDestination}</Text>
            </View>
            <View style={styles.infoRight}>
              <Text style={styles.priceText}>{displayFare}</Text>
              <Text style={styles.timeText}>{displayTime}</Text>
            </View>
          </View>
          <Text style={styles.statusText}>On time • 3 min away</Text>

          {/* Feature Cards */}
          <View style={styles.featuresRow}>
            <View style={styles.featureCard}>
              <Ionicons name="location" size={20} color="#64748B" />
              <Text style={styles.featureText}>{activeTimeline.length} stops</Text>
            </View>

            <View style={styles.featureCard}>
              <Ionicons name="accessibility" size={20} color="#007AFF" />
              <Text style={styles.featureText}>Accessible</Text>
            </View>
            <View style={styles.featureCard}>
              <Ionicons name="people" size={20} color="#64748B" />
              <Text style={styles.featureText}>Low crowd</Text>
            </View>
          </View>

          {/* Timeline */}
          <Text style={styles.timelineTitle}>Route Timeline</Text>
          <View style={styles.timelineContainer}>
            {activeTimeline.map((stop, index) => (
              <View key={stop.id} style={styles.timelineItem}>
                <View style={styles.timelineLeft}>
                  <View style={[
                    styles.timelineNode,
                    stop.status === 'passed' && styles.nodePassed,
                    stop.status === 'current' && styles.nodeCurrent,
                    stop.status === 'upcoming' && styles.nodeUpcoming,
                    stop.status === 'destination' && styles.nodeDestination,
                  ]} />
                  {index < activeTimeline.length - 1 && (
                    <View style={[
                      styles.timelineLine,
                      stop.status === 'passed' ? styles.linePassed : styles.lineUpcoming
                    ]} />
                  )}
                </View>
                
                <View style={styles.timelineRight}>
                  <View style={styles.stopNameRow}>
                    <Text style={[
                      styles.stopName,
                      stop.status === 'current' && styles.stopNameCurrent,
                      stop.status === 'destination' && styles.stopNameDestination,
                    ]}>{stop.name}</Text>
                    {stop.status === 'current' && (
                      <View style={styles.busHereBadge}>
                        <Text style={styles.busHereText}>Bus here</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.stopTime}>{stop.time}</Text>
                </View>
              </View>
            ))}
          </View>

        </ScrollView>

        {/* Board Button */}
        <View style={[styles.bottomAction, { paddingBottom: insets.bottom || 20 }]}>
          <Pressable style={styles.boardButton} onPress={handleBoardBus}>
            <Text style={styles.boardButtonText}>Board Bus {id}</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mapContainer: {
    width: width,
    height: height * 0.45,
  },
  map: {
    ...StyleSheet.absoluteFill,
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: 'rgba(240, 248, 255, 0.85)',
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A365D',
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4CAF50',
    marginRight: 6,
  },
  liveText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  bottomSheet: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 100, // space for fixed button
  },
  infoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  busNumberBadge: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 12,
  },
  busNumberText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  destinationTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  infoRight: {
    alignItems: 'flex-end',
  },
  priceText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F59E0B',
  },
  timeText: {
    fontSize: 12,
    color: '#64748B',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
    marginBottom: 24,
  },
  featuresRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
    gap: 8,
  },
  featureCard: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  featureText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 8,
    fontWeight: '500',
  },
  timelineTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
  },
  timelineContainer: {
    paddingBottom: 20,
  },
  timelineItem: {
    flexDirection: 'row',
  },
  timelineLeft: {
    alignItems: 'center',
    width: 24,
    marginRight: 16,
  },
  timelineNode: {
    width: 12,
    height: 12,
    borderRadius: 6,
    zIndex: 2,
  },
  nodePassed: {
    backgroundColor: '#4A90E2',
    borderWidth: 2,
    borderColor: '#4A90E2',
  },
  nodeCurrent: {
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#10B981',
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  nodeUpcoming: {
    backgroundColor: '#F8FAFC',
    borderWidth: 2,
    borderColor: '#CBD5E1',
  },
  nodeDestination: {
    backgroundColor: '#4A90E2',
    borderWidth: 2,
    borderColor: '#4A90E2',
  },
  timelineLine: {
    width: 2,
    flex: 1,
    marginVertical: -2,
    zIndex: 1,
  },
  linePassed: {
    backgroundColor: '#4A90E2',
  },
  lineUpcoming: {
    backgroundColor: '#E2E8F0',
  },
  timelineRight: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 24,
  },
  stopNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stopName: {
    fontSize: 15,
    color: '#334155',
    fontWeight: '500',
  },
  stopNameCurrent: {
    color: '#10B981',
    fontWeight: 'bold',
  },
  stopNameDestination: {
    color: '#EF4444',
    fontWeight: 'bold',
  },
  busHereBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  busHereText: {
    color: '#10B981',
    fontSize: 10,
    fontWeight: 'bold',
  },
  stopTime: {
    fontSize: 13,
    color: '#94A3B8',
  },
  bottomAction: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  boardButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 24,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  boardButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
