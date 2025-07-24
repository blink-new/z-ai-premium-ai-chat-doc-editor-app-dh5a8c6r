import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { 
  Send, 
  Bot, 
  User, 
  Copy, 
  ChevronDown,
  Sparkles,
  Plus
} from 'lucide-react-native';
import { createClient } from '@blinkdotnew/sdk';

const { width } = Dimensions.get('window');

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  model?: string;
}

const AI_MODELS = [
  { id: 'gpt-4o-mini', name: 'GPT-4 Mini', description: 'Fast & efficient' },
  { id: 'gpt-4o', name: 'GPT-4', description: 'Most capable' },
  { id: 'claude-3-sonnet', name: 'Claude 3 Sonnet', description: 'Balanced performance' },
  { id: 'gemini-pro', name: 'Gemini Pro', description: 'Google\'s latest' },
];

const blink = createClient({
  projectId: 'z-ai-premium-ai-chat-doc-editor-app-dh5a8c6r',
  authRequired: false
});

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your AI assistant. I can help you with writing, analysis, coding, and much more. What would you like to work on today?',
      isUser: false,
      timestamp: new Date(),
      model: 'gpt-4o-mini'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [selectedModel, setSelectedModel] = useState(AI_MODELS[0]);
  const [showModelSelector, setShowModelSelector] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const { text } = await blink.ai.generateText({
        prompt: inputText.trim(),
        model: selectedModel.id,
        maxTokens: 1000,
      });

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: text,
        isUser: false,
        timestamp: new Date(),
        model: selectedModel.name,
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error. Please try again.',
        isUser: false,
        timestamp: new Date(),
        model: selectedModel.name,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }

    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const copyMessage = (text: string) => {
    // In a real app, you'd use Clipboard API
    console.log('Copied:', text);
  };

  const renderMessage = (message: Message) => (
    <Animated.View
      key={message.id}
      style={[
        styles.messageContainer,
        message.isUser ? styles.userMessage : styles.aiMessage,
      ]}
    >
      <View style={styles.messageHeader}>
        <View style={styles.avatarContainer}>
          {message.isUser ? (
            <User size={16} color="#6366F1" />
          ) : (
            <Bot size={16} color="#8B5CF6" />
          )}
        </View>
        <Text style={styles.senderName}>
          {message.isUser ? 'You' : message.model || 'AI'}
        </Text>
        {!message.isUser && (
          <TouchableOpacity
            style={styles.copyButton}
            onPress={() => copyMessage(message.text)}
          >
            <Copy size={14} color="#9CA3AF" />
          </TouchableOpacity>
        )}
      </View>
      <Text style={styles.messageText}>{message.text}</Text>
      <Text style={styles.timestamp}>
        {message.timestamp.toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit' 
        })}
      </Text>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#FAFBFF', '#F3F4F6']}
        style={styles.gradient}
      >
        {/* Header */}
        <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.headerTitle}>Z AI Chat</Text>
              <Text style={styles.headerSubtitle}>Powered by multiple AI models</Text>
            </View>
            <TouchableOpacity style={styles.newChatButton}>
              <Plus size={20} color="#6366F1" />
            </TouchableOpacity>
          </View>
          
          {/* Model Selector */}
          <TouchableOpacity
            style={styles.modelSelector}
            onPress={() => setShowModelSelector(!showModelSelector)}
          >
            <Sparkles size={16} color="#8B5CF6" />
            <Text style={styles.modelText}>{selectedModel.name}</Text>
            <ChevronDown size={16} color="#9CA3AF" />
          </TouchableOpacity>

          {showModelSelector && (
            <BlurView intensity={100} style={styles.modelDropdown}>
              {AI_MODELS.map((model) => (
                <TouchableOpacity
                  key={model.id}
                  style={[
                    styles.modelOption,
                    selectedModel.id === model.id && styles.selectedModel
                  ]}
                  onPress={() => {
                    setSelectedModel(model);
                    setShowModelSelector(false);
                  }}
                >
                  <View>
                    <Text style={styles.modelName}>{model.name}</Text>
                    <Text style={styles.modelDescription}>{model.description}</Text>
                  </View>
                  {selectedModel.id === model.id && (
                    <Sparkles size={16} color="#6366F1" />
                  )}
                </TouchableOpacity>
              ))}
            </BlurView>
          )}
        </Animated.View>

        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map(renderMessage)}
          {isLoading && (
            <View style={[styles.messageContainer, styles.aiMessage]}>
              <View style={styles.messageHeader}>
                <View style={styles.avatarContainer}>
                  <Bot size={16} color="#8B5CF6" />
                </View>
                <Text style={styles.senderName}>{selectedModel.name}</Text>
              </View>
              <View style={styles.typingIndicator}>
                <View style={styles.typingDot} />
                <View style={styles.typingDot} />
                <View style={styles.typingDot} />
              </View>
            </View>
          )}
        </ScrollView>

        {/* Input */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.inputContainer}
        >
          <BlurView intensity={100} style={styles.inputBlur}>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.textInput}
                value={inputText}
                onChangeText={setInputText}
                placeholder="Ask me anything..."
                placeholderTextColor="#9CA3AF"
                multiline
                maxLength={1000}
              />
              <TouchableOpacity
                style={[
                  styles.sendButton,
                  (!inputText.trim() || isLoading) && styles.sendButtonDisabled
                ]}
                onPress={sendMessage}
                disabled={!inputText.trim() || isLoading}
              >
                <Send size={20} color={(!inputText.trim() || isLoading) ? '#9CA3AF' : '#FFFFFF'} />
              </TouchableOpacity>
            </View>
          </BlurView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  newChatButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modelSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.2)',
  },
  modelText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  modelDropdown: {
    position: 'absolute',
    top: 120,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 8,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  modelOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
  },
  selectedModel: {
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
  },
  modelName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  modelDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  messagesContent: {
    paddingBottom: 20,
  },
  messageContainer: {
    marginBottom: 20,
    padding: 16,
    borderRadius: 16,
    maxWidth: width * 0.85,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderBottomRightRadius: 4,
  },
  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatarContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  senderName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  copyButton: {
    padding: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#374151',
  },
  timestamp: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 8,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#9CA3AF',
    marginRight: 4,
  },
  inputContainer: {
    paddingBottom: 100,
  },
  inputBlur: {
    margin: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
    maxHeight: 120,
    paddingVertical: 8,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  sendButtonDisabled: {
    backgroundColor: '#E5E7EB',
  },
});