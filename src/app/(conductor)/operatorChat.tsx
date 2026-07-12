import { useRouter } from 'expo-router';
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Send } from 'lucide-react-native';

type Message = {
  id: string;
  message: string;
  sender_role: 'CONDUCTOR' | 'OPERATOR';
  created_at: string;
};

export default function OperatorChatScreen() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);
  const [tripId, setTripId] = useState<string | null>(null);

  useEffect(() => {
    const initChat = async () => {
      try {
        const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
        const storedTripId = await AsyncStorage.getItem('activeTripId');
        if (storedTripId) {
          setTripId(storedTripId);
        }
      } catch (err) {
        console.error("Failed to load tripId from storage", err);
      }
    };
    initChat();
  }, []);

  useEffect(() => {
    if (!tripId) return;

    // Initial fetch
    const fetchMessages = async () => {
      try {
        const { fetchWithAuth } = await import('@/lib/api');
        const res = await fetchWithAuth(`/chat?tripId=${tripId}`);
        if (res.ok) {
          const data = await res.json();
          setMessages(data as Message[]);
        }
      } catch (err) {
        console.error("Failed to fetch chat", err);
      }
    };
    fetchMessages();

    // Poll for new messages every 3 seconds
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [tripId]);

  const handleSend = async () => {
    if (!inputText.trim() || !tripId) return;
    
    const textToSend = inputText;
    setInputText('');
    
    const newMsg: Message = {
      id: Date.now().toString(),
      message: textToSend,
      sender_role: 'CONDUCTOR',
      created_at: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, newMsg]);

    try {
      const { fetchWithAuth } = await import('@/lib/api');
      await fetchWithAuth('/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tripId, message: textToSend })
      });
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#1A2D40" />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Central Operator</Text>
          <Text style={styles.headerSubtitle}>Online</Text>
        </View>
      </View>

      {/* Chat Area */}
      <ScrollView 
        ref={scrollViewRef}
        contentContainerStyle={styles.chatContainer}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        <Text style={styles.dateSeparator}>Today</Text>

        {messages.map((msg) => (
          <View 
            key={msg.id} 
            style={[
              styles.messageBubble, 
              msg.sender_role === 'OPERATOR' ? styles.bubbleOperator : styles.bubbleConductor
            ]}
          >
            <Text style={[
              styles.messageText,
              msg.sender_role === 'OPERATOR' ? styles.textOperator : styles.textConductor
            ]}>
              {msg.message}
            </Text>
            <Text style={[
              styles.timeText,
              msg.sender_role === 'OPERATOR' ? styles.timeOperator : styles.timeConductor
            ]}>
              {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
        ))}


      </ScrollView>

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <TextInput 
          style={styles.textInput}
          placeholder="Type a message..."
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={handleSend}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Send size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A2D40',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#10B981', // Green for online
    fontWeight: '500',
  },
  chatContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  dateSeparator: {
    textAlign: 'center',
    fontSize: 12,
    color: '#94A3B8',
    marginVertical: 16,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
  },
  bubbleOperator: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  bubbleConductor: {
    alignSelf: 'flex-end',
    backgroundColor: '#4285F4',
    borderBottomRightRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  textOperator: {
    color: '#1E293B',
  },
  textConductor: {
    color: '#FFFFFF',
  },
  timeText: {
    fontSize: 11,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  timeOperator: {
    color: '#94A3B8',
  },
  timeConductor: {
    color: '#E0EFFF',
  },
  typingIndicator: {
    alignSelf: 'flex-start',
    padding: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
    marginTop: 8,
  },
  typingText: {
    fontSize: 13,
    color: '#64748B',
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    maxHeight: 100,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#4285F4',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
});
