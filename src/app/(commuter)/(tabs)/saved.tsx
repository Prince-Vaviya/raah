import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Image, Pressable, Modal, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useJourney, SavedPlace, Trip } from '@/context/commuter/JourneyContext';

interface RouteTagProps {
  route: string;
}

const RouteTag = ({ route }: RouteTagProps) => (
  <View style={styles.routeTag}>
    <Text style={styles.routeTagText}>{route}</Text>
  </View>
);

interface PlaceCardProps {
  title: string;
  address: string;
  icon: string;
  routes: string[];
  onPress: () => void;
}

const PlaceCard = ({ title, address, icon, routes, onPress }: PlaceCardProps) => (
  <Pressable style={styles.cardContainer} onPress={onPress}>
    <View style={styles.placeIconWrapper}>
      <Ionicons name={icon as any} size={24} color="#3B82F6" />
    </View>
    <View style={styles.placeInfo}>
      <Text style={styles.placeTitle}>{title}</Text>
      <Text style={styles.placeAddress} numberOfLines={1}>{address}</Text>
      <View style={styles.routesContainer}>
        {routes.map(r => <RouteTag key={r} route={r} />)}
      </View>
    </View>
    <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
  </Pressable>
);

interface TripCardProps {
  bus: string;
  routeTitle: string;
  duration: string;
  dateStr: string;
  cost: string;
  onPress: () => void;
}

const TripCard = ({ bus, routeTitle, duration, dateStr, cost, onPress }: TripCardProps) => (
  <Pressable style={styles.cardContainer} onPress={onPress}>
    <View style={styles.tripInfo}>
      <View style={styles.tripHeaderRow}>
        <View style={styles.busBadge}>
          <Text style={styles.busBadgeText}>{bus}</Text>
        </View>
        <Text style={styles.tripRouteTitle}>{routeTitle}</Text>
        <Text style={styles.tripDuration}>{duration}</Text>
      </View>
      <View style={styles.tripFooterRow}>
        <Text style={styles.tripDate}>{dateStr}</Text>
        <Text style={styles.tripCost}>{cost}</Text>
      </View>
    </View>
  </Pressable>
);

