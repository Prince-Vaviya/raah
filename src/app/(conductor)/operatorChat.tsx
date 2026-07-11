import { useRouter } from 'expo-router';
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Send } from 'lucide-react-native';

type OperatorChatScreenProps = {
  
};

type Message = {
  id: string;
  text: string;
  sender: 'operator' | 'conductor';
  timestamp: string;
};

export default function OperatorChatScreen() { const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  useEffect(() => {
    // Automated chat sequence
    const sequence = async () => {
      // 1. Wait a bit, then Operator starts typing
      await new Promise(r => setTimeout(r, 800));
      setIsTyping(true);
      
      // 2. Operator sends first message
      await new Promise(r => setTimeout(r, 2000));
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: '1',
        text: 'Good morning, theres a pothole on route 507-C, mg road, take a left and head to nearest next stop',
        sender: 'operator',
        timestamp: getCurrentTime()
      }]);

      // 3. Conductor (auto-reply for simulation purposes, or we could let the user type it)
      // The instructions said: "and conductor replying ok, then operator replying happy journey with emoji"
      // Let's automate the conductor's reply as requested to simulate the full interaction
      await new Promise(r => setTimeout(r, 2500));
      setMessages(prev => [...prev, {
        id: '2',
        text: 'ok',
        sender: 'conductor',
        timestamp: getCurrentTime()
      }]);

      // 4. Operator starts typing again
      await new Promise(r => setTimeout(r, 1000));
      setIsTyping(true);

      // 5. Operator sends final message
      await new Promise(r => setTimeout(r, 1500));
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: '3',
        text: 'Happy journey 🚌✨',
        sender: 'operator',
        timestamp: getCurrentTime()
      }]);
    };

    sequence();
  }, []);

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
              msg.sender === 'operator' ? styles.bubbleOperator : styles.bubbleConductor
            ]}
          >
            <Text style={[
              styles.messageText,
              msg.sender === 'operator' ? styles.textOperator : styles.textConductor
            ]}>
              {msg.text}
            </Text>
            <Text style={[
              styles.timeText,
              msg.sender === 'operator' ? styles.timeOperator : styles.timeConductor
            ]}>
              {msg.timestamp}
            </Text>
          </View>
        ))}

        {isTyping && (
          <View style={styles.typingIndicator}>
            <Text style={styles.typingText}>Operator is typing...</Text>
          </View>
        )}
      </ScrollView>

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <TextInput 
          style={styles.textInput}
          placeholder="Type a message..."
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity style={styles.sendButton}>
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
