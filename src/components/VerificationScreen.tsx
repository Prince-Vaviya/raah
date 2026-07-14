import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function VerificationScreen({ 
  verificationStatus,
  onVerificationSubmitted
}: { 
  verificationStatus: string;
  onVerificationSubmitted: () => void;
}) {
  const [license, setLicense] = useState('');
  const [busNumber, setBusNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!license || !busNumber) {
      alert("Please enter both license and bus number.");
      return;
    }
    
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch('http://localhost:4000/api/auth/verification-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          licenseNumber: license,
          busNumber: busNumber,
        })
      });

      if (!res.ok) {
        throw new Error('Verification request failed');
      }

      const data = await res.json();
      const user = JSON.parse((await AsyncStorage.getItem('user')) || '{}');
      user.verificationStatus = 'PENDING';
      user.licenseNumber = license;
      user.assignedBusNumber = busNumber;
      await AsyncStorage.setItem('user', JSON.stringify(user));
      
      alert('Verification request submitted successfully.');
      onVerificationSubmitted();
    } catch (e) {
      alert('Error submitting request');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (verificationStatus === 'PENDING') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Account Under Review</Text>
        <Text style={styles.subtitle}>
          Your request has been submitted and is waiting for Operator approval. You will gain access once verified.
        </Text>
      </View>
    );
  }

  if (verificationStatus === 'REJECTED') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Verification Rejected</Text>
        <Text style={styles.subtitle}>
          Your verification was rejected by the operator. Please contact support.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Account Verification</Text>
      <Text style={styles.subtitle}>Please provide your license and assigned bus number to unlock your account.</Text>

      <TextInput
        style={styles.input}
        placeholder="License Number (e.g., MH-1234)"
        value={license}
        onChangeText={setLicense}
      />
      <TextInput
        style={styles.input}
        placeholder="Desired Bus Number (e.g., KA-BUS-4821)"
        value={busNumber}
        onChangeText={setBusNumber}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Submit for Verification</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#F0F8FB',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#334155',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
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
  button: {
    backgroundColor: '#4285F4',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
