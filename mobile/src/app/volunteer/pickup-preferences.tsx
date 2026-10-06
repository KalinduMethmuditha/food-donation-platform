import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, Modal, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import Icon from '@/components/ui/Icon';
import { Colors } from '@/constants/colors';
import VolunteerScreenHeader from '@/components/volunteer/VolunteerScreenHeader';
import { useVolunteerStore } from '@/store/volunteerStore';

const FOOD_TYPES = ['Cooked Meals', 'Rice & Curry', 'Bakery Items', 'Fruits & Vegetables', 'Packaged Food', 'Beverages', 'Other'];
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const RADIUS_OPTIONS = ['2 km', '5 km', '10 km', '15 km'];

export default function PickupPreferencesScreen() {
  const { pickupPreferences, updatePickupPreferences, isAvailable, toggleAvailability } = useVolunteerStore();
  
  const [startTime, setStartTime] = useState(pickupPreferences.preferredStartTime);
  const [endTime, setEndTime] = useState(pickupPreferences.preferredEndTime);
  const [area, setArea] = useState(pickupPreferences.preferredArea);
  const [radius, setRadius] = useState(pickupPreferences.pickupRadius);
  const [foodTypes, setFoodTypes] = useState<string[]>(pickupPreferences.foodTypes);
  const [availableDays, setAvailableDays] = useState<string[]>(pickupPreferences.availableDays);

  const [timeSelectorVisible, setTimeSelectorVisible] = useState(false);
  const [activeTimeField, setActiveTimeField] = useState<'start' | 'end' | null>(null);
  
  // Very simple mock time values for our custom selector
  const TIME_OPTIONS = ['08:00 AM', '10:00 AM', '12:00 PM', '02:00 PM', '04:00 PM', '06:00 PM', '08:00 PM'];

  const handleToggleFood = (food: string) => {
    if (foodTypes.includes(food)) {
      setFoodTypes(foodTypes.filter(f => f !== food));
    } else {
      setFoodTypes([...foodTypes, food]);
    }
  };

  const handleToggleDay = (day: string) => {
    if (availableDays.includes(day)) {
      setAvailableDays(availableDays.filter(d => d !== day));
    } else {
      setAvailableDays([...availableDays, day]);
    }
  };

  const openTimePicker = (field: 'start' | 'end') => {
    setActiveTimeField(field);
    setTimeSelectorVisible(true);
  };

  const handleSelectTime = (t: string) => {
    if (activeTimeField === 'start') setStartTime(t);
    if (activeTimeField === 'end') setEndTime(t);
    setTimeSelectorVisible(false);
  };

  const handleSave = () => {
    if (!area.trim()) {
      Alert.alert('Required', 'Please enter your preferred pickup area.');
      return;
    }
    
    updatePickupPreferences({
      preferredStartTime: startTime,
      preferredEndTime: endTime,
      preferredArea: area,
      pickupRadius: radius,
      foodTypes,
      availableDays
    });

    Alert.alert('Preferences Saved', 'Your pickup preferences have been updated.', [
      { text: 'OK', onPress: () => router.back() }
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <VolunteerScreenHeader title="Pickup Preferences" onBack={() => router.back()} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* TIME */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferred Pickup Time</Text>
          <View style={styles.timeRow}>
            <TouchableOpacity style={styles.timeBtn} onPress={() => openTimePicker('start')}>
              <Text style={styles.timeLabel}>Start Time</Text>
              <Text style={styles.timeValue}>{startTime}</Text>
            </TouchableOpacity>
            <View style={styles.timeDivider}>
              <Icon name="chevron.right" size={16} color={Colors.textMuted} />
            </View>
            <TouchableOpacity style={styles.timeBtn} onPress={() => openTimePicker('end')}>
              <Text style={styles.timeLabel}>End Time</Text>
              <Text style={styles.timeValue}>{endTime}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* AREA */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferred Pickup Area</Text>
          <TextInput
            style={styles.input}
            value={area}
            onChangeText={setArea}
            placeholder="e.g. Negombo, Colombo"
          />
        </View>

        {/* RADIUS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pickup Radius</Text>
          <View style={styles.chipGrid}>
            {RADIUS_OPTIONS.map(opt => (
              <TouchableOpacity
                key={opt}
                onPress={() => setRadius(opt)}
                style={[styles.chip, radius === opt && styles.chipActive]}
              >
                <Text style={[styles.chipText, radius === opt && styles.chipTextActive]}>{opt}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* FOOD TYPES */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Food Types</Text>
          <View style={styles.chipGrid}>
            {FOOD_TYPES.map(food => {
              const active = foodTypes.includes(food);
              return (
                <TouchableOpacity
                  key={food}
                  onPress={() => handleToggleFood(food)}
                  style={[styles.chip, active && styles.chipActive]}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>{food}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* AVAILABILITY */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Availability</Text>
          <View style={styles.card}>
            <View style={styles.availabilityRow}>
              <Text style={styles.availabilityTitle}>Available Today</Text>
              <Switch
                value={isAvailable}
                onValueChange={toggleAvailability}
                trackColor={{ false: Colors.border, true: Colors.primary }}
                thumbColor={Colors.white}
              />
            </View>
            <View style={styles.divider} />
            <Text style={styles.subLabel}>Available Days</Text>
            <View style={styles.daysRow}>
              {DAYS.map(day => {
                const active = availableDays.includes(day);
                const short = day.substring(0, 3);
                return (
                  <TouchableOpacity
                    key={day}
                    onPress={() => handleToggleDay(day)}
                    style={[styles.dayCircle, active && styles.dayCircleActive]}
                  >
                    <Text style={[styles.dayText, active && styles.dayTextActive]}>{short}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>

      </ScrollView>

      {/* Save Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>Save Preferences</Text>
        </TouchableOpacity>
      </View>

      {/* Time Picker Modal */}
      <Modal visible={timeSelectorVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Select {activeTimeField === 'start' ? 'Start Time' : 'End Time'}</Text>
            <ScrollView style={{ maxHeight: 300 }}>
              {TIME_OPTIONS.map(t => (
                <TouchableOpacity key={t} style={styles.timeOption} onPress={() => handleSelectTime(t)}>
                  <Text style={styles.timeOptionText}>{t}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setTimeSelectorVisible(false)}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16, gap: 24, paddingBottom: 40 },

  section: { gap: 10 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: Colors.textSecondary, marginLeft: 4 },

  timeRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  timeBtn: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 14,
  },
  timeLabel: { fontSize: 11, color: Colors.textMuted, marginBottom: 4 },
  timeValue: { fontSize: 15, fontWeight: '600', color: Colors.textPrimary },
  timeDivider: { width: 24, alignItems: 'center' },

  input: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: Colors.textPrimary,
  },

  chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  chipActive: {
    backgroundColor: Colors.primaryWash,
    borderColor: Colors.primaryDark,
  },
  chipText: { fontSize: 13, fontWeight: '500', color: Colors.textSecondary },
  chipTextActive: { color: Colors.primaryDark, fontWeight: '700' },

  card: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 16,
    padding: 16,
  },
  availabilityRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  availabilityTitle: { fontSize: 15, fontWeight: '600', color: Colors.textPrimary },
  divider: { height: 1, backgroundColor: Colors.border, marginBottom: 16 },
  subLabel: { fontSize: 13, color: Colors.textSecondary, marginBottom: 12 },
  daysRow: { flexDirection: 'row', justifyContent: 'space-between' },
  dayCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
  },
  dayCircleActive: {
    backgroundColor: Colors.primaryDark,
    borderColor: Colors.primaryDark,
  },
  dayText: { fontSize: 12, color: Colors.textSecondary, fontWeight: '600' },
  dayTextActive: { color: Colors.white, fontWeight: '700' },

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

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: Colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 },
  modalTitle: { fontSize: 18, fontWeight: '800', color: Colors.textPrimary, marginBottom: 16 },
  timeOption: { paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: Colors.border },
  timeOptionText: { fontSize: 16, color: Colors.textPrimary, textAlign: 'center' },
  modalCancelBtn: { marginTop: 16, paddingVertical: 14, backgroundColor: Colors.background, borderRadius: 12, borderWidth: 1, borderColor: Colors.border, alignItems: 'center' },
  modalCancelText: { fontSize: 15, fontWeight: '600', color: Colors.textPrimary },
});
