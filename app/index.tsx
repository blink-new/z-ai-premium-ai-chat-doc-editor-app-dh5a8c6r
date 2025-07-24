import { useEffect } from 'react';
import { router } from 'expo-router';
import { View, StyleSheet, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function Home() {
  useEffect(() => {
    // Redirect to chat tab on app launch with a small delay
    const timer = setTimeout(() => {
      router.replace('/(tabs)/chat');
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FAFBFF', '#F3F4F6']}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <Text style={styles.loadingText}>Loading Z AI...</Text>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#6366F1',
  },
});