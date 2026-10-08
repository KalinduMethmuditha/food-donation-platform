import { router } from 'expo-router';
import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import VolunteerScreenHeader from '@/components/volunteer/VolunteerScreenHeader';
import Card from '@/components/ui/Card';
import PrimaryButton from '@/components/ui/PrimaryButton';
import SecondaryButton from '@/components/ui/SecondaryButton';
import { Colors } from '@/constants/colors';
import { useSelectedAssignment, useVolunteerAssignments } from '@/store/volunteerAssignments.store';
import { formatDateTime } from '@/utils/dateTime';

const stages = [
  { status: 'assigned', label: 'Assigned' },
  { status: 'pickup', label: 'On the Way' },
  { status: 'arrived', label: 'Arrived' },
  { status: 'collected', label: 'Collected' },
  { status: 'delivered', label: 'Delivered' },
];
const issues = ['Damaged food', 'Donor unavailable', 'Quantity mismatch', 'Pickup delayed', 'Wrong address', 'Food quality concern', 'Transport issue'];

export default function CollectionStatusScreen() {
  const assignment = useSelectedAssignment();
  const { advance, addUpdate, isSaving, error } = useVolunteerAssignments();
  const [updateText, setUpdateText] = useState('');
  const [reportVisible, setReportVisible] = useState(false);
  const [issueText, setIssueText] = useState('');

  const saveNote = async (note: string) => {
    if (!assignment || !note.trim()) return;
    try {
      await addUpdate(assignment.id, note.trim());
      setUpdateText('');
      setIssueText('');
      setReportVisible(false);
    } catch { /* The store displays the API error. */ }
  };

  const changeStatus = async (status: 'pickup' | 'arrived' | 'collected' | 'delivered') => {
    if (!assignment) return;
    try {
      await advance(assignment.id, status);
      if (status === 'collected' || status === 'delivered') router.push('/volunteer/confirmation');
    } catch { /* The store displays the API error. */ }
  };

  const currentIndex = stages.findIndex((item) => item.status === assignment?.status);
  const next = stages[currentIndex + 1]?.status as 'pickup' | 'arrived' | 'collected' | 'delivered' | undefined;

  return <SafeAreaView style={styles.safe} edges={['top']}>
    <VolunteerScreenHeader title="Collection Status" onBack={() => router.back()} />
    <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
      {!assignment ? <Card><Text style={styles.title}>No pickup selected</Text>
        <SecondaryButton title="View Pickups" onPress={() => router.replace('/volunteer/pickup-details')} /></Card> : <>
        <Card style={styles.card}>
          <Text style={styles.title}>{assignment.foodType}</Text>
          <Text style={styles.body}>{assignment.donorName} · {assignment.pickupLocation}</Text>
          <Text style={styles.body}>{assignment.quantity} {assignment.unit}</Text>
        </Card>
        <Card style={styles.card}>
          <Text style={styles.title}>Pickup Progress</Text>
          {stages.map((stage, index) => <View key={stage.status} style={styles.stage}>
            <View style={[styles.dot, index <= currentIndex && styles.dotActive]} />
            <Text style={[styles.body, index === currentIndex && styles.current]}>{stage.label}</Text>
            <Text style={styles.time}>{formatDateTime(assignment.statusLogs.find((log) => log.status === stage.status)?.createdAt)}</Text>
          </View>)}
        </Card>
        <Card style={styles.card}>
          <Text style={styles.title}>Add Update</Text>
          <TextInput style={styles.input} placeholder="Write an update about this pickup..."
            multiline maxLength={500} value={updateText} onChangeText={setUpdateText} />
          <PrimaryButton title="Add Update" disabled={!updateText.trim()} loading={isSaving}
            onPress={() => void saveNote(updateText)} />
        </Card>
        {next ? <PrimaryButton title={next === 'pickup' ? 'Start Route' : next === 'arrived' ? 'Mark Arrived' : next === 'collected' ? 'Mark as Collected' : 'Mark as Delivered'}
          loading={isSaving} onPress={() => void changeStatus(next)} /> : null}
        <SecondaryButton title="Report Issue" onPress={() => setReportVisible(true)} />
      </>}
    </ScrollView>
    <Modal visible={reportVisible} transparent animationType="fade" onRequestClose={() => setReportVisible(false)}>
      <View style={styles.overlay}><Card style={styles.modal}>
        <Text style={styles.title}>Report Issue</Text>
        {issues.map((issue) => <Pressable key={issue} style={styles.issue} onPress={() => void saveNote('Issue: ' + issue)}>
          <Text style={styles.body}>{issue}</Text></Pressable>)}
        <TextInput style={styles.input} placeholder="Other issue" maxLength={500} value={issueText} onChangeText={setIssueText} />
        <PrimaryButton title="Submit Issue" disabled={!issueText.trim()} loading={isSaving}
          onPress={() => void saveNote('Issue: ' + issueText)} />
        <SecondaryButton title="Cancel" onPress={() => setReportVisible(false)} />
      </Card></View>
    </Modal>
  </SafeAreaView>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 20, gap: 14, paddingBottom: 30 },
  card: { gap: 10 },
  title: { fontSize: 17, fontWeight: '700', color: Colors.textPrimary },
  body: { fontSize: 13, lineHeight: 20, color: Colors.textSecondary },
  current: { color: Colors.primaryDark, fontWeight: '700' },
  stage: { flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 40 },
  dot: { width: 16, height: 16, borderRadius: 8, borderWidth: 2, borderColor: Colors.border },
  dotActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  time: { flex: 1, textAlign: 'right', color: Colors.textMuted, fontSize: 11 },
  input: { minHeight: 70, borderWidth: 1, borderColor: Colors.border, borderRadius: 10, padding: 12, backgroundColor: Colors.surface, textAlignVertical: 'top' },
  error: { color: Colors.danger },
  overlay: { flex: 1, backgroundColor: Colors.overlay, justifyContent: 'center', padding: 20 },
  modal: { maxHeight: '90%', gap: 8 },
  issue: { paddingVertical: 7, borderBottomWidth: 1, borderColor: Colors.border },
});
