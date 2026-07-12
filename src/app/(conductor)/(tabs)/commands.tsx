import React, { useState, useRef } from 'react';
import {  View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Animated, Modal, TextInput } from 'react-native';
import {  SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import {  Bell, Clock, AlertTriangle, CheckCircle, ArrowLeft, Check, Play } from 'lucide-react-native';
import {  useRouter, useNavigation } from 'expo-router';

export default function CommandsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  
  const [bannerVisible, setBannerVisible] = useState(false);
  const [bannerMessage, setBannerMessage] = useState('');
  const bannerAnim = useRef(new Animated.Value(-100)).current;

  // Realtime Command State
  const [activeCommand, setActiveCommand] = useState<any>(null);
  
  React.useEffect(() => {
    // Assuming trip_id is contextually available. For demo, we just listen to all commands.
    // Subscribe to new commands (mock WS for now)
    // const ws = new WebSocket(WS_URL);
    // ws.onmessage = (e) => { ... }
    // return () => ws.close();
  }, []);

  const [modalVisible, setModalVisible] = useState(false);
  const [clarifyReason, setClarifyReason] = useState('');
  
  const [isCommandExecuted, setIsCommandExecuted] = useState(false);

  const showBanner = (message: string, onComplete?: () => void) => {
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
    ]).start(() => {
      setBannerVisible(false);
      if (onComplete) onComplete();
    });
  };

  const handleAcceptCommand = () => {
    showBanner('Executing command ...', () => {
      setIsCommandExecuted(true);
    });
  };

  const handleRejectCommand = () => {
    setModalVisible(true);
  };

  const handleClarifySubmit = () => {
    if (clarifyReason.trim() !== '') {
      setModalVisible(false);
      setClarifyReason('');
      showBanner('Rejected command and clarified ...');
    }
  };

  const handleReturnToDashboard = () => {
    setIsCommandExecuted(false);
    // @ts-ignore
    router.push('Dashboard');
  };

  if (isCommandExecuted) {
    return (
      <View style={{ flex: 1, backgroundColor: '#F4F9FA' }}>
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <View style={styles.completedHeader}>
              <TouchableOpacity onPress={handleReturnToDashboard} style={styles.backButton}>
                <ArrowLeft size={24} color="#1A2D40" />
              </TouchableOpacity>
            </View>

            <View style={styles.executedCenter}>
              <View style={styles.successIconOuter}>
                <View style={styles.successIconInner}>
                  <Check size={40} color="#FFFFFF" />
                </View>
              </View>
              <Text style={styles.successLabel}>SUCCESS</Text>
              <Text style={styles.executedTitle}>Command Executed</Text>
              <Text style={styles.executedSubtitle}>Hold Bus confirmed. Operator has been notified.</Text>
            </View>

            <View style={styles.pillList}>
              <View style={styles.pillRow}>
                <Text style={styles.pillLabel}>Command</Text>
                <Text style={styles.pillValue}>Hold Bus • KA-01-AB-1234</Text>
              </View>
              <View style={styles.pillRow}>
                <Text style={styles.pillLabel}>Duration</Text>
                <Text style={styles.pillValue}>3 minutes</Text>
              </View>
              <View style={styles.pillRow}>
                <Text style={styles.pillLabel}>Updated ETA</Text>
                <Text style={styles.pillValue}>11:48 AM (+3 min)</Text>
              </View>
              <View style={styles.pillRow}>
                <Text style={styles.pillLabel}>Operator</Text>
                <Text style={styles.pillValue}>Control Room confirmed</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.continueButton} onPress={handleReturnToDashboard}>
              <Play size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.continueText}>Continue Journey</Text>
            </TouchableOpacity>

          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#F4F9FA' }}>
      
      {/* Banner Notification */}
      {bannerVisible && (
        <Animated.View style={[styles.bannerContainer, { transform: [{ translateY: bannerAnim }] }]}>
          <View style={styles.bannerContent}>
            <CheckCircle size={20} color="#10B981" />
            <Text style={styles.bannerText}>{bannerMessage}</Text>
          </View>
        </Animated.View>
      )}

      {/* Clarify Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Reject Command</Text>
            <Text style={styles.modalSubtitle}>Clarify your reason for rejecting</Text>
            
            <TextInput
              style={styles.modalInput}
              value={clarifyReason}
              onChangeText={setClarifyReason}
              placeholder="Enter reason..."
              autoFocus={true}
              multiline={true}
            />
            
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalCancel} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSubmit} onPress={handleClarifySubmit}>
                <Text style={styles.modalSubmitText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Mascot */}
        <View style={styles.mascotContainer}>
          <Image 
            source={require('@/assets/images/mascot.png')} 
            style={styles.mascotImage}
            resizeMode="contain"
          />
        </View>

        {/* Notification Text */}
        <View style={styles.notificationRow}>
          <Bell size={16} color={activeCommand ? "#EF4444" : "#64748B"} />
          <Text style={styles.notificationText}>
            {activeCommand ? "New command from Operator" : "No active commands"}
          </Text>
        </View>

        {/* Command Card */}
        {activeCommand && (
        <View style={styles.commandCard}>
          
          {/* Card Header */}
          <View style={styles.cardHeader}>
            <View style={styles.headerTopRow}>
              <Text style={styles.headerLabel}>OPERATOR COMMAND</Text>
              <View style={styles.priorityBadge}>
                <Text style={styles.priorityText}>HIGH PRIORITY</Text>
              </View>
            </View>
            <Text style={styles.commandTitle}>{activeCommand.type === 'HOLD' ? 'Hold Bus' : 'Reroute'}</Text>
            <Text style={styles.vehicleNumber}>Trip ID: {activeCommand.trip_id?.substring(0,8)}...</Text>
          </View>

          {/* Card Body */}
          <View style={styles.cardBody}>
            
            <View style={styles.infoRow}>
              <View style={styles.iconCircle}>
                <Clock size={16} color="#4285F4" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>DURATION</Text>
                <Text style={styles.infoValue}>{Math.round(activeCommand.duration_sec / 60)} Minutes</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={[styles.iconCircle, { backgroundColor: '#FEF9C3' }]}>
                <AlertTriangle size={16} color="#EAB308" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>REASON</Text>
                <Text style={styles.infoValue}>{activeCommand.reason || 'Traffic Congestion'}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={[styles.iconCircle, { backgroundColor: '#F1F5F9' }]}>
                <Clock size={16} color="#64748B" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>TIME RECEIVED</Text>
                <Text style={styles.infoValue}>{new Date(activeCommand.created_at).toLocaleTimeString()}</Text>
              </View>
            </View>

            {/* Operator Note */}
            <View style={styles.noteContainer}>
              <Text style={styles.noteLabel}>OPERATOR NOTE</Text>
              <Text style={styles.noteText}>
                {activeCommand.reason ? `Please follow operator instruction: ${activeCommand.reason}. Resume when cleared.` : `Please hold at current position. Resume when cleared.`}
              </Text>
            </View>

            <TouchableOpacity style={styles.acceptButton} onPress={async () => {
              // Update status to ACCEPTED via API
              try {
                const { fetchWithAuth } = await import('@/lib/api');
                await fetchWithAuth(`/commands/${activeCommand.id}/accept`, { method: 'POST' });
              } catch (err) {
                console.error("Failed to accept command", err);
              }
              handleAcceptCommand();
              setActiveCommand(null);
            }}>
              <CheckCircle size={20} color="#FFFFFF" />
              <Text style={styles.acceptText}>Accept Command</Text>
            </TouchableOpacity>

            <View style={styles.secondaryActions}>
              <TouchableOpacity style={styles.rejectButton} onPress={handleRejectCommand}>
                <Text style={styles.rejectText}>Reject</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
        )}

      </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F9FA',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    paddingBottom: 100,
  },
  mascotContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  mascotImage: {
    width: 140,
    height: 140,
  },
  notificationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  notificationText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  commandCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  cardHeader: {
    backgroundColor: '#1A2D40',
    padding: 24,
    paddingBottom: 28,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerLabel: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  priorityBadge: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  commandTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  vehicleNumber: {
    color: '#94A3B8',
    fontSize: 14,
  },
  cardBody: {
    padding: 24,
    paddingTop: 32,
    marginTop: -16,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E0EFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#64748B',
    marginBottom: 2,
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A2D40',
  },
  noteContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
    marginBottom: 24,
  },
  noteLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#64748B',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  noteText: {
    fontSize: 14,
    color: '#334155',
    lineHeight: 20,
  },
  acceptButton: {
    backgroundColor: '#10B981',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 18,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  acceptText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  secondaryActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  rejectButton: {
    flex: 1,
    backgroundColor: '#EF4444',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  rejectText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
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
    fontSize: 16,
    color: '#1E293B',
    marginBottom: 24,
    minHeight: 80,
    textAlignVertical: 'top',
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
    alignSelf: 'flex-start',
  },
  executedCenter: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 32,
  },
  successIconOuter: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(26, 45, 64, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  successIconInner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1A2D40',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4285F4',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
  successLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#14B8A6',
    letterSpacing: 1,
    marginBottom: 8,
  },
  executedTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1A2D40',
    marginBottom: 8,
  },
  executedSubtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
  },
  pillList: {
    marginBottom: 40,
  },
  pillRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  pillLabel: {
    fontSize: 14,
    color: '#64748B',
  },
  pillValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1A2D40',
  },
  continueButton: {
    backgroundColor: '#4285F4',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 18,
    borderRadius: 16,
    shadowColor: '#4285F4',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  continueText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
