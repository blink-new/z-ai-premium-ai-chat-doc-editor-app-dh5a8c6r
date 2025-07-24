import { useEffect } from 'react';
import { router } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function Home() {
  useEffect(() => {
    // Redirect to chat tab on app launch
    router.replace('/(tabs)/chat');
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FAFBFF', '#F3F4F6']}
        style={styles.gradient}
      />
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
});