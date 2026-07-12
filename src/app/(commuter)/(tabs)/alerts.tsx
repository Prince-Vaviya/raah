import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Image, Pressable, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAlerts, Alert } from '@/context/commuter/AlertsContext';

interface AlertCardProps {
  alert: Alert;
  icon: React.ReactNode;
  onRead: () => void;
}

const AlertCard = ({ alert, icon, onRead }: AlertCardProps) => {
  const { title, description, time, type, isRead } = alert;
  const [modalVisible, setModalVisible] = useState(false);

  // Determine styles based on alert type and read status
  let containerBg = '#fff';
  let leftBorderColor = '#000';

  if (isRead) {
    containerBg = '#F8FAFC'; // Light grey
    leftBorderColor = '#CBD5E1'; // Grey border
  } else {
    switch (type) {
      case 'warning':
        containerBg = '#FFFAEB';
        leftBorderColor = '#F59E0B'; // Amber/Yellow
        break;
      case 'danger':
        containerBg = '#FEF2F2';
        leftBorderColor = '#EF4444'; // Red
        break;
      case 'info':
        containerBg = '#F0F9FF';
        leftBorderColor = '#3B82F6'; // Blue
        break;
      case 'success':
        containerBg = '#ECFDF5';
        leftBorderColor = '#10B981'; // Green
        break;
    }
  }

  const handleOpen = () => {
    setModalVisible(true);
    if (!isRead) {
      onRead();
    }
  };

  return (
    <>
      <Pressable onPress={handleOpen}>
        <View style={[
          styles.cardContainer,
          { backgroundColor: containerBg, borderLeftColor: leftBorderColor }
        ]}>
          <View style={styles.cardHeader}>
            <View style={styles.titleContainer}>
              <View style={[styles.iconWrapper, isRead && { opacity: 0.5 }]}>
                {icon}
              </View>
              <Text style={[styles.cardTitle, isRead && styles.textRead]} numberOfLines={1}>{title}</Text>
            </View>
            <Text style={styles.timeText}>{time}</Text>
          </View>
          <Text style={[styles.cardDescription, isRead && styles.textRead]}>{description}</Text>
        </View>
      </Pressable>

      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Pressable style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Ionicons name="close" size={24} color="#333" />
            </Pressable>
            <Text style={styles.modalHeaderTitle}>Alert Details</Text>
          </View>
          
          <ScrollView contentContainerStyle={styles.modalContent}>
            <View style={[styles.modalIconWrapper, { borderColor: leftBorderColor, backgroundColor: containerBg }]}>
              {icon}
            </View>
            <Text style={styles.modalTitle}>{title}</Text>
            <Text style={styles.modalTime}>{time}</Text>
            
            <View style={styles.modalDivider} />
            
            <Text style={styles.modalDescription}>{description}</Text>
            
            <Pressable style={styles.modalActionBtn} onPress={() => setModalVisible(false)}>
              <Text style={styles.modalActionText}>Back to Alerts</Text>
            </Pressable>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </>
  );
};

export default function AlertsScreen() {
  const router = useRouter();
  const { alerts, unreadCount, markAllAsRead, markAsRead } = useAlerts();

  const getIconForType = (type: string) => {
    switch (type) {
      case 'warning': return <Ionicons name="warning" size={18} color="#F59E0B" />;
      case 'danger': return <Text style={{ fontSize: 16 }}>🚨</Text>;
      case 'info': return <Ionicons name="information-circle" size={18} color="#3B82F6" />;
      case 'success': return (
        <View style={{ backgroundColor: '#10B981', borderRadius: 4, width: 20, height: 20, justifyContent: 'center', alignItems: 'center' }}>
          <Ionicons name="checkmark" size={14} color="#fff" />
        </View>
      );
      default: return <Ionicons name="notifications" size={18} color="#333" />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Top Action Bar with Back Button */}
        <View style={styles.topBar}>
          <Pressable style={styles.backButton} onPress={() => router.push('/')}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </Pressable>
        </View>

        {/* Header Section */}
        <View style={styles.headerSection}>
          <Image
            source={require('@/assets/images/alerts.png')}
            style={styles.mascotImage}
            resizeMode="contain"
          />
          <Text style={styles.pageTitle}>Alerts</Text>
          <Pressable style={styles.markReadButton} onPress={markAllAsRead}>
            <Text style={[styles.markReadText, unreadCount === 0 && { color: '#94A3B8' }]}>
              {unreadCount === 0 ? 'All caught up' : 'Mark all read'}
            </Text>
          </Pressable>
        </View>

        {/* Alerts List */}
        <View style={styles.alertsList}>
          {alerts.map((alert) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              icon={getIconForType(alert.type)}
              onRead={() => markAsRead(alert.id)}
            />
          ))}
        </View>

      </ScrollView>
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
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 8,
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
  headerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
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
    marginLeft: 8,
  },
  markReadButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  markReadText: {
    color: '#007AFF',
    fontSize: 15,
    fontWeight: '600',
  },
  alertsList: {
    gap: 16,
  },
  cardContainer: {
    borderRadius: 20,
    padding: 16,
    borderLeftWidth: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  iconWrapper: {
    marginRight: 8,
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
    flex: 1,
  },
  timeText: {
    fontSize: 12,
    color: '#94A3B8',
  },
  cardDescription: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
    paddingLeft: 32,
  },
  textRead: {
    color: '#94A3B8',
  },
  // Modal Styles
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
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalTime: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 24,
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
});
