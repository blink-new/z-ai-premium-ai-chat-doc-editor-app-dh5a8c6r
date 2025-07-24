import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Animated,
} from 'react-native';
import { BlurView } from 'expo-blur';
import {
  Mic,
  MicOff,
  Play,
  Pause,
  Square,
  Download,
  Share,
  Trash2,
  Clock,
  FileAudio,
  X,
  Volume2,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { createClient } from '@blinkdotnew/sdk';

const blink = createClient({
  projectId: 'z-ai-premium-ai-chat-doc-editor-app-dh5a8c6r',
  authRequired: false
});

interface VoiceTranscriberProps {
  onTranscriptionComplete: (text: string, audioUri?: string) => void;
  onClose: () => void;
}

interface Recording {
  id: string;
  duration: number;
  transcription: string;
  timestamp: Date;
  audioUri?: string;
}

export function VoiceTranscriber({ onTranscriptionComplete, onClose }: VoiceTranscriberProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [currentRecording, setCurrentRecording] = useState<Recording | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [isTranscribing, setIsTranscribing] = useState(false);
  
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const waveAnims = useRef(Array.from({ length: 5 }, () => new Animated.Value(0.3))).current;
  const recordingTimer = useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    if (isRecording) {
      startPulseAnimation();
      startWaveAnimation();
      startRecordingTimer();
    } else {
      stopAnimations();
      stopRecordingTimer();
    }

    return () => {
      stopAnimations();
      stopRecordingTimer();
    };
  }, [isRecording]);

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const startWaveAnimation = () => {
    const animateWave = (index: number) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(waveAnims[index], {
            toValue: 1,
            duration: 300 + Math.random() * 400,
            useNativeDriver: true,
          }),
          Animated.timing(waveAnims[index], {
            toValue: 0.3,
            duration: 300 + Math.random() * 400,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    waveAnims.forEach((_, index) => {
      setTimeout(() => animateWave(index), index * 100);
    });
  };

  const stopAnimations = () => {
    pulseAnim.stopAnimation();
    waveAnims.forEach(anim => anim.stopAnimation());
    pulseAnim.setValue(1);
    waveAnims.forEach(anim => anim.setValue(0.3));
  };

  const startRecordingTimer = () => {
    setRecordingDuration(0);
    recordingTimer.current = setInterval(() => {
      setRecordingDuration(prev => prev + 1);
    }, 1000);
  };

  const stopRecordingTimer = () => {
    if (recordingTimer.current) {
      clearInterval(recordingTimer.current);
      recordingTimer.current = null;
    }
  };

  const startRecording = async () => {
    try {
      setIsRecording(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (error) {
      Alert.alert('Recording Error', 'Failed to start recording. Please check microphone permissions.');
      setIsRecording(false);
    }
  };

  const stopRecording = async () => {
    try {
      setIsRecording(false);
      setIsTranscribing(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

      // Simulate transcription process
      await new Promise(resolve => setTimeout(resolve, 2000));

      const mockTranscription = `This is a sample voice transcription from a ${recordingDuration} second recording. The AI has successfully converted your speech to text with high accuracy. You can now edit this text or use it in your documents.`;

      const newRecording: Recording = {
        id: Date.now().toString(),
        duration: recordingDuration,
        transcription: mockTranscription,
        timestamp: new Date(),
        audioUri: 'mock-audio-uri',
      };

      setRecordings(prev => [newRecording, ...prev]);
      setCurrentRecording(newRecording);
      setIsTranscribing(false);
      
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
    } catch (error) {
      Alert.alert('Transcription Error', 'Failed to transcribe audio. Please try again.');
      setIsTranscribing(false);
    }
  };

  const playRecording = (recording: Recording) => {
    setIsPlaying(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // Simulate audio playback
    setTimeout(() => {
      setIsPlaying(false);
    }, recording.duration * 1000);
  };

  const deleteRecording = (recordingId: string) => {
    Alert.alert(
      'Delete Recording',
      'Are you sure you want to delete this recording?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setRecordings(prev => prev.filter(r => r.id !== recordingId));
            if (currentRecording?.id === recordingId) {
              setCurrentRecording(null);
            }
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          },
        },
      ]
    );
  };

  const useTranscription = (recording: Recording) => {
    onTranscriptionComplete(recording.transcription, recording.audioUri);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <BlurView intensity={100} style={styles.backdrop}>
        <View style={styles.modal}>
          <BlurView intensity={100} style={styles.modalBlur}>
            <View style={styles.modalContent}>
              {/* Header */}
              <View style={styles.header}>
                <View style={styles.headerLeft}>
                  <FileAudio size={24} color="#6366F1" />
                  <Text style={styles.title}>Voice Transcriber</Text>
                </View>
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                  <X size={20} color="#9CA3AF" />
                </TouchableOpacity>
              </View>

              {/* Recording Interface */}
              <View style={styles.recordingSection}>
                <View style={styles.recordingVisualizer}>
                  {isRecording && (
                    <View style={styles.waveform}>
                      {waveAnims.map((anim, index) => (
                        <Animated.View
                          key={index}
                          style={[
                            styles.waveBar,
                            {
                              transform: [{ scaleY: anim }],
                            },
                          ]}
                        />
                      ))}
                    </View>
                  )}
                  
                  <Animated.View
                    style={[
                      styles.recordButton,
                      isRecording && styles.recordButtonActive,
                      {
                        transform: [{ scale: pulseAnim }],
                      },
                    ]}
                  >
                    <TouchableOpacity
                      style={styles.recordButtonInner}
                      onPress={isRecording ? stopRecording : startRecording}
                      disabled={isTranscribing}
                    >
                      {isTranscribing ? (
                        <Volume2 size={32} color="#FFFFFF" />
                      ) : isRecording ? (
                        <Square size={24} color="#FFFFFF" />
                      ) : (
                        <Mic size={32} color="#FFFFFF" />
                      )}
                    </TouchableOpacity>
                  </Animated.View>
                </View>

                <View style={styles.recordingInfo}>
                  <Text style={styles.recordingStatus}>
                    {isTranscribing
                      ? 'Transcribing...'
                      : isRecording
                      ? 'Recording'
                      : 'Tap to start recording'}
                  </Text>
                  {(isRecording || isTranscribing) && (
                    <View style={styles.durationContainer}>
                      <Clock size={16} color="#6B7280" />
                      <Text style={styles.duration}>{formatDuration(recordingDuration)}</Text>
                    </View>
                  )}
                </View>
              </View>

              {/* Current Transcription */}
              {currentRecording && (
                <View style={styles.currentTranscription}>
                  <Text style={styles.sectionTitle}>Latest Transcription</Text>
                  <View style={styles.transcriptionCard}>
                    <ScrollView style={styles.transcriptionScroll} showsVerticalScrollIndicator={false}>
                      <Text style={styles.transcriptionText}>{currentRecording.transcription}</Text>
                    </ScrollView>
                    <View style={styles.transcriptionActions}>
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => playRecording(currentRecording)}
                      >
                        {isPlaying ? (
                          <Pause size={16} color="#6366F1" />
                        ) : (
                          <Play size={16} color="#6366F1" />
                        )}
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.actionButton, styles.primaryButton]}
                        onPress={() => useTranscription(currentRecording)}
                      >
                        <Text style={styles.primaryButtonText}>Use Text</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => deleteRecording(currentRecording.id)}
                      >
                        <Trash2 size={16} color="#EF4444" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )}

              {/* Recording History */}
              {recordings.length > 0 && (
                <View style={styles.historySection}>
                  <Text style={styles.sectionTitle}>Recent Recordings</Text>
                  <ScrollView style={styles.historyScroll} showsVerticalScrollIndicator={false}>
                    {recordings.slice(0, 3).map((recording) => (
                      <View key={recording.id} style={styles.historyItem}>
                        <View style={styles.historyInfo}>
                          <Text style={styles.historyDuration}>
                            {formatDuration(recording.duration)}
                          </Text>
                          <Text style={styles.historyTimestamp}>
                            {recording.timestamp.toLocaleTimeString()}
                          </Text>
                        </View>
                        <View style={styles.historyActions}>
                          <TouchableOpacity
                            style={styles.historyButton}
                            onPress={() => setCurrentRecording(recording)}
                          >
                            <Text style={styles.historyButtonText}>View</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={styles.historyButton}
                            onPress={() => useTranscription(recording)}
                          >
                            <Text style={styles.historyButtonText}>Use</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>
          </BlurView>
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modal: {
    width: '95%',
    maxWidth: 420,
    maxHeight: '90%',
  },
  modalBlur: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  modalContent: {
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(156, 163, 175, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordingSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  recordingVisualizer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 120,
    position: 'relative',
  },
  waveform: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    position: 'absolute',
    bottom: 20,
  },
  waveBar: {
    width: 4,
    height: 40,
    backgroundColor: '#6366F1',
    borderRadius: 2,
  },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  recordButtonActive: {
    backgroundColor: '#EF4444',
    shadowColor: '#EF4444',
  },
  recordButtonInner: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordingInfo: {
    alignItems: 'center',
    marginTop: 16,
    gap: 8,
  },
  recordingStatus: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  duration: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  currentTranscription: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  transcriptionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  transcriptionScroll: {
    maxHeight: 120,
    marginBottom: 12,
  },
  transcriptionText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#374151',
  },
  transcriptionActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#6366F1',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  historySection: {
    maxHeight: 200,
  },
  historyScroll: {
    maxHeight: 150,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 8,
    marginBottom: 8,
  },
  historyInfo: {
    flex: 1,
  },
  historyDuration: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  historyTimestamp: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  historyActions: {
    flexDirection: 'row',
    gap: 8,
  },
  historyButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderRadius: 6,
  },
  historyButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6366F1',
  },
});