import React, { useRef, useState } from 'react';
import { StyleSheet, View, Text, Pressable, Dimensions, ScrollView, Animated, PanResponder } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { useJourney } from '@/context/commuter/JourneyContext';

const { width, height } = Dimensions.get('window');

// Mock route coordinates for the polyline
const routeCoordinates = [
  { latitude: 51.385, longitude: -0.115 }, // Thornton Rd area
  { latitude: 51.383, longitude: -0.113 },
  { latitude: 51.380, longitude: -0.114 }, // Purley Way
  { latitude: 51.377, longitude: -0.115 },
  { latitude: 51.374, longitude: -0.112 },
  { latitude: 51.371, longitude: -0.114 }, // Down Purley Way
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

export default function LiveScreen() {
  const router = useRouter();
  const { activeJourney, completeJourney } = useJourney();

  // Animation values for draggable bottom sheet
  const panY = useRef(new Animated.Value(0)).current;
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const MAX_DOWNWARD_TRANSLATE_Y = height * 0.45; // Max drag down distance
  const MIN_UPWARD_TRANSLATE_Y = 0; // Max drag up distance (original position)

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (e, gestureState) => {
        // Allow dragging down from original position OR up from collapsed position
        const newY = isCollapsed ? MAX_DOWNWARD_TRANSLATE_Y + gestureState.dy : gestureState.dy;
        
        // Constrain movement
        if (newY >= MIN_UPWARD_TRANSLATE_Y && newY <= MAX_DOWNWARD_TRANSLATE_Y) {
          panY.setValue(newY);
        }
      },
      onPanResponderRelease: (e, gestureState) => {
        if (gestureState.dy > 50 || gestureState.vy > 0.5) {
          // Snap down (collapse)
          Animated.spring(panY, {
            toValue: MAX_DOWNWARD_TRANSLATE_Y,
            useNativeDriver: true,
            bounciness: 0,
          }).start();
          setIsCollapsed(true);
        } else if (gestureState.dy < -50 || gestureState.vy < -0.5) {
          // Snap up (expand)
          Animated.spring(panY, {
            toValue: MIN_UPWARD_TRANSLATE_Y,
            useNativeDriver: true,
            bounciness: 0,
          }).start();
          setIsCollapsed(false);
        } else {
          // Snap back to closest state
          Animated.spring(panY, {
            toValue: isCollapsed ? MAX_DOWNWARD_TRANSLATE_Y : MIN_UPWARD_TRANSLATE_Y,
            useNativeDriver: true,
            bounciness: 0,
          }).start();
        }
      },
    })
  ).current;

  if (!activeJourney) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Ionicons name="bus-outline" size={64} color="#94A3B8" />
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#1E293B', marginTop: 16 }}>No Active Journey</Text>
        <Text style={{ fontSize: 15, color: '#64748B', marginTop: 8, textAlign: 'center', paddingHorizontal: 32 }}>
          You haven't boarded a bus yet. Search for a route and click Board to track it live!
        </Text>
        <Pressable 
          style={{ backgroundColor: '#007AFF', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 24, marginTop: 24 }}
          onPress={() => router.push('/')}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Find a Bus</Text>
        </Pressable>
      </View>
    );
  }

  const isNerulRoute = activeJourney.destination.toLowerCase().includes('nerul');
  const activeTimeline = isNerulRoute ? nerulTimelineData : defaultTimelineData;

  return (
    <View style={styles.container}>
      {/* Map View */}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 51.376,
          longitude: -0.114,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
      >
        <Polyline
          coordinates={routeCoordinates}
          strokeColor="#007AFF" // Blue line
          strokeWidth={6}
        />
        {/* Mock marker at start */}
        <Marker coordinate={routeCoordinates[0]}>
          <View style={styles.markerContainer}>
            <Ionicons name="bus" size={16} color="#fff" />
            <Text style={styles.markerText}>{activeJourney.from}</Text>
          </View>
        </Marker>
        {/* Mock current location marker */}
        <Marker coordinate={routeCoordinates[routeCoordinates.length - 1]}>
          <View style={styles.navigationArrow}>
            <Ionicons name="navigate" size={32} color="#007AFF" />
          </View>
        </Marker>
      </MapView>

      {/* Header Overlay */}
      <SafeAreaView style={styles.headerContainer} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>On Journey • Bus {activeJourney.busId}</Text>
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
        </View>
      </SafeAreaView>

      {/* Draggable Bottom Sheet Overlay */}
      <Animated.View 
        style={[
          styles.bottomSheet, 
          { transform: [{ translateY: panY }] }
        ]}
      >
        {/* Drag Handle Area */}
        <View style={styles.dragArea} {...panResponder.panHandlers}>
          <View style={styles.dragHandle} />
        </View>
        
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
          <View style={styles.stopInfoContainer}>
            <View style={styles.stopInfoLeft}>
              <Text style={styles.nextStopLabel}>Heading to</Text>
              <Text style={styles.headerStopName}>{activeJourney.destination}</Text>
              <Text style={styles.arrivingText}>Delay: None</Text>
            </View>
            
            <View style={styles.etaBox}>
              <Text style={styles.etaTime}>9:40</Text>
              <Text style={styles.etaLabel}>ETA</Text>
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

          <Pressable 
            style={{ backgroundColor: '#10B981', paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginTop: 16 }}
            onPress={completeJourney}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Mark Journey Completed</Text>
          </Pressable>
        </ScrollView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    width: width,
    height: height,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  markerContainer: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  markerText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  navigationArrow: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    width: '100%',
    backgroundColor: 'rgba(240, 248, 255, 0.95)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
    paddingTop: 8,
  },
  headerTitle: {
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
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: height * 0.6,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  dragArea: {
    width: '100%',
    paddingVertical: 12, // Increased touch area
    alignItems: 'center',
    justifyContent: 'center',
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
    marginBottom: 8,
  },
  stopInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  stopInfoLeft: {
    flex: 1,
  },
  nextStopLabel: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 4,
  },
  headerStopName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 8,
  },
  arrivingText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#10B981',
  },
  etaBox: {
    backgroundColor: '#EBF8FF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  etaTime: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  etaLabel: {
    fontSize: 12,
    color: '#64748B',
    textTransform: 'uppercase',
  },
  timelineTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
  },
  timelineContainer: {
    paddingBottom: 10,
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
});
