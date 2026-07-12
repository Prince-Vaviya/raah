import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const router = useRouter();
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (role: 'commuter' | 'conductor') => {
    if (!employeeId || !password) {
      alert('Please enter credentials');
      return;
    }

    try {
      // Bypassing actual authentication as requested. Any credentials will work!
      
      // We still store a mock token so the rest of the app thinks we are logged in
      const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
      await AsyncStorage.setItem('token', 'mock_token_123');
      await AsyncStorage.setItem('user', JSON.stringify({ id: 1, email: employeeId, role: role }));

      if (role === 'commuter') {
        router.push('/(commuter)/');
      } else {
        router.push('/(conductor)/');
      }
    } catch (err) {
      console.error("Routing error", err);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Welcome to Raah</Text>
          <Text style={styles.subtitle}>Enter credentials and select your role</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>ID / Username</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. KA-BUS-4821 or commuter-1"
            value={employeeId}
            onChangeText={setEmployeeId}
            autoCapitalize="none"
          />

          <Text style={styles.label}>Password / OTP</Text>
          <TextInput
            style={styles.input}
            placeholder="Any password works"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <View style={styles.roleSelection}>
          <Text style={styles.roleTitle}>Select Your Role</Text>
          
          <TouchableOpacity 
            style={[styles.button, styles.commuterButton]}
            onPress={() => handleLogin('commuter')}
          >
            <Text style={styles.buttonText}>Login as Commuter</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.conductorButton]}
            onPress={() => handleLogin('conductor')}
          >
            <Text style={styles.buttonText}>Login as Conductor</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F8FB',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4285F4',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
  },
  form: {
    marginBottom: 32,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
    color: '#0F172A',
  },
  roleSelection: {
    alignItems: 'center',
    marginTop: 20,
  },
  roleTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 16,
  },
  button: {
    width: '100%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  commuterButton: {
    backgroundColor: '#10B981', // Success Green
  },
  conductorButton: {
    backgroundColor: '#4285F4', // Primary Blue
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
