import React, { useState } from 'react';
import {  StyleSheet, TextInput, Pressable, KeyboardAvoidingView, Platform, View } from 'react-native';
import {  Link, useRouter } from 'expo-router';
import {  ThemedView } from '@/components/commuter/themed-view';
import {  ThemedText } from '@/components/commuter/themed-text';
import {  SafeAreaView } from 'react-native-safe-area-context';

export default function SignupScreen() {
  const [mobileNumber, setMobileNumber] = useState('');
  const router = useRouter();

  const handleContinue = () => {
    if (mobileNumber.length > 0) {
      router.push('/(auth)/otp');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ThemedView style={styles.content}>
          <ThemedText type="title" style={styles.title}>Create Account</ThemedText>
          <ThemedText style={styles.subtitle}>Enter your mobile number to sign up.</ThemedText>
          
          <TextInput
            style={styles.input}
            placeholder="Mobile Number"
            keyboardType="phone-pad"
            value={mobileNumber}
            onChangeText={setMobileNumber}
            placeholderTextColor="#999"
          />

          <Pressable style={styles.button} onPress={handleContinue}>
            <ThemedText style={styles.buttonText}>Continue</ThemedText>
          </Pressable>

          <View style={styles.footer}>
            <ThemedText>Already have an account? </ThemedText>
            <Link href="/(auth)/login" asChild>
              <Pressable>
                <ThemedText style={styles.linkText}>Log in</ThemedText>
              </Pressable>
            </Link>
          </View>
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
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    marginBottom: 24,
    backgroundColor: '#f9f9f9',
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 32,
  },
  linkText: {
    color: '#007AFF',
    fontWeight: '600',
  }
});
