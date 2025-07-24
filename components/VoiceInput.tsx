import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Alert,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Mic, MicOff, Volume2 } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

interface VoiceInputProps {
  onTranscription: (text: string) => void;
  isListening: boolean;
  onStartListening: () => void;
  onStopListening: () => void;
}

export function VoiceInput({ 
  onTranscription, 
  isListening, 
  onStartListening, 
  onStopListening 
}: VoiceInputProps) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    if (isListening) {
      // Start pulsing animation
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.3,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      );
      pulseAnimation.start();

      return () => pulseAnimation.stop();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isListening]);

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Scale animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    if (isListening) {
      onStopListening();
    } else {
      onStartListening();
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.voiceButton}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <Animated.View
          style={[
            styles.voiceButtonInner,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <BlurView intensity={100} style={styles.buttonBlur}>
            <Animated.View
              style={[
                styles.micContainer,
                isListening && styles.micContainerActive,
                {
                  transform: [{ scale: pulseAnim }],
                },
              ]}
            >
              {isListening ? (
                <MicOff size={24} color="#FFFFFF" />
              ) : (
                <Mic size={24} color="#6366F1" />
              )}
            </Animated.View>
          </BlurView>
        </Animated.View>
      </TouchableOpacity>
      
      {isListening && (
        <View style={styles.listeningIndicator}>
          <BlurView intensity={100} style={styles.indicatorBlur}>
            <View style={styles.indicatorContent}>
              <Volume2 size={16} color="#EF4444" />
              <Text style={styles.listeningText}>Listening...</Text>
              <View style={styles.waveform}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <Animated.View
                    key={i}
                    style={[
                      styles.waveBar,
                      {
                        height: Math.random() * 20 + 10,
                      },
                    ]}
                  />
                ))}
              </View>
            </View>
          </BlurView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  voiceButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
  },
  voiceButtonInner: {
    width: '100%',
    height: '100%',
  },
  buttonBlur: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  micContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  micContainerActive: {
    backgroundColor: '#EF4444',
  },
  listeningIndicator: {
    position: 'absolute',
    top: -60,
    borderRadius: 20,
    overflow: 'hidden',
  },
  indicatorBlur: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  indicatorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  listeningText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  waveform: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  waveBar: {
    width: 3,
    backgroundColor: '#EF4444',
    borderRadius: 1.5,
  },
});