import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AlertTriangle, Clock, Info, ChevronDown, ChevronUp } from 'lucide-react-native';
import { useNotif } from '@/context/conductor/NotifContext';

const mockAlerts = [
  {
    id: '1',
    title: 'Route Diversion ahead',
    type: 'warning',
    time: '10 mins ago',
    shortDescription: 'MG Road is closed due to construction.',
    detailedDescription: 'Take a left from the next junction towards SV Road. The diversion will add approximately 15 minutes to the route. Inform passengers connecting to Metro line 2A.',
  },
  {
    id: '2',
    title: 'Heavy Rain Warning',
    type: 'info',
    time: '1 hr ago',
    shortDescription: 'Expect delays up to 20 mins.',
    detailedDescription: 'Drive slowly on the Western Express Highway. Waterlogging reported near Andheri subway. Keep headlights on.',
  },
  {
    id: '3',
    title: 'Schedule Update',
    type: 'schedule',
    time: '3 hrs ago',
    shortDescription: 'Your next shift starts at 17:00',
    detailedDescription: 'Please report to the depot supervisor at 16:45. Vehicle assigned is MH-12-AB-9921 for Route 311.',
  },
];

export default function AlertsScreen() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const { readAlert } = useNotif();

  const getIcon = (type: string) => {
    switch(type) {
      case 'warning': return <AlertTriangle size={24} color="#EF4444" />;
      case 'info': return <Info size={24} color="#3B82F6" />;
      case 'schedule': return <Clock size={24} color="#F59E0B" />;
      default: return <Info size={24} color="#64748B" />;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.pageTitle}>Conductor Alerts</Text>
        
        {mockAlerts.map(alert => {
          const isExpanded = expandedId === alert.id;
          return (
            <TouchableOpacity
              key={alert.id}
              style={styles.alertCard}
              onPress={() => {
                if (isExpanded) {
                  setExpandedId(null);
                } else {
                  setExpandedId(alert.id);
                  if (!readIds.has(alert.id)) {
                    setReadIds(prev => new Set(prev).add(alert.id));
                    readAlert();
                  }
                }
              }}
              activeOpacity={0.7}
            >
              <View style={styles.cardHeader}>
                <View style={styles.iconContainer}>
                  {getIcon(alert.type)}
                </View>
                <View style={styles.headerTextContainer}>
                  <Text style={styles.alertTitle}>{alert.title}</Text>
                  <Text style={styles.timeText}>{alert.time}</Text>
                </View>
                {isExpanded ? (
                  <ChevronUp size={20} color="#94A3B8" />
                ) : (
                  <ChevronDown size={20} color="#94A3B8" />
                )}
              </View>
              
              <Text style={styles.shortDescription}>{alert.shortDescription}</Text>
              
              {isExpanded && (
                <View style={styles.expandedSection}>
                  <View style={styles.divider} />
                  <Text style={styles.detailedDescription}>{alert.detailedDescription}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F0F8FB',
  },
  scrollContent: {
    padding: 24,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A2D40',
    marginBottom: 24,
  },
  alertCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTextContainer: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 2,
  },
  timeText: {
    fontSize: 12,
    color: '#94A3B8',
  },
  shortDescription: {
    fontSize: 14,
    color: '#475569',
    marginTop: 4,
    marginLeft: 52, // Align with text, not icon
  },
  expandedSection: {
    marginTop: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginBottom: 12,
    marginLeft: 52,
  },
  detailedDescription: {
    fontSize: 14,
    color: '#334155',
    lineHeight: 20,
    marginLeft: 52,
  },
});
