import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import {
  Crown,
  Sparkles,
  Zap,
  Shield,
  Download,
  MessageCircle,
  FileText,
  Check,
  Star,
  Gift,
} from 'lucide-react-native';

interface PricingPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  popular?: boolean;
  color: string;
}

const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for getting started',
    features: [
      '10 AI messages per day',
      'Basic GPT-3.5 model',
      'Simple document editor',
      'Text file support',
      'Basic export options',
    ],
    color: '#6B7280',
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '$9.99',
    period: 'month',
    description: 'Unlock the full potential',
    features: [
      'Unlimited AI messages',
      'All AI models (GPT-4, Claude, Gemini)',
      'Advanced document editor',
      'PDF & DOCX support',
      'AI content enhancement',
      'Priority support',
      'Export to all formats',
    ],
    popular: true,
    color: '#6366F1',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$19.99',
    period: 'month',
    description: 'For power users',
    features: [
      'Everything in Premium',
      'OCR text extraction',
      'Advanced AI features',
      'Collaboration tools',
      'API access',
      'Custom integrations',
      'White-label options',
    ],
    color: '#8B5CF6',
  },
];

const MICROTRANSACTIONS = [
  {
    id: 'ai_enhance',
    title: 'AI Enhancement',
    description: 'Improve your document with AI',
    price: '$0.10',
    icon: Sparkles,
  },
  {
    id: 'pdf_export',
    title: 'PDF Export',
    description: 'Export document as PDF',
    price: '$0.25',
    icon: Download,
  },
  {
    id: 'premium_model',
    title: '24h Premium Access',
    description: 'Access GPT-4 and Claude for 24 hours',
    price: '$0.50',
    icon: Zap,
  },
];

