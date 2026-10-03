import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BrandMark from '@/components/auth/BrandMark';
import { Colors } from '@/constants/colors';

// Frontend demo delay. Session lookup will replace this when authentication is connected.
const DEMO_LOADING_DELAY_MS = 1200;

export default function LoadingScreen() {
  useEffect(() => {
    const timer = setTimeout(() => router.replace('/welcome'), DEMO_LOADING_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  return <SafeAreaView style={styles.screen}>
    <StatusBar style="light" />
    <View style={styles.center}>
      <BrandMark light />
      <Text style={styles.tagline}>Connecting food with communities</Text>
      <ActivityIndicator style={styles.loading} size="small" color={Colors.white}
        accessibilityLabel="Loading FoodShare" />
    </View>
  </SafeAreaView>;
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.primary },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  tagline: { marginTop: 14, fontSize: 14, color: Colors.white, textAlign: 'center' },
  loading: { marginTop: 40 },
});
