import { router } from 'expo-router';
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, type ReactNode } from 'react';

import { Colors } from '@/constants/colors';
import VolunteerScreenHeader from '@/components/volunteer/VolunteerScreenHeader';
import { useVolunteerStore } from '@/store/volunteerStore';
import { updateVolunteerPreferences } from '@/services/auth';
import { getApiErrorMessage } from '@/services/apiErrors';

// ─── Types ───────────────────────────────────────────────────────────────────

interface SwitchRowProps {
  label: string;
  value: boolean;
  onChange: (val: boolean) => void;
  isLast?: boolean;
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function SwitchRow({
  label,
  value,
  onChange,
  isLast = false,
}: SwitchRowProps) {
  return (
    <View style={[styles.row, !isLast && styles.rowDivider]}>
      <Text style={styles.rowLabel}>{label}</Text>

      <Switch
        value={value}
        onValueChange={onChange}
        thumbColor={Colors.white}
        trackColor={{
          false: '#D1D5DB',
          true: Colors.primary,
        }}
        ios_backgroundColor="#D1D5DB"
      />
    </View>
  );
}

interface SectionProps {
  title: string;
  children: ReactNode;
}

function Section({ title, children }: SectionProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.card}>{children}</View>
    </View>
  );
}

// ─── Screen ──────────────────────────────────────────────────────────────────

export default function NotificationPreferencesScreen() {
  const {
    notificationPreferences,
    updateNotificationPreferences,
  } = useVolunteerStore();
  const [saveError, setSaveError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveError('');
    try {
      await updateVolunteerPreferences({ notification_preferences: notificationPreferences });
      router.back();
    } catch (error) {
      setSaveError(getApiErrorMessage(error, 'load'));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={['top', 'bottom']}
    >
      <VolunteerScreenHeader
        title="Notification Preferences"
        onBack={() => router.back()}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Section 1: Pickup Notifications ── */}
        <Section title="Pickup Notifications">
          <SwitchRow
            label="New pickup assigned"
            value={notificationPreferences.newPickupAssigned}
            onChange={(val) =>
              updateNotificationPreferences({
                newPickupAssigned: val,
              })
            }
          />

          <SwitchRow
            label="Pickup reminder"
            value={notificationPreferences.pickupReminder}
            onChange={(val) =>
              updateNotificationPreferences({
                pickupReminder: val,
              })
            }
          />

          <SwitchRow
            label="Route updates"
            value={notificationPreferences.routeUpdates}
            onChange={(val) =>
              updateNotificationPreferences({
                routeUpdates: val,
              })
            }
          />

          <SwitchRow
            label="Pickup status updates"
            value={notificationPreferences.statusUpdates}
            onChange={(val) =>
              updateNotificationPreferences({
                statusUpdates: val,
              })
            }
          />

          <SwitchRow
            label="Delivery completed"
            value={notificationPreferences.deliveryCompleted}
            onChange={(val) =>
              updateNotificationPreferences({
                deliveryCompleted: val,
              })
            }
            isLast
          />
        </Section>

        {/* ── Section 2: Activity Notifications ── */}
        <Section title="Activity Notifications">
          <SwitchRow
            label="New activity"
            value={notificationPreferences.activityUpdates}
            onChange={(val) =>
              updateNotificationPreferences({
                activityUpdates: val,
              })
            }
          />

          <SwitchRow
            label="Collection updates"
            value={notificationPreferences.issueUpdates}
            onChange={(val) =>
              updateNotificationPreferences({
                issueUpdates: val,
              })
            }
          />

          <SwitchRow
            label="Volunteer announcements"
            value={notificationPreferences.announcements}
            onChange={(val) =>
              updateNotificationPreferences({
                announcements: val,
              })
            }
            isLast
          />
        </Section>

        {/* ── Section 3: Other ── */}
        <Section title="Other">
          <SwitchRow
            label="General notifications"
            value={notificationPreferences.generalNotifications}
            onChange={(val) =>
              updateNotificationPreferences({
                generalNotifications: val,
              })
            }
          />

          <SwitchRow
            label="Important alerts"
            value={notificationPreferences.importantAlerts}
            onChange={(val) =>
              updateNotificationPreferences({
                importantAlerts: val,
              })
            }
            isLast
          />
        </Section>

        {/* ── Save Button ── */}
        {saveError ? <Text accessibilityRole="alert" style={{ color: Colors.danger }}>{saveError}</Text> : null}
        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => void handleSave()}
          disabled={isSaving}
          activeOpacity={0.85}
        >
          <Text style={styles.saveButtonText}>
            Save Preferences
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },

  section: {
    marginBottom: 24,
  },

  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },

  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 4,
    paddingVertical: 4,

    // Subtle shadow
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },

  rowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },

  rowLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: Colors.textPrimary,
    marginRight: 12,
  },

  saveButton: {
    backgroundColor: Colors.primaryDark,
    borderRadius: 12,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: 8,

    shadowColor: Colors.primaryDark,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },

  saveButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
