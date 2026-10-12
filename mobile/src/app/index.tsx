import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BrandMark from '@/components/auth/BrandMark';
import { Colors } from '@/constants/colors';
import { demoRoleDestinations } from '@/constants/demoRoles';
import { getCurrentUser } from '@/services/auth';
import { getToken, removeToken } from '@/services/tokenStorage';
import { isAxiosError } from 'axios';

export default function LoadingScreen() {
  useEffect(() => {
    let active = true;

    const restoreSession = async () => {
      try {
        const token = await getToken();
        if (!token) {
          if (active) router.replace('/welcome');
          return;
        }

        const user = await getCurrentUser();
        if (active) router.replace(demoRoleDestinations[user.role]);
      } catch (error) {
        if (isAxiosError(error) && error.response?.status === 401) {
          await removeToken();
        }
        if (active) router.replace('/welcome');
      }
    };

    void restoreSession();
    return () => { active = false; };
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
