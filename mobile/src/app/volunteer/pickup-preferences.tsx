import { cardSurface, actionFooter } from '@/constants/design';
import PrimaryButton from '@/components/ui/PrimaryButton';
import { router } from 'expo-router';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';

import Icon from '@/components/ui/Icon';
import { Colors } from '@/constants/colors';
import VolunteerScreenHeader from '@/components/volunteer/VolunteerScreenHeader';
import { useVolunteerStore } from '@/store/volunteerStore';
import { useVolunteerAssignments } from '@/store/volunteerAssignments.store';
import { updateVolunteerPreferences } from '@/services/auth';
import { getApiErrorMessage } from '@/services/apiErrors';

const FOOD_TYPES: string[] = [
  'Cooked Meals',
  'Rice & Curry',
  'Bakery Items',
  'Fruits & Vegetables',
  'Packaged Food',
  'Beverages',
  'Other',
];

const RADIUS_OPTIONS: string[] = [
  '2 km',
  '5 km',
  '10 km',
  '15 km',
];

const DAYS: string[] = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

const DAY_ABBR: Record<string, string> = {
  Monday: 'Mon',
  Tuesday: 'Tue',
  Wednesday: 'Wed',
  Thursday: 'Thu',
  Friday: 'Fri',
  Saturday: 'Sat',
  Sunday: 'Sun',
};

const TIME_OPTIONS: string[] = [
  '12:00 PM',
  '1:00 PM',
  '2:00 PM',
  '3:00 PM',
  '4:00 PM',
  '4:30 PM',
  '5:00 PM',
  '5:30 PM',
  '6:00 PM',
  '6:30 PM',
  '7:00 PM',
  '8:00 PM',
];