export default function SavedScreen() {
  const { savedPlaces, recentTrips, addSavedPlace } = useJourney();
  const [selectedItem, setSelectedItem] = useState<{ type: 'place' | 'trip', title: string, subtitle: string, desc?: string } | null>(null);
  
  // Add Place form state
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [newAlias, setNewAlias] = useState('');
  const [newAddress, setNewAddress] = useState('');

  const handleAddPlace = () => {
    if (newAlias && newAddress) {
      addSavedPlace(newAlias, newAddress);
      setNewAlias('');
      setNewAddress('');
      setIsAddModalVisible(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Image 
            source={require('@/assets/images/mascot.png')}
            style={styles.mascotImage}
            resizeMode="contain"
          />
          <Text style={styles.pageTitle}>Saved</Text>
          <Pressable style={styles.addButton} onPress={() => setIsAddModalVisible(true)}>
            <Ionicons name="add" size={24} color="#fff" />
          </Pressable>
        </View>

        {/* Your Places */}
        <Text style={styles.sectionTitle}>Your Places</Text>
        <View style={styles.listContainer}>
          {savedPlaces.map(place => (
            <PlaceCard 
              key={place.id}
              icon={place.icon} 
              title={place.alias} 
              address={place.address} 
              routes={place.routes} 
              onPress={() => setSelectedItem({ 
                type: 'place', 
                title: place.alias, 
                subtitle: place.address,
                desc: `Saved address for ${place.alias}: ${place.address}`
              })}
            />
          ))}
          
          <Pressable style={styles.addNewPlaceCard} onPress={() => setIsAddModalVisible(true)}>
            <Ionicons name="add" size={20} color="#64748B" />
            <Text style={styles.addNewPlaceText}>Add new place</Text>
          </Pressable>
        </View>

        {/* Recent Trips */}
        <Text style={[styles.sectionTitle, { marginTop: 32 }]}>Recent Trips</Text>
        <View style={styles.listContainer}>
          {recentTrips.map(trip => (
            <TripCard 
              key={trip.id}
              bus={trip.busId} 
              routeTitle={`${trip.from} → ${trip.destination}`} 
              duration={trip.duration} 
              dateStr={trip.dateStr} 
              cost={trip.cost} 
              onPress={() => setSelectedItem({ 
                type: 'trip', 
                title: `Trip on Bus ${trip.busId}`, 
                subtitle: `${trip.from} to ${trip.destination}`,
                desc: `You took this trip ${trip.dateStr.toLowerCase()} and it lasted ${trip.duration}.`
              })}
            />
          ))}
        </View>
        
      </ScrollView>

      {/* Details Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={selectedItem !== null}
        onRequestClose={() => setSelectedItem(null)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Pressable style={styles.closeButton} onPress={() => setSelectedItem(null)}>
              <Ionicons name="arrow-back" size={24} color="#333" />
            </Pressable>
            <Text style={styles.modalHeaderTitle}>
              {selectedItem?.type === 'place' ? 'Place Details' : 'Trip Details'}
            </Text>
          </View>
          
          <ScrollView contentContainerStyle={styles.modalContent}>
            <View style={styles.modalIconWrapper}>
              <Ionicons name={selectedItem?.type === 'place' ? 'map-outline' : 'bus-outline'} size={48} color="#3B82F6" />
            </View>
            <Text style={styles.modalTitle}>{selectedItem?.title}</Text>
            <Text style={styles.modalSubtitle}>{selectedItem?.subtitle}</Text>
            
            <View style={styles.modalDivider} />
            
            <Text style={styles.modalDescription}>
              {selectedItem?.desc}
            </Text>
            
            <Pressable style={styles.modalActionBtn} onPress={() => setSelectedItem(null)}>
              <Text style={styles.modalActionText}>Back to Saved</Text>
            </Pressable>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Add New Place Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isAddModalVisible}
        onRequestClose={() => setIsAddModalVisible(false)}
      >
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.addPlaceOverlay}>
          <View style={styles.addPlaceContainer}>
            <View style={styles.addPlaceHeader}>
              <Text style={styles.addPlaceTitle}>Add New Place</Text>
              <Pressable onPress={() => setIsAddModalVisible(false)}>
                <Ionicons name="close" size={24} color="#94A3B8" />
              </Pressable>
            </View>

            <Text style={styles.inputLabel}>Alias (e.g. Gym, Library)</Text>
            <TextInput 
              style={styles.input}
              placeholder="Enter alias"
              value={newAlias}
              onChangeText={setNewAlias}
            />

            <Text style={styles.inputLabel}>Address</Text>
            <TextInput 
              style={[styles.input, { height: 80 }]}
              placeholder="Enter full address"
              multiline
              value={newAddress}
              onChangeText={setNewAddress}
            />

            <Pressable style={styles.saveBtn} onPress={handleAddPlace}>
              <Text style={styles.saveBtnText}>Save Place</Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F9F9',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  headerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 16,
  },
  mascotImage: {
    width: 90,
    height: 90,
    marginLeft: -10,
  },
  pageTitle: {
    flex: 1,
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0F172A',
    marginLeft: 12,
  },
  addButton: {
    backgroundColor: '#3B82F6',
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 16,
  },
  listContainer: {
    gap: 12,
  },
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  placeIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  placeIconText: {
    fontSize: 24,
  },
  placeInfo: {
    flex: 1,
    marginRight: 12,
  },
  placeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  placeAddress: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 8,
  },
  routesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  routeTag: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  routeTagText: {
    color: '#3B82F6',
    fontSize: 12,
    fontWeight: 'bold',
  },
  addNewPlaceCard: {
    backgroundColor: 'transparent',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    gap: 8,
  },
  addNewPlaceText: {
    color: '#64748B',
    fontSize: 15,
    fontWeight: '600',
  },
  tripInfo: {
    flex: 1,
  },
  tripHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  busBadge: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 12,
  },
  busBadgeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  tripRouteTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  tripDuration: {
    fontSize: 13,
    color: '#94A3B8',
  },
  tripFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tripDate: {
    fontSize: 13,
    color: '#64748B',
  },
  tripCost: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#F59E0B',
  },
  
  // Details Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  closeButton: {
    padding: 4,
    marginRight: 16,
  },
  modalHeaderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  modalContent: {
    padding: 24,
    alignItems: 'center',
  },
  modalIconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 15,
    color: '#64748B',
    marginBottom: 24,
    textAlign: 'center',
  },
  modalDivider: {
    width: '100%',
    height: 1,
    backgroundColor: '#E2E8F0',
    marginBottom: 24,
  },
  modalDescription: {
    fontSize: 16,
    color: '#334155',
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 40,
  },
  modalActionBtn: {
    backgroundColor: '#0F172A',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 24,
    width: '100%',
    alignItems: 'center',
  },
  modalActionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // Add Place Modal Styles
  addPlaceOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  addPlaceContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  addPlaceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  addPlaceTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#0F172A',
    marginBottom: 20,
  },
  saveBtn: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  saveBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
