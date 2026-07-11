import React from 'react';
import { StyleSheet, View, Text, ScrollView, Image, Pressable, Dimensions, Alert } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

interface StatCardProps {
  icon: string;
  value: string;
  label: string;
}

const StatCard = ({ icon, value, label }: StatCardProps) => (
  <View style={styles.statCard}>
    <Text style={styles.statIcon}>{icon}</Text>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

interface AchievementProps {
  icon: string;
  title: string;
  isActive: boolean;
}

const Achievement = ({ icon, title, isActive }: AchievementProps) => (
  <View style={styles.achievementItem}>
    <View style={[styles.achievementIconBg, !isActive && { backgroundColor: '#F8FAFC' }]}>
      <Text style={[styles.achievementIcon, !isActive && { opacity: 0.3 }]}>{icon}</Text>
    </View>
    <Text style={[styles.achievementTitle, !isActive && { color: '#94A3B8' }]}>{title}</Text>
  </View>
);

interface MenuItemProps {
  iconName: keyof typeof Ionicons.glyphMap;
  title: string;
  iconBgColor: string;
  iconColor: string;
  isDestructive?: boolean;
  hasChevron?: boolean;
  onPress?: () => void;
}

const MenuItem = ({ iconName, title, iconBgColor, iconColor, isDestructive, hasChevron = true, onPress }: MenuItemProps) => (
  <Pressable style={styles.menuItem} onPress={onPress}>
    <View style={styles.menuItemLeft}>
      <View style={[styles.menuIconBg, { backgroundColor: iconBgColor }]}>
        <Ionicons name={iconName} size={20} color={iconColor} />
      </View>
      <Text style={[styles.menuTitle, isDestructive && { color: '#EF4444' }]}>{title}</Text>
    </View>
    {hasChevron && <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />}
  </Pressable>
);

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Background shape */}
      <View style={[styles.topBackground, { height: 180 + insets.top }]} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 20 }]}>

        {/* Header Info */}
        <View style={styles.headerInfo}>
          <Text style={styles.nameText}>Prince V</Text>
          <Text style={styles.phoneText}>+91 98971 98971 · Mars</Text>
        </View>

        {/* Profile Picture */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            <View style={[styles.avatar, { backgroundColor: '#3B82F6', justifyContent: 'center', alignItems: 'center' }]}>
              <Text style={{ fontSize: 40, fontWeight: 'bold', color: '#fff' }}>P</Text>
            </View>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <StatCard icon="🚌" value="142" label="Trips" />
          <StatCard icon="🌿" value="68 kg" label="CO₂ Saved" />
          <StatCard icon="💰" value="₹2,840" label="Money Saved" />
        </View>

        {/* Achievements Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          <View style={styles.achievementsRow}>
            <Achievement icon="🥇" title="100 Trips" isActive={true} />
            <Achievement icon="🌿" title="Eco Rider" isActive={true} />
            <Achievement icon="⚡" title="Early Bird" isActive={true} />
            <Achievement icon="💰" title="Smart Saver" isActive={false} />
          </View>
        </View>

        {/* Menu List */}
        <View style={styles.menuContainer}>
          <MenuItem
            iconName="notifications-outline"
            title="Notifications"
            iconBgColor="#FEF9C3"
            iconColor="#EAB308"
          />
          <View style={styles.menuDivider} />

          <MenuItem
            iconName="location-outline"
            title="Location Services"
            iconBgColor="#F3E8FF"
            iconColor="#A855F7"
            onPress={() => Alert.alert('Location Services', 'you have enabled location GPS, happy journey')}
          />
          <View style={styles.menuDivider} />

          <MenuItem
            iconName="heart-outline"
            title="Preferences"
            iconBgColor="#FEE2E2"
            iconColor="#EF4444"
          />
          <View style={styles.menuDivider} />

          <MenuItem
            iconName="settings-outline"
            title="Settings"
            iconBgColor="#F1F5F9"
            iconColor="#64748B"
          />
          <View style={styles.menuDivider} />

          <MenuItem
            iconName="help-circle-outline"
            title="Help & Support"
            iconBgColor="#ECFDF5"
            iconColor="#10B981"
          />
          <View style={styles.menuDivider} />

          <MenuItem
            iconName="log-out-outline"
            title="Log Out"
            iconBgColor="#FEE2E2"
            iconColor="#EF4444"
            isDestructive={true}
            hasChevron={false}
            onPress={() => router.replace('/(auth)/login')}
          />
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F9F9',
  },
  topBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#E6F4FB', // Light blue
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  headerInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  nameText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  phoneText: {
    fontSize: 14,
    color: '#64748B',
  },
  avatarSection: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  avatarContainer: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },

  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    width: (width - 64) / 3, // 3 cards with 20px padding and 12px gap
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: '#64748B',
    textAlign: 'center',
  },
  sectionContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 16,
  },
  achievementsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  achievementItem: {
    alignItems: 'center',
    width: 60,
  },
  achievementIconBg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  achievementIcon: {
    fontSize: 22,
  },
  achievementTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#3B82F6',
    textAlign: 'center',
  },
  menuContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 8,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIconBg: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginLeft: 68,
    marginRight: 12,
  },
});