export default function PickupPreferencesScreen() {
  const {
    pickupPreferences,
    updatePickupPreferences,
  } = useVolunteerStore();
  const { isAvailable, isLoading, setAvailability } = useVolunteerAssignments();
  const [saveError, setSaveError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const [startTime, setStartTime] = useState<string>(
    pickupPreferences?.preferredStartTime ?? '5:00 PM'
  );

  const [endTime, setEndTime] = useState<string>(
    pickupPreferences?.preferredEndTime ?? '8:00 PM'
  );

  const [area, setArea] = useState<string>(
    pickupPreferences?.preferredArea ?? ''
  );

  const [radius, setRadius] = useState<string>(
    pickupPreferences?.pickupRadius ?? '5 km'
  );

  const [selectedFoodTypes, setSelectedFoodTypes] =
    useState<string[]>(
      pickupPreferences?.foodTypes ?? []
    );

  const [availabilityDraft, setAvailableToday] = useState<boolean | null>(null);
  const availableToday = availabilityDraft
    ?? (isLoading ? pickupPreferences?.availableToday ?? false : isAvailable);

  const [availableDays, setAvailableDays] =
    useState<string[]>(
      pickupPreferences?.availableDays ?? []
    );

  const [showStartTimePicker, setShowStartTimePicker] =
    useState<boolean>(false);

  const [showEndTimePicker, setShowEndTimePicker] =
    useState<boolean>(false);

  const [showAreaModal, setShowAreaModal] =
    useState<boolean>(false);

  const [areaInput, setAreaInput] =
    useState<string>(area);

  const [areaError, setAreaError] =
    useState<string>('');

  const [pendingStartTime, setPendingStartTime] =
    useState<string>(startTime);

  const [pendingEndTime, setPendingEndTime] =
    useState<string>(endTime);

  const toggleFoodType = (type: string) => {
    setSelectedFoodTypes((prev) =>
      prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type]
    );
  };

  const toggleDay = (day: string) => {
    setAvailableDays((prev) =>
      prev.includes(day)
        ? prev.filter((d) => d !== day)
        : [...prev, day]
    );
  };

  const handleSaveArea = () => {
    if (!areaInput.trim()) {
      setAreaError('Area cannot be empty.');
      return;
    }

    setAreaError('');
    setArea(areaInput.trim());
    setShowAreaModal(false);
  };

  const handleOpenAreaModal = () => {
    setAreaInput(area);
    setAreaError('');
    setShowAreaModal(true);
  };

  const handleSave = async () => {
    if (!area.trim()) {
      setSaveError('Please set a preferred pickup area.');
      return;
    }

    const preferences = {
      preferredStartTime: startTime,
      preferredEndTime: endTime,
      preferredArea: area,
      pickupRadius: radius,
      foodTypes: selectedFoodTypes,
      availableToday,
      availableDays,
    };
    setIsSaving(true);
    setSaveError('');
    try {
      await updateVolunteerPreferences({ pickup_preferences: preferences });
      await setAvailability(availableToday);
      updatePickupPreferences(preferences);
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
        title="Pickup Preferences"
        onBack={() => router.back()}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Preferred Pickup Time ── */}
        <Text style={styles.sectionLabel}>
          PREFERRED PICKUP TIME
        </Text>

        <View style={styles.card}>
          {/* Start Time */}
          <Pressable
            style={styles.timeRow}
            onPress={() => {
              setPendingStartTime(startTime);
              setShowStartTimePicker(true);
            }}
          >
            <View style={styles.timeRowLeft}>
              <Icon
                name="clock"
                size={18}
                color={Colors.primary}
              />

              <Text style={styles.timeLabel}>
                Start Time
              </Text>
            </View>

            <View style={styles.timeRowRight}>
              <Text style={styles.timeValue}>
                {startTime}
              </Text>

              <Icon
                name="chevron-right"
                size={16}
                color={Colors.textMuted}
              />
            </View>
          </Pressable>

          <View style={styles.divider} />

          {/* End Time */}
          <Pressable
            style={styles.timeRow}
            onPress={() => {
              setPendingEndTime(endTime);
              setShowEndTimePicker(true);
            }}
          >
            <View style={styles.timeRowLeft}>
              <Icon
                name="clock"
                size={18}
                color={Colors.primary}
              />

              <Text style={styles.timeLabel}>
                End Time
              </Text>
            </View>

            <View style={styles.timeRowRight}>
              <Text style={styles.timeValue}>
                {endTime}
              </Text>

              <Icon
                name="chevron-right"
                size={16}
                color={Colors.textMuted}
              />
            </View>
          </Pressable>
        </View>

        {/* ── Preferred Pickup Area ── */}
        <Text style={styles.sectionLabel}>
          PREFERRED PICKUP AREA
        </Text>

        <View style={styles.card}>
          <Pressable
            style={styles.areaRow}
            onPress={handleOpenAreaModal}
          >
            <View style={styles.timeRowLeft}>
              <Icon
                name="pin"
                size={18}
                color={Colors.primary}
              />

              <Text style={styles.timeLabel}>
                Area
              </Text>
            </View>

            <View style={styles.timeRowRight}>
              <Text
                style={[
                  styles.timeValue,
                  !area && {
                    color: Colors.textMuted,
                    fontStyle: 'italic',
                  },
                ]}
                numberOfLines={1}
              >
                {area || 'Tap to set area'}
              </Text>

              <Icon
                name="chevron-right"
                size={16}
                color={Colors.textMuted}
              />
            </View>
          </Pressable>
        </View>

        {/* ── Pickup Radius ── */}
        <Text style={styles.sectionLabel}>
          PICKUP RADIUS
        </Text>

        <View style={styles.card}>
          <View style={styles.radiusRow}>
            {RADIUS_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt}
                style={[
                  styles.radiusBtn,
                  radius === opt &&
                    styles.radiusBtnActive,
                ]}
                onPress={() => setRadius(opt)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.radiusBtnText,
                    radius === opt &&
                      styles.radiusBtnTextActive,
                  ]}
                >
                  {opt}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── Food Types ── */}
        <Text style={styles.sectionLabel}>
          FOOD TYPES
        </Text>

        <View style={styles.card}>
          <View style={styles.chipsWrap}>
            {FOOD_TYPES.map((type) => {
              const selected =
                selectedFoodTypes.includes(type);

              return (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.chip,
                    selected && styles.chipActive,
                  ]}
                  onPress={() => toggleFoodType(type)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.chipText,
                      selected &&
                        styles.chipTextActive,
                    ]}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* ── Availability ── */}
        <Text style={styles.sectionLabel}>
          AVAILABILITY
        </Text>

        <View style={styles.card}>
          {/* Available Today toggle */}
          <View style={styles.switchRow}>
            <View style={styles.switchRowLeft}>
              <Icon
                name="clock"
                size={18}
                color={Colors.primary}
              />

              <Text style={styles.switchLabel}>
                Available Today
              </Text>
            </View>

            <Switch
              value={availableToday}
              onValueChange={setAvailableToday}
              trackColor={{
                false: Colors.border,
                true: Colors.primary,
              }}
              thumbColor={Colors.white}
            />
          </View>

          <View style={styles.divider} />

          {/* Days grid */}
          <Text style={styles.daysTitle}>
            Available Days
          </Text>

          <View style={styles.daysWrap}>
            {DAYS.map((day) => {
              const selected =
                availableDays.includes(day);

              return (
                <TouchableOpacity
                  key={day}
                  style={[
                    styles.dayPill,
                    selected &&
                      styles.dayPillActive,
                  ]}
                  onPress={() => toggleDay(day)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.dayPillText,
                      selected &&
                        styles.dayPillTextActive,
                    ]}
                  >
                    {DAY_ABBR[day]}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Save Button */}
      {saveError ? <Text accessibilityRole="alert" style={{ color: Colors.danger, paddingHorizontal: 20 }}>{saveError}</Text> : null}
      <View style={styles.saveContainer}>
        <PrimaryButton title="Save Preferences" onPress={() => void handleSave()} loading={isSaving} />
      </View>

      {/* ── Start Time Picker Modal ── */}
      <Modal
        visible={showStartTimePicker}
        transparent
        animationType="fade"
        onRequestClose={() =>
          setShowStartTimePicker(false)
        }
      >
        <View style={styles.modalOverlay}>
          <View style={styles.timePickerContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Select Start Time
              </Text>

              <TouchableOpacity
                onPress={() =>
                  setShowStartTimePicker(false)
                }
              >
                <Icon
                  name="x-circle"
                  size={22}
                  color={Colors.textSecondary}
                />
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.timeGrid}>
                {TIME_OPTIONS.map((t) => (
                  <TouchableOpacity
                    key={t}
                    style={[
                      styles.timeOption,
                      pendingStartTime === t &&
                        styles.timeOptionActive,
                    ]}
                    onPress={() =>
                      setPendingStartTime(t)
                    }
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.timeOptionText,
                        pendingStartTime === t &&
                          styles.timeOptionTextActive,
                      ]}
                    >
                      {t}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <TouchableOpacity
              style={styles.modalSaveBtn}
              onPress={() => {
                setStartTime(pendingStartTime);
                setShowStartTimePicker(false);
              }}
              activeOpacity={0.85}
            >
              <Text style={styles.modalSaveBtnText}>
                Confirm
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ── End Time Picker Modal ── */}
      <Modal
        visible={showEndTimePicker}
        transparent
        animationType="fade"
        onRequestClose={() =>
          setShowEndTimePicker(false)
        }
      >
        <View style={styles.modalOverlay}>
          <View style={styles.timePickerContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Select End Time
              </Text>

              <TouchableOpacity
                onPress={() =>
                  setShowEndTimePicker(false)
                }
              >
                <Icon
                  name="x-circle"
                  size={22}
                  color={Colors.textSecondary}
                />
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.timeGrid}>
                {TIME_OPTIONS.map((t) => (
                  <TouchableOpacity
                    key={t}
                    style={[
                      styles.timeOption,
                      pendingEndTime === t &&
                        styles.timeOptionActive,
                    ]}
                    onPress={() =>
                      setPendingEndTime(t)
                    }
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.timeOptionText,
                        pendingEndTime === t &&
                          styles.timeOptionTextActive,
                      ]}
                    >
                      {t}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <TouchableOpacity
              style={styles.modalSaveBtn}
              onPress={() => {
                setEndTime(pendingEndTime);
                setShowEndTimePicker(false);
              }}
              activeOpacity={0.85}
            >
              <Text style={styles.modalSaveBtnText}>
                Confirm
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ── Area Modal ── */}
      <Modal
        visible={showAreaModal}
        transparent
        animationType="fade"
        onRequestClose={() =>
          setShowAreaModal(false)
        }
      >
        <View style={styles.modalOverlay}>
          <View style={styles.areaModalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Set Pickup Area
              </Text>

              <TouchableOpacity
                onPress={() =>
                  setShowAreaModal(false)
                }
              >
                <Icon
                  name="x-circle"
                  size={22}
                  color={Colors.textSecondary}
                />
              </TouchableOpacity>
            </View>

            <Text style={styles.areaInputLabel}>
              Enter your preferred pickup area or
              neighbourhood
            </Text>

            <TextInput
              style={[
                styles.areaTextInput,
                areaError
                  ? styles.areaTextInputError
                  : null,
              ]}
              value={areaInput}
              onChangeText={(text) => {
                setAreaInput(text);

                if (areaError) {
                  setAreaError('');
                }
              }}
              placeholder="e.g. Colombo 03, Nugegoda"
              placeholderTextColor={Colors.textMuted}
              autoFocus
              returnKeyType="done"
              onSubmitEditing={handleSaveArea}
            />

            {!!areaError && (
              <Text style={styles.errorText}>
                {areaError}
              </Text>
            )}

            <View style={styles.areaModalActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() =>
                  setShowAreaModal(false)
                }
                activeOpacity={0.8}
              >
                <Text style={styles.cancelBtnText}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalSaveBtn2}
                onPress={handleSaveArea}
                activeOpacity={0.85}
              >
                <Text style={styles.modalSaveBtnText}>
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
  },

  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: Colors.textMuted,
    marginBottom: 8,
    marginTop: 20,
    textTransform: 'uppercase',
  },

  card: {
    ...cardSurface,
    paddingHorizontal: 16,
    paddingVertical: 4,
    overflow: 'hidden',
  },

  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },

  timeRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  timeRowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  timeLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.textPrimary,
  },

  timeValue: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.primary,
  },

  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginHorizontal: -16,
  },

  areaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },

  radiusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    gap: 8,
  },

  radiusBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    alignItems: 'center',
  },

  radiusBtnActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },

  radiusBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },

  radiusBtnTextActive: {
    color: Colors.white,
  },

  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingVertical: 14,
  },

  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
  },

  chipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },

  chipText: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.textPrimary,
  },

  chipTextActive: {
    color: Colors.white,
  },

  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },

  switchRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  switchLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.textPrimary,
  },

  daysTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginTop: 12,
    marginBottom: 10,
  },

  daysWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingBottom: 14,
  },

  dayPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
  },

  dayPillActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },

  dayPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },

  dayPillTextActive: {
    color: Colors.white,
  },

  bottomSpacer: {
    height: 16,
  },

  saveContainer: {
    ...actionFooter,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    gap: 8,
  },

  saveBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.white,
  },

  /* Modals */

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  timePickerContainer: {
    width: '100%',
    maxHeight: '70%',
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
  },

  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },

  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.textPrimary,
  },

  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'flex-start',
    paddingBottom: 8,
  },

  timeOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    minWidth: '30%',
    alignItems: 'center',
  },

  timeOptionActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },

  timeOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textPrimary,
  },

  timeOptionTextActive: {
    color: Colors.white,
    fontWeight: '700',
  },

  modalSaveBtn: {
    marginTop: 16,
    backgroundColor: Colors.primary,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },

  modalSaveBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.white,
  },

  /* Area modal */

  areaModalContainer: {
    width: '100%',
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
  },

  areaInputLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 10,
    lineHeight: 18,
  },

  areaTextInput: {
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: Colors.textPrimary,
    backgroundColor: Colors.background,
  },

  areaTextInputError: {
    borderColor: Colors.danger,
  },

  errorText: {
    fontSize: 12,
    color: Colors.danger,
    marginTop: 6,
  },

  areaModalActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 18,
  },

  cancelBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
    backgroundColor: Colors.white,
  },

  cancelBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textSecondary,
  },

  modalSaveBtn2: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
  },
});
