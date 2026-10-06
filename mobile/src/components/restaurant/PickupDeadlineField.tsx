import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import FormField from '@/components/ui/FormField';
import Icon from '@/components/ui/Icon';
import PrimaryButton from '@/components/ui/PrimaryButton';
import SecondaryButton from '@/components/ui/SecondaryButton';
import { Colors } from '@/constants/colors';
import { formatDateTime } from '@/utils/dateTime';

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function PickupDeadlineField({ value, error, onChange }: {
  value: string;
  error?: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(new Date());
  const [month, setMonth] = useState(new Date());
  const [hour, setHour] = useState('');
  const [minute, setMinute] = useState('');
  const [pickerError, setPickerError] = useState('');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const canGoBack = firstDay > new Date(today.getFullYear(), today.getMonth(), 1);
  const cells = Array.from({ length: Math.ceil((firstDay.getDay() + daysInMonth) / 7) * 7 }, (_, index) => {
    const day = index - firstDay.getDay() + 1;
    return day > 0 && day <= daysInMonth ? day : null;
  });

  const openPicker = () => {
    const saved = new Date(value);
    const initial = !Number.isNaN(saved.getTime()) && saved.getTime() > Date.now()
      ? saved : new Date(Date.now() + 60 * 60 * 1000);
    setSelected(initial);
    setMonth(new Date(initial.getFullYear(), initial.getMonth(), 1));
    setHour(String(initial.getHours()).padStart(2, '0'));
    setMinute(String(initial.getMinutes()).padStart(2, '0'));
    setPickerError('');
    setOpen(true);
  };

  const confirm = () => {
    if (!/^\d{1,2}$/.test(hour) || !/^\d{1,2}$/.test(minute) || Number(hour) > 23 || Number(minute) > 59) {
      setPickerError('Enter a valid time using hours 00–23 and minutes 00–59.');
      return;
    }
    const deadline = new Date(selected);
    deadline.setHours(Number(hour), Number(minute), 0, 0);
    if (deadline.getTime() <= Date.now()) {
      setPickerError('Please select a future pickup date and time.');
      return;
    }
    onChange(deadline.toISOString());
    setOpen(false);
  };

  return <View style={styles.field}>
    <Text style={styles.label}>Collection / Pickup Deadline</Text>
    <Pressable accessibilityRole="button" accessibilityLabel="Choose collection or pickup deadline"
      onPress={openPicker} style={[styles.input, error && styles.errorBorder]}>
      <Text style={value ? styles.text : styles.placeholder}>{value ? formatDateTime(value) : 'Select date and time'}</Text>
      <Icon name="clock" size={22} />
    </Pressable>
    <Text style={error ? styles.error : styles.hint} accessibilityRole={error ? 'alert' : undefined}>
      {error || 'Select a future date and time. Past dates are unavailable.'}
    </Text>
    <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
      <View style={styles.overlay}>
        <ScrollView style={styles.dialog} contentContainerStyle={styles.dialogContent} keyboardShouldPersistTaps="handled">
          <View accessibilityViewIsModal>
            <Text style={styles.title}>Pickup deadline</Text>
            <View style={styles.monthRow}>
              <Pressable accessibilityRole="button" accessibilityLabel="Previous month" disabled={!canGoBack}
                onPress={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}
                style={styles.monthButton}><Text style={!canGoBack ? styles.placeholder : styles.text}>‹</Text></Pressable>
              <Text style={styles.monthTitle}>{month.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</Text>
              <Pressable accessibilityRole="button" accessibilityLabel="Next month"
                onPress={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}
                style={styles.monthButton}><Text style={styles.text}>›</Text></Pressable>
            </View>
            <View style={styles.grid}>
              {weekdays.map((day) => <Text key={day} style={styles.weekday}>{day}</Text>)}
              {cells.map((day, index) => {
                if (!day) return <View key={`blank-${index}`} style={styles.day} />;
                const date = new Date(month.getFullYear(), month.getMonth(), day);
                const disabled = date < today;
                const isSelected = date.toDateString() === selected.toDateString();
                return <Pressable key={day} accessibilityRole="button" accessibilityLabel={date.toDateString()}
                  accessibilityState={{ disabled, selected: isSelected }} disabled={disabled}
                  onPress={() => { setSelected(date); setPickerError(''); }}
                  style={[styles.day, isSelected && styles.selectedDay]}>
                  <Text style={[styles.text, disabled && styles.placeholder, isSelected && styles.selectedText]}>{day}</Text>
                </Pressable>;
              })}
            </View>
            <Text style={styles.hint}>Time in your local timezone (24-hour clock)</Text>
            <View style={styles.timeRow}>
              <View style={styles.timeField}><FormField label="Hour" value={hour} keyboardType="number-pad" maxLength={2}
                onChangeText={(text) => { setHour(text.replace(/\D/g, '')); setPickerError(''); }} /></View>
              <View style={styles.timeField}><FormField label="Minute" value={minute} keyboardType="number-pad" maxLength={2}
                onChangeText={(text) => { setMinute(text.replace(/\D/g, '')); setPickerError(''); }} /></View>
            </View>
            {pickerError ? <Text accessibilityRole="alert" style={styles.error}>{pickerError}</Text> : null}
            <View style={styles.actions}>
              <SecondaryButton title="Cancel" style={styles.timeField} onPress={() => setOpen(false)} />
              <PrimaryButton title="Set deadline" style={styles.timeField} onPress={confirm} />
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  </View>;
}

const styles = StyleSheet.create({
  field: { marginBottom: 18 },
  label: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary, marginBottom: 7 },
  input: { minHeight: 48, borderWidth: 1, borderColor: Colors.border, borderRadius: 12, padding: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  text: { color: Colors.textPrimary, fontSize: 14 },
  placeholder: { color: Colors.textMuted },
  hint: { color: Colors.textSecondary, fontSize: 12, marginTop: 6, lineHeight: 18 },
  error: { color: Colors.danger, fontSize: 12, marginTop: 6 },
  errorBorder: { borderColor: Colors.danger },
  overlay: { flex: 1, backgroundColor: Colors.overlay, justifyContent: 'center', padding: 20 },
  dialog: { flexGrow: 0, maxHeight: '90%', width: '100%', maxWidth: 420, alignSelf: 'center', backgroundColor: Colors.surface, borderRadius: 16 },
  dialogContent: { padding: 20 },
  title: { color: Colors.textPrimary, fontSize: 20, fontWeight: '700' },
  monthRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 12 },
  monthTitle: { color: Colors.textPrimary, fontSize: 16, fontWeight: '600' },
  monthButton: { minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  weekday: { width: '14.2857%', textAlign: 'center', color: Colors.textSecondary, fontSize: 11, paddingVertical: 8 },
  day: { width: '14.2857%', minHeight: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 8 },
  selectedDay: { backgroundColor: Colors.primary },
  selectedText: { color: Colors.white, fontWeight: '700' },
  timeRow: { flexDirection: 'row', gap: 12, marginTop: 12 },
  timeField: { flex: 1 },
  actions: { flexDirection: 'row', gap: 12, marginTop: 16 },
});
