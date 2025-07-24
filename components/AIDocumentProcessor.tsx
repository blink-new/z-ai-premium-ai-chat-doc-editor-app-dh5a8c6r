import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { BlurView } from 'expo-blur';
import {
  Sparkles,
  FileText,
  CheckCircle,
  AlertCircle,
  Zap,
  RefreshCw,
  BookOpen,
  PenTool,
  Target,
  X,
  Crown,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { createClient } from '@blinkdotnew/sdk';

const blink = createClient({
  projectId: 'z-ai-premium-ai-chat-doc-editor-app-dh5a8c6r',
  authRequired: false
});

interface AIProcessorProps {
  content: string;
  onContentUpdate: (newContent: string) => void;
  onClose: () => void;
  isPremium?: boolean;
}

interface ProcessingOption {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  premium?: boolean;
}

const PROCESSING_OPTIONS: ProcessingOption[] = [
  {
    id: 'grammar',
    title: 'Grammar & Style',
    description: 'Fix grammar, spelling, and improve writing style',
    icon: <CheckCircle size={20} color="#10B981" />,
    color: '#10B981',
  },
  {
    id: 'rephrase',
    title: 'Rephrase',
    description: 'Rewrite content with better clarity and flow',
    icon: <RefreshCw size={20} color="#6366F1" />,
    color: '#6366F1',
  },
  {
    id: 'summarize',
    title: 'Summarize',
    description: 'Create a concise summary of the content',
    icon: <Target size={20} color="#8B5CF6" />,
    color: '#8B5CF6',
  },
  {
    id: 'expand',
    title: 'Expand',
    description: 'Add more detail and depth to the content',
    icon: <BookOpen size={20} color="#EC4899" />,
    color: '#EC4899',
    premium: true,
  },
  {
    id: 'professional',
    title: 'Make Professional',
    description: 'Transform to professional business tone',
    icon: <PenTool size={20} color="#F59E0B" />,
    color: '#F59E0B',
    premium: true,
  },
  {
    id: 'creative',
    title: 'Creative Rewrite',
    description: 'Add creativity and engaging language',
    icon: <Sparkles size={20} color="#EF4444" />,
    color: '#EF4444',
    premium: true,
  },
];

export function AIDocumentProcessor({ 
  content, 
  onContentUpdate, 
  onClose, 
  isPremium = false 
}: AIProcessorProps) {
  const [processing, setProcessing] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleProcess = async (option: ProcessingOption) => {
    if (option.premium && !isPremium) {
      Alert.alert(
        'Premium Feature',
        'This feature requires a premium subscription. Upgrade to unlock advanced AI processing.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Upgrade', onPress: () => console.log('Upgrade') },
        ]
      );
      return;
    }

    setProcessing(true);
    setSelectedOption(option.id);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      let prompt = '';
      
      switch (option.id) {
        case 'grammar':
          prompt = `Please fix the grammar, spelling, and improve the writing style of the following text. Keep the same meaning and structure, but make it more polished and professional:\n\n${content}`;
          break;
        case 'rephrase':
          prompt = `Please rephrase the following text to improve clarity and flow while maintaining the original meaning:\n\n${content}`;
          break;
        case 'summarize':
          prompt = `Please create a concise summary of the following text, capturing the key points and main ideas:\n\n${content}`;
          break;
        case 'expand':
          prompt = `Please expand on the following text, adding more detail, examples, and depth while maintaining the original tone and message:\n\n${content}`;
          break;
        case 'professional':
          prompt = `Please rewrite the following text in a professional business tone, making it suitable for formal communication:\n\n${content}`;
          break;
        case 'creative':
          prompt = `Please rewrite the following text with more creativity, engaging language, and compelling storytelling while preserving the core message:\n\n${content}`;
          break;
        default:
          prompt = `Please improve the following text:\n\n${content}`;
      }

      const { text } = await blink.ai.generateText({
        prompt,
        model: 'gpt-4o-mini',
        maxTokens: 2000,
      });

      onContentUpdate(text);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      Alert.alert(
        'Processing Complete!',
        'Your document has been enhanced with AI. Review the changes and save if you\'re satisfied.',
        [{ text: 'OK', onPress: onClose }]
      );
    } catch (error) {
      console.error('AI processing error:', error);
      Alert.alert(
        'Processing Failed',
        'Sorry, there was an error processing your document. Please try again.',
        [{ text: 'OK' }]
      );
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setProcessing(false);
      setSelectedOption(null);
    }
  };

  return (
    <View style={styles.overlay}>
      <BlurView intensity={100} style={styles.backdrop}>
        <View style={styles.container}>
          <BlurView intensity={100} style={styles.modal}>
            <View style={styles.modalContent}>
              {/* Header */}
              <View style={styles.header}>
                <View style={styles.headerLeft}>
                  <Sparkles size={24} color="#6366F1" />
                  <Text style={styles.title}>AI Document Processor</Text>
                </View>
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                  <X size={20} color="#9CA3AF" />
                </TouchableOpacity>
              </View>

              <Text style={styles.subtitle}>
                Choose how you'd like to enhance your document with AI
              </Text>

              {/* Processing Options */}
              <ScrollView style={styles.optionsContainer} showsVerticalScrollIndicator={false}>
                {PROCESSING_OPTIONS.map((option) => (
                  <TouchableOpacity
                    key={option.id}
                    style={[
                      styles.optionCard,
                      selectedOption === option.id && styles.optionCardActive,
                      option.premium && !isPremium && styles.optionCardPremium,
                    ]}
                    onPress={() => handleProcess(option)}
                    disabled={processing}
                  >
                    <View style={styles.optionContent}>
                      <View style={[styles.optionIcon, { backgroundColor: `${option.color}20` }]}>
                        {option.icon}
                      </View>
                      <View style={styles.optionText}>
                        <View style={styles.optionTitleContainer}>
                          <Text style={styles.optionTitle}>{option.title}</Text>
                          {option.premium && (
                            <Crown size={14} color="#F59E0B" />
                          )}
                        </View>
                        <Text style={styles.optionDescription}>{option.description}</Text>
                      </View>
                      {processing && selectedOption === option.id && (
                        <ActivityIndicator size="small" color={option.color} />
                      )}
                    </View>
                    {option.premium && !isPremium && (
                      <View style={styles.premiumOverlay}>
                        <Text style={styles.premiumText}>Premium</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Footer */}
              <View style={styles.footer}>
                <View style={styles.footerInfo}>
                  <AlertCircle size={16} color="#6B7280" />
                  <Text style={styles.footerText}>
                    AI processing will replace your current content
                  </Text>
                </View>
              </View>
            </View>
          </BlurView>
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
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
  container: {
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  modal: {
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
    marginBottom: 8,
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
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 24,
    lineHeight: 20,
  },
  optionsContainer: {
    maxHeight: 400,
  },
  optionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
    position: 'relative',
  },
  optionCardActive: {
    borderColor: '#6366F1',
    backgroundColor: 'rgba(99, 102, 241, 0.05)',
  },
  optionCardPremium: {
    opacity: 0.7,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  optionText: {
    flex: 1,
  },
  optionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  optionDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
    lineHeight: 18,
  },
  premiumOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#F59E0B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  premiumText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  footer: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
  },
  footerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  footerText: {
    fontSize: 12,
    color: '#6B7280',
    flex: 1,
  },
});