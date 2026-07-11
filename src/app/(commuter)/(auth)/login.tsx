import React, { useState } from 'react';
import {  StyleSheet, TextInput, Pressable, KeyboardAvoidingView, Platform, View } from 'react-native';
import {  Link, useRouter } from 'expo-router';
import {  ThemedView } from '@/components/commuter/themed-view';
import {  ThemedText } from '@/components/commuter/themed-text';
import {  SafeAreaView } from 'react-native-safe-area-context';
import {  Ionicons } from '@expo/vector-icons';

export default function LoginScreen() {
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
          <View style={styles.iconWrapper}>
            <Ionicons name="person-circle" size={80} color="#007AFF" />
          </View>
          <ThemedText type="title" style={styles.title}>Welcome back!</ThemedText>
          <ThemedText style={styles.subtitle}>Enter your mobile number to login.</ThemedText>
          
          <View style={styles.inputContainer}>
            <Ionicons name="call" size={20} color="#999" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Mobile Number"
              keyboardType="phone-pad"
              value={mobileNumber}
              onChangeText={setMobileNumber}
              placeholderTextColor="#999"
            />
          </View>

          <Pressable style={styles.button} onPress={handleContinue}>
            <ThemedText style={styles.buttonText}>Continue</ThemedText>
          </Pressable>

          <View style={styles.footer}>
            <ThemedText>Don&apos;t have an account? </ThemedText>
            <Link href="/(auth)/signup" asChild>
              <Pressable>
                <ThemedText style={styles.linkText}>Sign up</ThemedText>
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
  iconWrapper: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: { marginBottom: 8, textAlign: 'center' },
  subtitle: { color: '#666', marginBottom: 32, textAlign: 'center' },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    backgroundColor: '#f9f9f9',
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
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
