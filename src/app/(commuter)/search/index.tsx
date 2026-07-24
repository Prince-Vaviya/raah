import React from 'react';
import {  StyleSheet, View, Text, Pressable, ScrollView } from 'react-native';
import {  useLocalSearchParams, useRouter } from 'expo-router';
import {  SafeAreaView } from 'react-native-safe-area-context';
import {  Ionicons } from '@expo/vector-icons';
import {  BusCard } from '@/components/commuter/ui/BusCard';
export default function SearchResultsScreen() {
  const { query } = useLocalSearchParams<{ query: string }>();
  const router = useRouter();

  const destination = query || 'Nerul';

  const [routes, setRoutes] = React.useState<any[]>([]);

  React.useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const { getLiveRoutes } = await import('@/lib/api');
        const data = await getLiveRoutes();
        if (data) setRoutes(data.slice(0, 5));
      } catch (err) {
        console.error('Failed to fetch routes', err);
      }
    };
    fetchRoutes();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </Pressable>
        <Text style={styles.headerTitle}>Available Routes</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Route Info Card */}
        <View style={styles.routeCard}>
          <View style={styles.routeRow}>
            <View style={styles.iconContainer}>
              <Ionicons name="location" size={16} color="#007AFF" />
            </View>
            <View style={styles.routeTextContainer}>
              <Text style={styles.routeLabel}>From (Current Location)</Text>
              <Text style={styles.routeValue}>Sanpada</Text>
            </View>
          </View>
          
          <View style={styles.routeDivider}>
            <View style={styles.verticalLine} />
          </View>

          <View style={styles.routeRow}>
            <View style={[styles.iconContainer, { backgroundColor: '#FEE2E2' }]}>
              <Ionicons name="flag" size={16} color="#EF4444" />
            </View>
            <View style={styles.routeTextContainer}>
              <Text style={styles.routeLabel}>Where to</Text>
              <Text style={styles.routeValue}>{destination}</Text>
            </View>
          </View>
        </View>

        {/* Results List */}
        <Text style={styles.sectionTitle}>Buses on this route</Text>
        
        <View style={styles.busesList}>
          {routes.length > 0 ? (
            routes.map(route => (
              <BusCard
                key={route.id}
                number={route.routeName}
                destination={`${destination}`}
                timeToArrive={Math.floor(Math.random() * 20 + 2).toString()} // Mock ETA for now
                isLive={true}
                price="₹15"
                occupancyLevel={Math.floor(Math.random() * 3) + 1} // Mock occupancy
                href={`/bus/${route.routeName}?destination=${destination}&fare=₹15&from=Sanpada`}
              />
            ))
          ) : (
            <Text style={{ color: '#64748B', textAlign: 'center', marginTop: 20 }}>Fetching routes...</Text>
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backButton: {
    marginRight: 16,
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  routeCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    zIndex: 2,
  },
  routeTextContainer: {
    flex: 1,
  },
  routeLabel: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 4,
  },
  routeValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
  },
  routeDivider: {
    height: 24,
    marginLeft: 15, // align with center of 32px icon
  },
  verticalLine: {
    width: 2,
    height: '100%',
    backgroundColor: '#E2E8F0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
  },
  busesList: {
    gap: 16,
  },
});