export default function PremiumScreen() {
  const [selectedPlan, setSelectedPlan] = useState('premium');
  const [currentPlan] = useState('free'); // This would come from user state

  const handleSubscribe = (planId: string) => {
    Alert.alert(
      'Subscribe to Premium',
      `You're about to subscribe to the ${PRICING_PLANS.find(p => p.id === planId)?.name} plan.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Subscribe', onPress: () => console.log(`Subscribe to ${planId}`) },
      ]
    );
  };

  const handleMicrotransaction = (itemId: string) => {
    const item = MICROTRANSACTIONS.find(t => t.id === itemId);
    Alert.alert(
      'Purchase',
      `Purchase ${item?.title} for ${item?.price}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Buy', onPress: () => console.log(`Buy ${itemId}`) },
      ]
    );
  };

  const watchAdForCredits = () => {
    Alert.alert(
      'Watch Ad',
      'Watch a short ad to earn 5 free AI messages!',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Watch Ad', onPress: () => console.log('Show rewarded ad') },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#FAFBFF', '#F3F4F6']} style={styles.gradient}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <LinearGradient
              colors={['#6366F1', '#8B5CF6']}
              style={styles.headerGradient}
            >
              <Crown size={32} color="#FFFFFF" />
              <Text style={styles.headerTitle}>Upgrade to Premium</Text>
              <Text style={styles.headerSubtitle}>
                Unlock unlimited AI power and advanced features
              </Text>
            </LinearGradient>
          </View>

          {/* Current Usage */}
          <View style={styles.usageSection}>
            <BlurView intensity={50} style={styles.usageCard}>
              <View style={styles.usageContent}>
                <Text style={styles.usageTitle}>Today's Usage</Text>
                <View style={styles.usageStats}>
                  <View style={styles.usageStat}>
                    <MessageCircle size={20} color="#6366F1" />
                    <Text style={styles.usageNumber}>7/10</Text>
                    <Text style={styles.usageLabel}>AI Messages</Text>
                  </View>
                  <View style={styles.usageStat}>
                    <FileText size={20} color="#8B5CF6" />
                    <Text style={styles.usageNumber}>2/3</Text>
                    <Text style={styles.usageLabel}>Documents</Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.adButton} onPress={watchAdForCredits}>
                  <Gift size={16} color="#FFFFFF" />
                  <Text style={styles.adButtonText}>Watch Ad for 5 Free Messages</Text>
                </TouchableOpacity>
              </View>
            </BlurView>
          </View>

          {/* Pricing Plans */}
          <View style={styles.plansSection}>
            <Text style={styles.sectionTitle}>Choose Your Plan</Text>
            {PRICING_PLANS.map((plan) => (
              <TouchableOpacity
                key={plan.id}
                style={[
                  styles.planCard,
                  selectedPlan === plan.id && styles.selectedPlan,
                  plan.popular && styles.popularPlan,
                ]}
                onPress={() => setSelectedPlan(plan.id)}
              >
                <BlurView intensity={50} style={styles.planBlur}>
                  <View style={styles.planContent}>
                    {plan.popular && (
                      <View style={styles.popularBadge}>
                        <Star size={12} color="#FFFFFF" />
                        <Text style={styles.popularText}>Most Popular</Text>
                      </View>
                    )}
                    
                    <View style={styles.planHeader}>
                      <View>
                        <Text style={[styles.planName, { color: plan.color }]}>
                          {plan.name}
                        </Text>
                        <Text style={styles.planDescription}>{plan.description}</Text>
                      </View>
                      <View style={styles.planPricing}>
                        <Text style={[styles.planPrice, { color: plan.color }]}>
                          {plan.price}
                        </Text>
                        <Text style={styles.planPeriod}>/{plan.period}</Text>
                      </View>
                    </View>

                    <View style={styles.planFeatures}>
                      {plan.features.map((feature, index) => (
                        <View key={index} style={styles.featureRow}>
                          <Check size={16} color="#10B981" />
                          <Text style={styles.featureText}>{feature}</Text>
                        </View>
                      ))}
                    </View>

                    {currentPlan !== plan.id && (
                      <TouchableOpacity
                        style={[
                          styles.subscribeButton,
                          { backgroundColor: plan.color },
                          plan.id === 'free' && styles.freeButton,
                        ]}
                        onPress={() => handleSubscribe(plan.id)}
                      >
                        <Text style={[
                          styles.subscribeButtonText,
                          plan.id === 'free' && styles.freeButtonText,
                        ]}>
                          {plan.id === 'free' ? 'Current Plan' : 'Subscribe'}
                        </Text>
                      </TouchableOpacity>
                    )}

                    {currentPlan === plan.id && (
                      <View style={styles.currentPlanBadge}>
                        <Shield size={16} color="#10B981" />
                        <Text style={styles.currentPlanText}>Current Plan</Text>
                      </View>
                    )}
                  </View>
                </BlurView>
              </TouchableOpacity>
            ))}
          </View>

          {/* Microtransactions */}
          <View style={styles.microSection}>
            <Text style={styles.sectionTitle}>Pay As You Go</Text>
            <Text style={styles.sectionSubtitle}>
              Need just one feature? Buy it individually
            </Text>
            
            {MICROTRANSACTIONS.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.microCard}
                onPress={() => handleMicrotransaction(item.id)}
              >
                <BlurView intensity={50} style={styles.microBlur}>
                  <View style={styles.microContent}>
                    <View style={styles.microIcon}>
                      <item.icon size={20} color="#6366F1" />
                    </View>
                    <View style={styles.microInfo}>
                      <Text style={styles.microTitle}>{item.title}</Text>
                      <Text style={styles.microDescription}>{item.description}</Text>
                    </View>
                    <View style={styles.microPrice}>
                      <Text style={styles.microPriceText}>{item.price}</Text>
                      <Text style={styles.microBuyText}>Buy</Text>
                    </View>
                  </View>
                </BlurView>
              </TouchableOpacity>
            ))}
          </View>

          {/* Benefits */}
          <View style={styles.benefitsSection}>
            <Text style={styles.sectionTitle}>Why Go Premium?</Text>
            <View style={styles.benefitsList}>
              <View style={styles.benefitItem}>
                <Zap size={24} color="#F59E0B" />
                <View style={styles.benefitContent}>
                  <Text style={styles.benefitTitle}>Unlimited AI Power</Text>
                  <Text style={styles.benefitDescription}>
                    Access all AI models without daily limits
                  </Text>
                </View>
              </View>
              <View style={styles.benefitItem}>
                <FileText size={24} color="#8B5CF6" />
                <View style={styles.benefitContent}>
                  <Text style={styles.benefitTitle}>Advanced Document Tools</Text>
                  <Text style={styles.benefitDescription}>
                    PDF support, OCR, and AI-powered enhancements
                  </Text>
                </View>
              </View>
              <View style={styles.benefitItem}>
                <Shield size={24} color="#10B981" />
                <View style={styles.benefitContent}>
                  <Text style={styles.benefitTitle}>Priority Support</Text>
                  <Text style={styles.benefitDescription}>
                    Get help faster with premium support
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
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
    margin: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },
  headerGradient: {
    padding: 24,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 12,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginTop: 8,
  },
  usageSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  usageCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  usageContent: {
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  usageTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
  },
  usageStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  usageStat: {
    alignItems: 'center',
  },
  usageNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#374151',
    marginTop: 8,
  },
  usageLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
  adButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EC4899',
    paddingVertical: 12,
    borderRadius: 12,
  },
  adButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  plansSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 20,
  },
  planCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedPlan: {
    borderColor: '#6366F1',
  },
  popularPlan: {
    borderColor: '#F59E0B',
  },
  planBlur: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  planContent: {
    padding: 20,
  },
  popularBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F59E0B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  popularText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  planName: {
    fontSize: 20,
    fontWeight: '700',
  },
  planDescription: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 4,
  },
  planPricing: {
    alignItems: 'flex-end',
  },
  planPrice: {
    fontSize: 28,
    fontWeight: '700',
  },
  planPeriod: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  planFeatures: {
    marginBottom: 20,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 12,
    flex: 1,
  },
  subscribeButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  subscribeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  freeButton: {
    backgroundColor: '#E5E7EB',
  },
  freeButtonText: {
    color: '#9CA3AF',
  },
  currentPlanBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: 12,
  },
  currentPlanText: {
    color: '#10B981',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  microSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  microCard: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  microBlur: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  microContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  microIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  microInfo: {
    flex: 1,
  },
  microTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  microDescription: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 2,
  },
  microPrice: {
    alignItems: 'flex-end',
  },
  microPriceText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#6366F1',
  },
  microBuyText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  benefitsSection: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  benefitsList: {
    marginTop: 20,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  benefitContent: {
    flex: 1,
    marginLeft: 16,
  },
  benefitTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  benefitDescription: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 4,
    lineHeight: 20,
  },
});