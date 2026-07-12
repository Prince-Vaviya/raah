import React, { useState } from 'react';
import {  View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Switch, Dimensions, Alert } from 'react-native';
import {  SafeAreaView } from 'react-native-safe-area-context';
import {  MapPin, Calendar, TrendingUp, Bell, HelpCircle, Shield, LogOut, ChevronRight } from 'lucide-react-native';
import {  useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  return (
    <View style={styles.container}>
      {/* Curved Background Effect */}
      <View style={styles.headerBackgroundCurve} />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Profile Header */}
          <View style={styles.profileHeader}>
            <Image 
              source={require('@/assets/images/icon.png')} 
              style={styles.avatarImage}
            />
            <Text style={styles.profileName}>Rajesh Kumar</Text>
            <Text style={styles.profileId}>ID: KA-BUS-4821</Text>
          </View>

          {/* Stats Card */}
          <View style={styles.card}>
            <TouchableOpacity style={styles.listItem}>
              <View style={[styles.iconContainer, { backgroundColor: '#EEF2FF' }]}>
                <MapPin size={20} color="#6366F1" />
              </View>
              <View style={styles.listItemContent}>
                <Text style={styles.listItemLabel}>ASSIGNED DEPOT</Text>
                <Text style={styles.listItemValue}>Andheri East Depot</Text>
              </View>
              <ChevronRight size={20} color="#CBD5E1" />
            </TouchableOpacity>
            
            <View style={styles.divider} />
            
            <TouchableOpacity style={styles.listItem}>
              <View style={[styles.iconContainer, { backgroundColor: '#ECFDF5' }]}>
                <Calendar size={20} color="#10B981" />
              </View>
              <View style={styles.listItemContent}>
                <Text style={styles.listItemLabel}>SHIFT HISTORY</Text>
                <Text style={styles.listItemValue}>142 shifts • 2 years</Text>
              </View>
              <ChevronRight size={20} color="#CBD5E1" />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.listItem}>
              <View style={[styles.iconContainer, { backgroundColor: '#F1F5F9' }]}>
                <TrendingUp size={20} color="#10B981" />
              </View>
              <View style={styles.listItemContent}>
                <Text style={styles.listItemLabel}>PERFORMANCE</Text>
                <Text style={styles.listItemValue}>94% avg score</Text>
              </View>
              <ChevronRight size={20} color="#CBD5E1" />
            </TouchableOpacity>
          </View>

          {/* Preferences Card */}
          <View style={styles.card}>
            <View style={styles.listItem}>
              <View style={[styles.iconContainer, { backgroundColor: '#FFFBEB' }]}>
                <Bell size={20} color="#F59E0B" />
              </View>
              <View style={styles.listItemContent}>
                <Text style={styles.preferenceValue}>Notifications</Text>
              </View>
              <Switch
                trackColor={{ false: '#CBD5E1', true: '#4285F4' }}
                thumbColor={'#FFFFFF'}
                ios_backgroundColor="#CBD5E1"
                onValueChange={() => setNotificationsEnabled(!notificationsEnabled)}
                value={notificationsEnabled}
              />
            </View>
          </View>

          {/* Support Card */}
          <View style={styles.card}>
            <TouchableOpacity 
              style={styles.listItem}
              onPress={() => {
                Alert.alert(
                  "Logs Fetched",
                  "Successfully fetched the logs, sent to team. If any serious issues found we will contact you soon.",
                  [{ text: "OK" }]
                );
              }}
            >
              <View style={[styles.iconContainer, { backgroundColor: '#EFF6FF' }]}>
                <HelpCircle size={20} color="#3B82F6" />
              </View>
              <View style={styles.listItemContent}>
                <Text style={styles.preferenceValue}>Help & Support</Text>
              </View>
              <ChevronRight size={20} color="#CBD5E1" />
            </TouchableOpacity>
            
            <View style={styles.divider} />

            <TouchableOpacity 
              style={styles.listItem}
              onPress={() => {
                Alert.alert(
                  "Compliance & Responsibilities",
                  "You are a highly valued and responsible conductor—an essential pillar of our system. Your dedication ensures the safe, smooth, and efficient operation of our public transportation network.",
                  [{ text: "Understood" }]
                );
              }}
            >
              <View style={[styles.iconContainer, { backgroundColor: '#F1F5F9' }]}>
                <Shield size={20} color="#64748B" />
              </View>
              <View style={styles.listItemContent}>
                <Text style={styles.preferenceValue}>Compliance & Docs</Text>
              </View>
              <ChevronRight size={20} color="#CBD5E1" />
            </TouchableOpacity>
          </View>

          {/* Logout Button */}
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={async () => {
              const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
              await AsyncStorage.removeItem('token');
              await AsyncStorage.removeItem('user');
              router.dismissAll();
            }}
          >
            <LogOut size={20} color="#FFFFFF" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EAF3F8',
  },
  headerBackgroundCurve: {
    position: 'absolute',
    top: -width * 0.5,
    left: -width * 0.5,
    width: width * 2,
    height: width * 1.5,
    borderRadius: width,
    backgroundColor: '#E6F0F5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 2,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 100,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 20,
  },
  avatarImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    marginBottom: 16,
    backgroundColor: '#E0E7FF',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A2D40',
    marginBottom: 4,
  },
  profileId: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
    overflow: 'hidden',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  listItemContent: {
    flex: 1,
  },
  listItemLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#64748B',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  listItemValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A2D40',
  },
  preferenceValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A2D40',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginLeft: 80,
  },
  logoutButton: {
    backgroundColor: '#EF4444',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 16,
    marginTop: 10,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});
