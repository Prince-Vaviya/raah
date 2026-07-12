import React, { useState, useEffect } from 'react';
import { ActionChip } from '@/components/commuter/ui/ActionChip';
import { BusCard } from '@/components/commuter/ui/BusCard';
import { StopCard } from '@/components/commuter/ui/StopCard';
import { Ionicons } from '@expo/vector-icons';
import { Dimensions, Image, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';


const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [userName, setUserName] = useState('Commuter');
  const [nearbyStops, setNearbyStops] = useState<any[]>([]);
  const [nearbyBuses, setNearbyBuses] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
        const userStr = await AsyncStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          setUserName(user.name || user.email?.split('@')[0] || 'Commuter');
        }
      } catch (err) {}
    };
    
    const fetchDashboardData = async () => {
      try {
        const { getLiveRoutes, getRouteDetails } = await import('@/lib/api');
        
        const routesData = await getLiveRoutes();
        if (routesData && routesData.length > 0) {
          const topBuses = routesData.slice(0, 2);
          
          try {
            // Fetch details for nearby buses to get destination and fare
            const detailedBuses = await Promise.all(topBuses.map(async (bus: any) => {
              const details = await getRouteDetails(bus.id);
              const stops = details.busStops || [];
              const destination = stops.length > 0 ? stops[stops.length - 1].name : 'City Center';
              const price = stops.length > 0 ? `₹${(stops.length * 2.5).toFixed(0)}` : '₹12';
              return { ...bus, destination, price };
            }));
            setNearbyBuses(detailedBuses);

            // Fetch stops from the first bus
            if (detailedBuses[0].busStops && detailedBuses[0].busStops.length > 0) {
              setNearbyStops(detailedBuses[0].busStops.slice(0, 3));
            } else {
              const details = await getRouteDetails(topBuses[0].id);
              if (details.busStops) setNearbyStops(details.busStops.slice(0, 3));
            }
          } catch(err) {
            console.error("Failed to fetch bus details", err);
            setNearbyBuses(topBuses);
          }
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      }
    };

    fetchUser();
    fetchDashboardData();
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim().length > 0) {
      router.push({ pathname: '/search', params: { query: searchQuery } });
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Header Background */}
        <View style={styles.headerBackground}>
          {/* A simple curved shape using border radius */}
          <View style={styles.headerCurve} />
        </View>

        <SafeAreaView edges={['top']} style={styles.headerContent}>
          <View style={styles.topRow}>
            <View>
              <Text style={styles.greeting}>Good morning ☀️</Text>
              <Text style={styles.name}>{userName}</Text>
              <View style={styles.locationContainer}>
                <Ionicons name="location" size={14} color="#007AFF" />
                <Text style={styles.locationText}>Bandra West, Mumbai</Text>
              </View>
            </View>
            <View style={styles.headerActions}>
              <View style={[styles.avatar, { backgroundColor: '#3B82F6', justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#fff' }}>{userName.charAt(0).toUpperCase()}</Text>
              </View>
            </View>
          </View>

          {/* Search Bar area with mascot */}
          <View style={styles.searchSection}>
            {/* Mascot Placeholder */}
            <View style={styles.searchBar}>
              <Ionicons name="search" size={20} color="#999" />
              <TextInput
                style={styles.searchInput}
                placeholder="Where to?"
                placeholderTextColor="#999"
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={handleSearch}
                returnKeyType="search"
              />
              <Ionicons name="mic" size={20} color="#007AFF" />
            </View>
          </View>
        </SafeAreaView>

        <View style={styles.mainContent}>
          {/* Quick Actions */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.actionsScroll} contentContainerStyle={styles.actionsContent}>
            <ActionChip title="Home" subtitle="Bandra" iconName="home" iconColor="#FF9800" />
            <ActionChip title="Work" subtitle="BKC" iconName="briefcase" iconColor="#795548" />
            <ActionChip title="College" subtitle="Andheri" iconName="school" iconColor="#212225" />
            <ActionChip title="Saved" subtitle="Places" iconName="star" iconColor="#FFC107" />
          </ScrollView>

          {/* Nearby Stops */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Nearby Stops</Text>
            <Text style={styles.seeAll}>See all</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.stopsContent}>
            {nearbyStops.length > 0 ? nearbyStops.map(stop => (
              <StopCard key={stop.id} title={stop.name} distance="80m" routes="3 routes" />
            )) : (
              <View style={{ padding: 20 }}>
                <Text style={{ color: '#666' }}>No stops found nearby.</Text>
              </View>
            )}
          </ScrollView>

          {/* Nearby Buses */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Nearby Buses</Text>
            <Text style={styles.seeAll}>See all</Text>
          </View>
          <View style={styles.busesContent}>
            {nearbyBuses.length > 0 ? nearbyBuses.map((bus, i) => (
              <BusCard
                key={bus.id}
                number={bus.routeName || '101'}
                destination={bus.destination || 'City Center'}
                timeToArrive={`${3 + i * 4}`}
                isLive={true}
                price={bus.price || '₹12'}
                occupancyLevel={i === 0 ? 1 : 2}
                href={`/bus/${bus.id}`}
              />
            )) : (
              <View style={{ padding: 20 }}>
                <Text style={{ color: '#666' }}>No active buses nearby right now.</Text>
              </View>
            )}
          </View>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 300,
    backgroundColor: '#E1F0FF',
    overflow: 'hidden',
  },
  headerCurve: {
    position: 'absolute',
    bottom: -width * 0.5,
    left: -width * 0.2,
    width: width * 1.4,
    height: width,
    backgroundColor: '#F5F7FA',
    borderRadius: width,
  },
  headerContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greeting: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  searchSection: {
    marginTop: 32,
    flexDirection: 'row',
    alignItems: 'flex-end',
    position: 'relative',
    height: 80,
  },
  mascotPlaceholder: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: 80,
    height: 80,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 8,
  },
  searchBar: {
    flex: 1,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 56,
    borderRadius: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    marginRight: 12,
    fontSize: 16,
    color: '#000',
  },
  mainContent: {
    paddingTop: 32,
  },
  actionsScroll: {
    marginBottom: 32,
  },
  actionsContent: {
    paddingHorizontal: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  seeAll: {
    color: '#007AFF',
    fontWeight: '600',
    fontSize: 14,
  },
  stopsContent: {
    paddingHorizontal: 24,
    paddingBottom: 8,
    marginBottom: 24,
  },
  busesContent: {
    paddingHorizontal: 24,
  },
});
