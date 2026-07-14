import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { API_URL } from '@/lib/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import VerificationScreen from '../../components/VerificationScreen';

export default function ConductorLayout() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState<string | null>(null);

  useEffect(() => {
    checkVerification();
  }, []);

  const checkVerification = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        router.replace('/');
        return;
      }
      
      const res = await fetch(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const user = await res.json();
        setVerificationStatus(user.verificationStatus || 'PENDING'); // Default to PENDING if not set
        await AsyncStorage.setItem('user', JSON.stringify(user));
      } else {
        router.replace('/');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4285F4" />
      </View>
    );
  }

  if (verificationStatus !== 'VERIFIED') {
    return (
      <VerificationScreen 
        verificationStatus={verificationStatus || ''} 
        onVerificationSubmitted={() => checkVerification()} 
      />
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="operatorChat" />
      <Stack.Screen name="location" />
    </Stack>
  );
}
