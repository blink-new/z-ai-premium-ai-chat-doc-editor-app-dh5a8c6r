import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { 
  X, 
  Sparkles, 
  Zap, 
  Crown, 
  Check,
  Star
} from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

interface PremiumModalProps {
  visible: boolean;
  onClose: () => void;
  onUpgrade: (plan: 'monthly' | 'yearly' | 'tokens') => void;
  remainingMessages: string | number;
}

const PREMIUM_FEATURES = [
  'Unlimited AI conversations',
  'Access to all AI models (GPT-4, Claude, Gemini)',
  'Advanced document editing',
  'PDF & DOCX export',
  'Priority support',
  'No ads',
];

const TOKEN_PACKAGES = [
  { tokens: 10, price: '$0.99', popular: false },
  { tokens: 50, price: '$3.99', popular: true },
  { tokens: 100, price: '$6.99', popular: false },
];

export function PremiumModal({ visible, onClose, onUpgrade, remainingMessages }: PremiumModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <BlurView intensity={50} style={styles.overlay}>
        <View style={styles.container}>
          <LinearGradient
            colors={['#6366F1', '#8B5CF6']}
            style={styles.gradient}
          >
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <X size={24} color="#FFFFFF" />
              </TouchableOpacity>
              <View style={styles.headerContent}>
                <Crown size={32} color="#FFFFFF" />
                <Text style={styles.title}>Upgrade to Premium</Text>
                <Text style={styles.subtitle}>
                  You have {remainingMessages} messages remaining today
                </Text>
              </View>
            </View>

            {/* Content */}
            <View style={styles.content}>
              {/* Premium Plan */}
              <View style={styles.planCard}>
                <View style={styles.planHeader}>
                  <Sparkles size={24} color="#6366F1" />
                  <Text style={styles.planTitle}>Premium Plan</Text>
                  <View style={styles.popularBadge}>
                    <Text style={styles.popularText}>Most Popular</Text>
                  </View>
                </View>
                
                <View style={styles.pricing}>
                  <Text style={styles.price}>$9.99</Text>
                  <Text style={styles.period}>/month</Text>
                </View>
                
                <Text style={styles.yearlyPrice}>
                  or $99.99/year (save 17%)
                </Text>

                <View style={styles.features}>
                  {PREMIUM_FEATURES.map((feature, index) => (
                    <View key={index} style={styles.feature}>
                      <Check size={16} color="#10B981" />
                      <Text style={styles.featureText}>{feature}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.planButtons}>
                  <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={() => onUpgrade('monthly')}
                  >
                    <Text style={styles.primaryButtonText}>Start Monthly</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={() => onUpgrade('yearly')}
                  >
                    <Text style={styles.secondaryButtonText}>Start Yearly</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Token Packages */}
              <View style={styles.tokenSection}>
                <View style={styles.tokenHeader}>
                  <Zap size={20} color="#F59E0B" />
                  <Text style={styles.tokenTitle}>Or buy message tokens</Text>
                </View>
                
                <View style={styles.tokenPackages}>
                  {TOKEN_PACKAGES.map((pkg, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.tokenCard,
                        pkg.popular && styles.popularTokenCard
                      ]}
                      onPress={() => onUpgrade('tokens')}
                    >
                      {pkg.popular && (
                        <View style={styles.tokenPopularBadge}>
                          <Star size={12} color="#FFFFFF" />
                          <Text style={styles.tokenPopularText}>Best Value</Text>
                        </View>
                      )}
                      <Text style={styles.tokenAmount}>{pkg.tokens}</Text>
                      <Text style={styles.tokenLabel}>messages</Text>
                      <Text style={styles.tokenPrice}>{pkg.price}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Footer */}
              <Text style={styles.footer}>
                Cancel anytime • 7-day free trial • No commitment
              </Text>
            </View>
          </LinearGradient>
        </View>
      </BlurView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  container: {
    height: height * 0.85,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
  },
  header: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  closeButton: {
    alignSelf: 'flex-end',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    alignItems: 'center',
    marginTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 12,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 8,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    backgroundColor: '#FAFBFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
  },
  planCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  planTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginLeft: 8,
    flex: 1,
  },
  popularBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  pricing: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  price: {
    fontSize: 36,
    fontWeight: '700',
    color: '#1F2937',
  },
  period: {
    fontSize: 18,
    color: '#6B7280',
    marginLeft: 4,
  },
  yearlyPrice: {
    fontSize: 14,
    color: '#10B981',
    marginBottom: 20,
  },
  features: {
    marginBottom: 24,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    fontSize: 16,
    color: '#374151',
    marginLeft: 12,
  },
  planButtons: {
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#6366F1',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  secondaryButton: {
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6366F1',
  },
  tokenSection: {
    marginBottom: 20,
  },
  tokenHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  tokenTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 8,
  },
  tokenPackages: {
    flexDirection: 'row',
    gap: 12,
  },
  tokenCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  popularTokenCard: {
    borderColor: '#F59E0B',
    backgroundColor: '#FFFBEB',
  },
  tokenPopularBadge: {
    position: 'absolute',
    top: -8,
    backgroundColor: '#F59E0B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tokenPopularText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  tokenAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 8,
  },
  tokenLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  },
  tokenPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6366F1',
  },
  footer: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
});