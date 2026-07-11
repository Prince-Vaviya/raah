import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';

interface BusCardProps {
  number: string;
  destination: string;
  timeToArrive: string;
  isLive: boolean;
  price: string;
  occupancyLevel: 1 | 2 | 3;
  href?: any;
}

export function BusCard({ number, destination, timeToArrive, isLive, price, occupancyLevel, href }: BusCardProps) {
  const content = (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.numberBadge}>
          <Text style={styles.numberText}>{number}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.destination}>{destination}</Text>
          <Text style={styles.status}>On time</Text>
        </View>
        <View style={styles.timeContainer}>
          <Text style={styles.timeToArrive}>
            <Text style={styles.timeNumber}>{timeToArrive}</Text> min
          </Text>
          {isLive && (
            <View style={styles.liveBadge}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>LIVE</Text>
            </View>
          )}
        </View>
      </View>
      <View style={styles.bottomRow}>
        <View style={styles.detailsLeft}>
          <Ionicons name="ticket" size={14} color="#666" />
          <Text style={styles.price}>{price}</Text>
          
          <View style={styles.occupancyContainer}>
            <Ionicons name="people" size={14} color="#666" />
            <View style={styles.dots}>
              {[1, 2, 3].map((level) => (
                <View 
                  key={level} 
                  style={[
                    styles.dot, 
                    { backgroundColor: level <= occupancyLevel ? (occupancyLevel === 1 ? '#4CAF50' : occupancyLevel === 2 ? '#FFC107' : '#F44336') : '#E0E0E0' }
                  ]} 
                />
              ))}
            </View>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={16} color="#CCC" />
      </View>
    </View>
  );

  if (href) {
    return (
      <Link href={href} asChild>
        <Pressable>
          {content}
        </Pressable>
      </Link>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  numberBadge: {
    backgroundColor: '#4A90E2',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 16,
  },
  numberText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  infoContainer: {
    flex: 1,
  },
  destination: {
    fontSize: 16,
    marginBottom: 4,
    fontWeight: '600',
    color: '#000',
  },
  status: {
    fontSize: 13,
    color: '#4CAF50',
  },
  timeContainer: {
    alignItems: 'flex-end',
  },
  timeToArrive: {
    fontSize: 14,
    color: '#666',
  },
  timeNumber: {
    fontSize: 20,
    color: '#007AFF',
    fontWeight: '600',
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
    marginTop: 4,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4CAF50',
    marginRight: 4,
  },
  liveText: {
    fontSize: 10,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  detailsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    marginLeft: 4,
    marginRight: 16,
    fontSize: 14,
    color: '#333',
  },
  occupancyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dots: {
    flexDirection: 'row',
    marginLeft: 8,
    gap: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  }
});
