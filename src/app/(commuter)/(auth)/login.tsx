import React, { useState } from 'react';
import {  StyleSheet, TextInput, Pressable, KeyboardAvoidingView, Platform, View, Alert } from 'react-native';
import {  Link, useRouter } from 'expo-router';
import {  ThemedView } from '@/components/commuter/themed-view';
import {  ThemedText } from '@/components/commuter/themed-text';
import {  SafeAreaView } from 'react-native-safe-area-context';
import {  Ionicons } from '@expo/vector-icons';
export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleContinue = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }
    if (email.toLowerCase() === 'demo@raah.com') {
      router.push('/(commuter)/(tabs)');
      return;
    }

    setLoading(true);
    try {
      const { API_URL } = await import('@/lib/api');
      const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
      
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await res.json();
      setLoading(false);
      
      if (!res.ok) {
        Alert.alert('Login Failed', data.error || 'Invalid credentials');
      } else {
        await AsyncStorage.setItem('token', data.token);
        
        // Redirect based on role
        if (data.user.role === 'CONDUCTOR') {
          router.push('/(conductor)/(tabs)');
        } else {
          router.push('/(commuter)/(tabs)');
        }
      }
    } catch (err: any) {
      setLoading(false);
      Alert.alert('Login Failed', err.message || 'Network error');
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
          <ThemedText style={styles.subtitle}>Enter your email and password to login.</ThemedText>
          
          <View style={styles.inputContainer}>
            <Ionicons name="mail" size={20} color="#999" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed" size={20} color="#999" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              placeholderTextColor="#999"
            />
          </View>

          <Pressable style={styles.button} onPress={handleContinue} disabled={loading}>
            <ThemedText style={styles.buttonText}>{loading ? 'Logging in...' : 'Continue'}</ThemedText>
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
