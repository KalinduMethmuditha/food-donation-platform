import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View, Switch, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { Colors } from '@/constants/colors';
import VolunteerScreenHeader from '@/components/volunteer/VolunteerScreenHeader';
import { useVolunteerStore } from '@/store/volunteerStore';

export default function NotificationPreferencesScreen() {
  const { notificationPreferences, updateNotificationPreferences } = useVolunteerStore();
  const [prefs, setPrefs] = useState(notificationPreferences);

  const handleToggle = (key: keyof typeof prefs) => {
    setPrefs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    updateNotificationPreferences(prefs);
    Alert.alert('Preferences Saved', 'Notification preferences updated.', [
      { text: 'OK', onPress: () => router.back() }
    ]);
  };

  const renderRow = (title: string, desc: string, key: keyof typeof prefs) => (
    <View style={styles.row}>
      <View style={styles.textCol}>
        <Text style={styles.rowTitle}>{title}</Text>
        <Text style={styles.rowDesc}>{desc}</Text>
      </View>
      <Switch
        value={prefs[key]}
        onValueChange={() => handleToggle(key)}
        trackColor={{ false: Colors.border, true: Colors.primary }}
        thumbColor={Colors.white}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <VolunteerScreenHeader title="Notification Preferences" onBack={() => router.back()} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pickup Notifications</Text>
          <View style={styles.card}>
            {renderRow('New pickup assigned', 'Notify when a new pickup is added', 'newPickupAssigned')}
            <View style={styles.divider} />
            {renderRow('Pickup reminder', 'Alert me 30 minutes before window', 'pickupReminder')}
            <View style={styles.divider} />
            {renderRow('Route updates', 'Live traffic and navigation alerts', 'routeUpdates')}
            <View style={styles.divider} />
            {renderRow('Pickup status updates', 'When status changes to Arrived or Collected', 'statusUpdates')}
            <View style={styles.divider} />
            {renderRow('Delivery completed', 'Confirmation of successful delivery', 'deliveryCompleted')}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Activity Notifications</Text>
          <View style={styles.card}>
            {renderRow('New activity', 'Notify on new activity timeline entries', 'activityUpdates')}
            <View style={styles.divider} />
            {renderRow('Issue updates', 'Updates on reported issues', 'issueUpdates')}
            <View style={styles.divider} />
            {renderRow('Volunteer announcements', 'System alerts and community news', 'announcements')}
          </View>
        </View>

      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>Save Preferences</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16, gap: 24, paddingBottom: 40 },

  section: { gap: 10 },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: Colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5, marginLeft: 4 },
  
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  textCol: { flex: 1, marginRight: 16, gap: 2 },
  rowTitle: { fontSize: 15, fontWeight: '600', color: Colors.textPrimary },
  rowDesc: { fontSize: 12, color: Colors.textSecondary },
  divider: { height: 1, backgroundColor: Colors.border, marginHorizontal: 16 },

  bottomBar: {
    padding: 16,
    paddingBottom: 24,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  saveBtn: {
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: Colors.primaryDark,
    alignItems: 'center',
  },
  saveBtnText: { fontSize: 15, fontWeight: '700', color: Colors.white },
});
