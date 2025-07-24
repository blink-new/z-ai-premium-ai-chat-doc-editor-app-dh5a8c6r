import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UsageData {
  dailyMessages: number;
  lastResetDate: string;
  isPremium: boolean;
  tokens: number;
}

const DAILY_FREE_LIMIT = 10;
const STORAGE_KEY = 'usage_data';

export function useUsageTracking() {
  const [usage, setUsage] = useState<UsageData>({
    dailyMessages: 0,
    lastResetDate: new Date().toDateString(),
    isPremium: false,
    tokens: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsageData();
  }, []);

  const loadUsageData = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data: UsageData = JSON.parse(stored);
        const today = new Date().toDateString();
        
        // Reset daily count if it's a new day
        if (data.lastResetDate !== today) {
          data.dailyMessages = 0;
          data.lastResetDate = today;
        }
        
        setUsage(data);
      }
    } catch (error) {
      console.error('Error loading usage data:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveUsageData = async (newUsage: UsageData) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newUsage));
      setUsage(newUsage);
    } catch (error) {
      console.error('Error saving usage data:', error);
    }
  };

  const incrementMessageCount = () => {
    const newUsage = {
      ...usage,
      dailyMessages: usage.dailyMessages + 1,
    };
    saveUsageData(newUsage);
  };

  const canSendMessage = () => {
    return usage.isPremium || usage.dailyMessages < DAILY_FREE_LIMIT || usage.tokens > 0;
  };

  const getRemainingMessages = () => {
    if (usage.isPremium) return 'Unlimited';
    if (usage.tokens > 0) return `${usage.tokens} tokens`;
    return Math.max(0, DAILY_FREE_LIMIT - usage.dailyMessages);
  };

  const useToken = () => {
    if (usage.tokens > 0) {
      const newUsage = {
        ...usage,
        tokens: usage.tokens - 1,
      };
      saveUsageData(newUsage);
      return true;
    }
    return false;
  };

  const addTokens = (amount: number) => {
    const newUsage = {
      ...usage,
      tokens: usage.tokens + amount,
    };
    saveUsageData(newUsage);
  };

  const upgradeToPremium = () => {
    const newUsage = {
      ...usage,
      isPremium: true,
    };
    saveUsageData(newUsage);
  };

  return {
    usage,
    loading,
    incrementMessageCount,
    canSendMessage,
    getRemainingMessages,
    useToken,
    addTokens,
    upgradeToPremium,
  };
}