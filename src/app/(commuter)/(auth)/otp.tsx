import React, { useState } from 'react';
import { StyleSheet, Pressable, KeyboardAvoidingView, Platform, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/commuter/themed-view';
import { ThemedText } from '@/components/commuter/themed-text';
import { SafeAreaView } from 'react-native-safe-area-context';
import { OtpInput } from 'react-native-otp-entry';

export default function OTPScreen() {
  const [otp, setOtp] = useState('');
  const router = useRouter();

  const handleVerify = () => {
    if (otp.length === 4) {
      router.push('/(auth)/location');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ThemedView style={styles.content}>
          <ThemedText type="title" style={styles.title}>Verify OTP</ThemedText>
          <ThemedText style={styles.subtitle}>Enter the 4-digit code sent to your number.</ThemedText>
          
          <OtpInput
            numberOfDigits={4}
            focusColor="#007AFF"
            focusStickBlinkingDuration={500}
            onTextChange={(text) => setOtp(text)}
            onFilled={(text) => {
              setOtp(text);
              if (text.length === 4) {
                router.push('/(auth)/location');
              }
            }}
            theme={{
              containerStyle: styles.otpContainer,
              pinCodeContainerStyle: styles.pinCodeContainer,
              pinCodeTextStyle: styles.pinCodeText,
            }}
          />

          <Pressable style={styles.button} onPress={handleVerify}>
            <ThemedText style={styles.buttonText}>Verify</ThemedText>
          </Pressable>
        </ThemedView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#ffffff' },
  container: { flex: 1 },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#ffffff'
  },
  title: { marginBottom: 8 },
  subtitle: { color: '#666', marginBottom: 32 },
  otpContainer: {
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  pinCodeContainer: {
    width: 60,
    height: 60,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
  },
  pinCodeText: {
    fontSize: 24,
    color: '#333',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
