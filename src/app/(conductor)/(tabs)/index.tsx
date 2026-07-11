import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, Animated, Modal, TextInput } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowRight, SkipForward, Clock, Users, MessageSquare, AlertCircle, Square, CheckCircle, ArrowLeft, MapPin, Route, User } from 'lucide-react-native';

const { width } = Dimensions.get('window');

type DashboardScreenProps = {
  
};

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  
  // Banner state
  const [bannerVisible, setBannerVisible] = useState(false);
  const [bannerMessage, setBannerMessage] = useState('');
  const bannerAnim = useRef(new Animated.Value(-100)).current;

  // Passenger modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [passengerCount, setPassengerCount] = useState('');

  // Trip completion state
  const [isTripCompleted, setIsTripCompleted] = useState(false);

  const showBanner = (message: string) => {
    setBannerMessage(message);
    setBannerVisible(true);
    Animated.sequence([
      Animated.timing(bannerAnim, {
        toValue: insets.top > 0 ? insets.top : 20,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(2500),
      Animated.timing(bannerAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => setBannerVisible(false));
  };

  const handleSkipStop = () => {
    showBanner('Skipped stop');
  };

  const handleReportDelay = () => {
    showBanner('Report sent to operator');
  };

  const handlePassengerSubmit = () => {
    if (passengerCount.trim() !== '') {
      setModalVisible(false);
      setPassengerCount('');
      showBanner('Passenger count reported');
    }
  };

  const handleOperatorChat = () => {
    // @ts-ignore
    router.push('/operatorChat');
  };

  const handleEndTrip = () => {
    setIsTripCompleted(true);
  };

  if (isTripCompleted) {
    return (
      <View style={{ flex: 1, backgroundColor: '#F0F8FB' }}>
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <View style={styles.completedHeader}>
              <TouchableOpacity onPress={() => setIsTripCompleted(false)} style={styles.backButton}>
                <ArrowLeft size={24} color="#1A2D40" />
              </TouchableOpacity>
            </View>

            <View style={styles.completedCenter}>
              <Image 
                source={require('@/assets/images/mascot.png')} 
                style={styles.completedImage}
                resizeMode="contain"
              />
              <Text style={styles.completedTitle}>Trip Completed</Text>
              <Text style={styles.completedSubtitle}>Route 507-C • Andheri East → CST Terminal</Text>
            </View>

            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Clock size={20} color="#4285F4" style={styles.statIcon} />
                <Text style={styles.statValue}>3h 51m</Text>
                <Text style={styles.statLabel}>Duration</Text>
              </View>

              <View style={styles.statCard}>
                <MapPin size={20} color="#EC4899" style={styles.statIcon} />
                <Text style={styles.statValue}>24 / 24</Text>
                <Text style={styles.statLabel}>Stops</Text>
              </View>

              <View style={styles.statCard}>
                <Route size={20} color="#14B8A6" style={styles.statIcon} />
                <Text style={styles.statValue}>47.2 km</Text>
                <Text style={styles.statLabel}>Distance</Text>
              </View>

              <View style={styles.statCard}>
                <User size={20} color="#F59E0B" style={styles.statIcon} />
                <Text style={styles.statValue}>412</Text>
                <Text style={styles.statLabel}>Passengers</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.endShiftButton}>
              <Text style={styles.endShiftText}>End Shift</Text>
            </TouchableOpacity>

          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#F0F8FB' }}>
      
      {/* Banner Notification */}
      {bannerVisible && (
        <Animated.View style={[styles.bannerContainer, { transform: [{ translateY: bannerAnim }] }]}>
          <View style={styles.bannerContent}>
            <CheckCircle size={20} color="#10B981" />
            <Text style={styles.bannerText}>{bannerMessage}</Text>
          </View>
        </Animated.View>
      )}

      {/* Passenger Count Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Passenger Count</Text>
            <Text style={styles.modalSubtitle}>Enter the number of passengers boarded</Text>
            
            <TextInput
              style={styles.modalInput}
              keyboardType="number-pad"
              value={passengerCount}
              onChangeText={setPassengerCount}
              placeholder="0"
              autoFocus={true}
            />
            
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalCancel} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSubmit} onPress={handlePassengerSubmit}>
                <Text style={styles.modalSubmitText}>Send</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Header Section */}
          <View style={styles.header}>
            <View style={styles.headerTextContainer}>
              <Text style={styles.routeText}>Route 507-C • MH-12</Text>
              <Text style={styles.titleText}>Live Journey</Text>
              
              <View style={styles.statusRow}>
                <View style={styles.onTimeChip}>
                  <View style={styles.dotGreen} />
                  <Text style={styles.onTimeText}>On Time</Text>
                </View>
              </View>
            </View>

            <Image 
              source={require('@/assets/images/mascot.png')} 
              style={styles.mascotImage}
              resizeMode="contain"
            />
          </View>

          {/* Current Stop Card */}
          <View style={styles.progressCard}>
            <View style={styles.progressHeaderRow}>
              <View>
                <Text style={styles.labelSmall}>CURRENT STOP</Text>
                <Text style={styles.stopName}>Vile Parle East</Text>
                <Text style={styles.stopIndex}>Stop 9 of 24</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.labelSmall}>ETA NEXT</Text>
                <Text style={styles.etaNextText}>4 min</Text>
              </View>
            </View>

            <View style={styles.progressBarContainer}>
              <View style={styles.progressLabels}>
                <Text style={styles.progressLabel}>Andheri East</Text>
                <Text style={styles.progressPercentage}>38%</Text>
                <Text style={styles.progressLabel}>CST Terminal</Text>
              </View>
              <View style={styles.progressBarBackground}>
                <View style={styles.progressBarFill} />
              </View>
            </View>

            <View style={styles.nextStopRow}>
              <View>
                <Text style={styles.labelSmall}>Next Stop</Text>
                <Text style={styles.nextStopName}>Santacruz West</Text>
              </View>
              <ArrowRight size={16} color="#CBD5E1" />
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.labelSmall}>Final ETA</Text>
                <Text style={styles.finalEtaText}>11:45 AM</Text>
              </View>
            </View>
          </View>

          {/* Quick Actions */}
          <Text style={styles.sectionTitle}>QUICK ACTIONS</Text>
          
          <View style={styles.actionsGrid}>
            <TouchableOpacity style={styles.actionCard} onPress={handleSkipStop}>
              <View style={[styles.actionIconBg, { backgroundColor: '#FEF9C3' }]}>
                <SkipForward size={20} color="#EAB308" />
              </View>
              <Text style={styles.actionText}>Skip Stop</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard} onPress={handleReportDelay}>
              <View style={[styles.actionIconBg, { backgroundColor: '#E0EFFF' }]}>
                <Clock size={20} color="#4285F4" />
              </View>
              <Text style={styles.actionText}>Report Delay</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard} onPress={() => setModalVisible(true)}>
              <View style={[styles.actionIconBg, { backgroundColor: '#ECFDF5' }]}>
                <Users size={20} color="#10B981" />
              </View>
              <Text style={styles.actionText}>Passenger{'\n'}Count</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard} onPress={handleOperatorChat}>
              <View style={[styles.actionIconBg, { backgroundColor: '#F3E8FF' }]}>
                <MessageSquare size={20} color="#A855F7" />
              </View>
              <Text style={styles.actionText}>Operator Chat</Text>
            </TouchableOpacity>
          </View>

          {/* Bottom Actions */}
          <View style={styles.bottomActionsRow}>
            <TouchableOpacity style={styles.emergencyButton}>
              <AlertCircle size={18} color="#FFFFFF" />
              <Text style={styles.emergencyText}>Emergency</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.endTripButton} onPress={handleEndTrip}>
              <Square size={16} color="#FFFFFF" fill="#FFFFFF" />
              <Text style={styles.endTripText}>End Trip</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    paddingBottom: 120,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  headerTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  routeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 4,
  },
  titleText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A2D40',
    marginBottom: 16,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  onTimeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  dotGreen: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
    marginRight: 6,
  },
  onTimeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
  },
  mascotImage: {
    width: 140,
    height: 140,
    marginRight: -20,
    marginTop: -10,
  },
  progressCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
  },
  progressHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  labelSmall: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 4,
  },
  stopName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1A2D40',
    marginBottom: 4,
  },
  stopIndex: {
    fontSize: 13,
    color: '#64748B',
  },
  etaNextText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4285F4',
  },
  progressBarContainer: {
    marginBottom: 24,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  progressPercentage: {
    fontSize: 12,
    color: '#94A3B8',
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 3,
    width: '100%',
  },
  progressBarFill: {
    height: '100%',
    width: '38%',
    backgroundColor: '#4285F4',
    borderRadius: 3,
  },
  nextStopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  nextStopName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A2D40',
  },
  finalEtaText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#EAB308',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#64748B',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  actionCard: {
    width: (width - 48 - 16) / 2, // 2 columns, minus padding and gap
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  actionIconBg: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A2D40',
    flex: 1,
  },
  bottomActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  emergencyButton: {
    flex: 1,
    backgroundColor: '#EF4444',
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 18,
    marginRight: 8,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  emergencyText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  endTripButton: {
    flex: 1,
    backgroundColor: '#4285F4',
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 18,
    marginLeft: 8,
    shadowColor: '#4285F4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  endTripText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  bannerContainer: {
    position: 'absolute',
    left: 20,
    right: 20,
    zIndex: 100,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bannerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginLeft: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    width: '85%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 24,
    textAlign: 'center',
  },
  modalInput: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 16,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 24,
  },
  modalActions: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  modalCancel: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    marginRight: 8,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748B',
  },
  modalSubmit: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    marginLeft: 8,
    borderRadius: 12,
    backgroundColor: '#10B981',
  },
  modalSubmitText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  completedHeader: {
    flexDirection: 'row',
    paddingVertical: 8,
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  completedCenter: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 32,
  },
  completedImage: {
    width: 220,
    height: 220,
    marginBottom: 16,
  },
  completedTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A2D40',
    marginBottom: 8,
  },
  completedSubtitle: {
    fontSize: 14,
    color: '#64748B',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  statCard: {
    width: (width - 48 - 16) / 2, // 2 cols minus padding and gap
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 3,
  },
  statIcon: {
    marginBottom: 12,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A2D40',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  endShiftButton: {
    backgroundColor: '#4285F4',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: '#4285F4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  endShiftText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
