import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronRight } from 'lucide-react-native';

const { width } = Dimensions.get('window');


export default function JourneyScreen() {
  const [timelineData, setTimelineData] = React.useState<any[]>([]);

  React.useEffect(() => {
    const fetchStops = async () => {
      try {
        const { getLiveRoutes, getRouteDetails } = await import('@/lib/api');
        const routes = await getLiveRoutes();
        const targetRoute = routes.find((r: any) => r.routeName === '507');
        
        if (targetRoute) {
          const routeDetails = await getRouteDetails(targetRoute.id);
          const data = routeDetails.busStops || [];
          
          const mapped = data.map((stop: any, index: number) => {
            let status = 'future';
            if (index < 6) status = 'past';
            else if (index === 6) status = 'current';
            
            return {
              id: stop.id,
              name: stop.name,
              time: '09:' + (10 + index * 5),
              status,
              isNow: status === 'current',
              pax: index <= 6 ? `${40 + (index % 5)} pax` : ''
            };
          });
          setTimelineData(mapped);
        }
      } catch (err) {
        console.error("Failed to fetch stops for journey", err);
      }
    };
    fetchStops();
  }, []);
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.titleText}>Journey Timeline</Text>
            
            <View style={styles.onTimeChip}>
              <View style={styles.dotGreen} />
              <Text style={styles.onTimeText}>On Time</Text>
            </View>
          </View>

          <Image 
            source={require('@/assets/images/mascot.png')} 
            style={styles.mascotImage}
            resizeMode="contain"
          />
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>71</Text>
            <Text style={styles.statLabelCurrent}>On Board</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>38%</Text>
            <Text style={styles.statLabelCurrent}>Progress</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>+3 min</Text>
            <Text style={styles.statLabelCurrent}>Delay</Text>
          </View>
        </View>

        {/* Operator Message */}
        <View style={styles.messageCard}>
          <View style={styles.messageHeader}>
            <ChevronRight size={14} color="#64748B" />
            <Text style={styles.messageHeaderTitle}>OPERATOR MESSAGE</Text>
          </View>
          <Text style={styles.messageText}>
            Route clear ahead. Maintain schedule. ETA adjustment sent.
          </Text>
          <Text style={styles.messageTime}>09:25 AM • Control Room</Text>
        </View>

        {/* Timeline */}
        <View style={styles.timelineContainer}>
          {timelineData.map((item, index) => {
            const isLast = index === timelineData.length - 1;
            
            let dotColor = '#334155'; // past
            let textColor = '#64748B'; // past default
            let nameColor = '#64748B';
            let timeColor = '#334155'; // past time
            let lineColor = '#334155'; // past line
            
            if (item.status === 'current') {
              dotColor = '#4285F4';
              nameColor = '#4285F4';
              textColor = '#94A3B8';
              timeColor = '#4285F4';
              lineColor = '#E2E8F0'; // line after current is light
            } else if (item.status === 'future') {
              dotColor = '#E2E8F0';
              nameColor = '#1A2D40';
              timeColor = '#94A3B8';
              lineColor = '#E2E8F0';
            }

            return (
              <View key={item.id} style={styles.timelineItem}>
                
                {/* Timeline visual (Line and Dot) */}
                <View style={styles.timelineVisual}>
                  <View style={[styles.dot, { backgroundColor: dotColor }]} />
                  {!isLast && <View style={[styles.line, { backgroundColor: lineColor }]} />}
                </View>

                {/* Timeline Content */}
                <View style={[styles.timelineContent, isLast && { paddingBottom: 0 }]}>
                  <View style={styles.stopInfo}>
                    <View style={styles.nameRow}>
                      <Text style={[styles.stopName, { color: nameColor }, item.status === 'future' && { fontWeight: 'bold' }]}>
                        {item.name}
                      </Text>
                      {item.isNow && (
                        <View style={styles.nowBadge}>
                          <Text style={styles.nowBadgeText}>NOW</Text>
                        </View>
                      )}
                    </View>
                    {item.pax ? (
                      <Text style={styles.paxText}>{item.pax}</Text>
                    ) : null}
                  </View>
                  
                  <View style={styles.timeContainer}>
                    <Text style={[styles.timeText, { color: timeColor }, item.status === 'past' && { fontWeight: 'bold' }]}>
                      {item.time}
                    </Text>
                  </View>
                </View>
                
              </View>
            );
          })}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F9FA',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  headerTextContainer: {
    flex: 1,
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A2D40',
    marginBottom: 12,
  },
  onTimeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  dotGreen: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
    marginRight: 6,
  },
  onTimeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#10B981',
  },
  mascotImage: {
    width: 100,
    height: 100,
    marginRight: -10,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A2D40',
    marginBottom: 4,
  },
  statLabelCurrent: {
    fontSize: 11,
    color: '#3B82F6',
    fontWeight: '600',
  },
  messageCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 3,
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  messageHeaderTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#64748B',
    marginLeft: 4,
    letterSpacing: 0.5,
  },
  messageText: {
    fontSize: 14,
    color: '#334155',
    lineHeight: 20,
    marginBottom: 8,
  },
  messageTime: {
    fontSize: 11,
    color: '#94A3B8',
  },
  timelineContainer: {
    paddingLeft: 4,
  },
  timelineItem: {
    flexDirection: 'row',
  },
  timelineVisual: {
    alignItems: 'center',
    width: 20,
    marginRight: 16,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 4,
  },
  line: {
    width: 2,
    flex: 1,
    marginTop: 4,
    marginBottom: 4,
  },
  timelineContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 24,
  },
  stopInfo: {
    flex: 1,
    paddingRight: 16,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  stopName: {
    fontSize: 15,
    fontWeight: '700',
  },
  nowBadge: {
    backgroundColor: '#E0EFFF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 8,
  },
  nowBadgeText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#4285F4',
  },
  paxText: {
    fontSize: 12,
    color: '#94A3B8',
  },
  timeContainer: {
    alignItems: 'flex-end',
  },
  timeText: {
    fontSize: 13,
  },
});
