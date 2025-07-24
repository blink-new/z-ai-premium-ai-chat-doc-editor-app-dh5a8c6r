import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { Bot } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface StreamingMessageProps {
  text: string;
  isComplete: boolean;
  model: string;
}

export function StreamingMessage({ text, isComplete, model }: StreamingMessageProps) {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const fadeAnim = new Animated.Value(0);
  const cursorAnim = new Animated.Value(1);

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Cursor blinking animation
    if (!isComplete) {
      const cursorAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(cursorAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(cursorAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      );
      cursorAnimation.start();

      return () => cursorAnimation.stop();
    }
  }, [isComplete]);

  useEffect(() => {
    if (text && currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(text.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, 20); // Typing speed

      return () => clearTimeout(timer);
    }
  }, [text, currentIndex]);

  useEffect(() => {
    // Reset when new text comes in
    if (text !== displayText) {
      setCurrentIndex(0);
      setDisplayText('');
    }
  }, [text]);

  return (
    <Animated.View
      style={[
        styles.messageContainer,
        {
          opacity: fadeAnim,
        },
      ]}
    >
      <View style={styles.messageHeader}>
        <View style={styles.avatarContainer}>
          <Bot size={16} color="#8B5CF6" />
        </View>
        <Text style={styles.senderName}>{model}</Text>
        {!isComplete && (
          <View style={styles.streamingIndicator}>
            <View style={styles.streamingDot} />
            <Text style={styles.streamingText}>Generating...</Text>
          </View>
        )}
      </View>
      
      <View style={styles.messageContent}>
        <Text style={styles.messageText}>
          {displayText}
          {!isComplete && (
            <Animated.Text
              style={[
                styles.cursor,
                {
                  opacity: cursorAnim,
                },
              ]}
            >
              |
            </Animated.Text>
          )}
        </Text>
      </View>
      
      <Text style={styles.timestamp}>
        {new Date().toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit' 
        })}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  messageContainer: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    padding: 16,
    marginBottom: 20,
    maxWidth: width * 0.85,
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
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
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
  streamingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  streamingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  streamingText: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '500',
  },
  messageContent: {
    minHeight: 20,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#374151',
  },
  cursor: {
    fontSize: 16,
    color: '#6366F1',
    fontWeight: 'bold',
  },
  timestamp: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 8,
  },
});