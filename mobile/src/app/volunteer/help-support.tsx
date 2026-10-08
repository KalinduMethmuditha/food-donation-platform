import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import VolunteerScreenHeader from '@/components/volunteer/VolunteerScreenHeader';
import Card from '@/components/ui/Card';
import PrimaryButton from '@/components/ui/PrimaryButton';
import { Colors } from '@/constants/colors';
import { getApiErrorMessage } from '@/services/apiErrors';
import { createVolunteerSupportRequest, getVolunteerSupportRequests, type VolunteerSupportRequest } from '@/services/volunteerSupport';
import { formatDateTime } from '@/utils/dateTime';

const faq = [
  ['How do I start a pickup?', 'Open an assigned pickup from Home or Pickups and tap Start Route.'],
  ['How do I update pickup status?', 'Open Collection Status and complete each step in order. Your progress is saved on the server.'],
  ['How do I report a pickup issue?', 'Open Collection Status and use Report Issue. The note is saved with that donation.'],
  ['How do I change availability?', 'Open Profile, then Pickup Preferences. Save your availability so NGOs can assign you.'],
];
const issueTypes = ['App Problem', 'Pickup Problem', 'Route Problem', 'Notification Problem', 'Profile Problem', 'Other'];

export default function HelpSupportScreen() {
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [requests, setRequests] = useState<VolunteerSupportRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setRequests(await getVolunteerSupportRequests());
      setError('');
    } catch (cause) {
      setError(getApiErrorMessage(cause, 'load'));
    } finally {
      setLoading(false);
    }
  }, []);
  useFocusEffect(useCallback(() => { void load(); }, [load]));

  const submit = async () => {
    if (!type || description.trim().length < 10 || saving) {
      setError('Choose an issue type and enter at least 10 characters.');
      return;
    }
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await createVolunteerSupportRequest(type, description.trim());
      setType('');
      setDescription('');
      setSuccess('Your support request was saved.');
      await load();
    } catch (cause) {
      setError(getApiErrorMessage(cause, 'load'));
    } finally {
      setSaving(false);
    }
  };

  return <SafeAreaView style={styles.safe} edges={['top']}>
    <VolunteerScreenHeader title="Help & Support" onBack={() => router.back()} />
    <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Text style={styles.section}>Frequently Asked Questions</Text>
      {faq.map(([question, answer]) => <Card key={question} style={styles.card}>
        <Text style={styles.title}>{question}</Text>
        <Text style={styles.body}>{answer}</Text>
      </Card>)}
      <Text style={styles.section}>Send a Support Request</Text>
      <Card style={styles.card}>
        <Text style={styles.body}>Issue type</Text>
        <View style={styles.types}>{issueTypes.map((option) =>
          <Text key={option} accessibilityRole="button" onPress={() => setType(option)}
            style={[styles.type, type === option && styles.selected]}>{option}</Text>)}</View>
        <TextInput style={styles.input} multiline maxLength={2000} placeholder="Describe the issue..."
          value={description} onChangeText={setDescription} />
        {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
        {success ? <Text style={styles.success}>{success}</Text> : null}
        <PrimaryButton title="Submit Request" loading={saving} onPress={() => void submit()} />
      </Card>
      <Text style={styles.section}>My Requests</Text>
      {loading ? <ActivityIndicator color={Colors.primary} /> : null}
      {!loading && requests.length === 0 ? <Text style={styles.body}>No support requests yet.</Text> : null}
      {requests.map((request) => <Card key={request.id} style={styles.card}>
        <Text style={styles.title}>{request.type}</Text>
        <Text style={styles.body}>{request.description}</Text>
        <Text style={styles.body}>{formatDateTime(request.created_at)}</Text>
      </Card>)}
    </ScrollView>
  </SafeAreaView>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 20, gap: 12, paddingBottom: 30 },
  section: { color: Colors.textPrimary, fontSize: 17, fontWeight: '700', marginTop: 10 },
  card: { gap: 9 },
  title: { color: Colors.textPrimary, fontSize: 14, fontWeight: '700' },
  body: { color: Colors.textSecondary, fontSize: 13, lineHeight: 20 },
  types: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  type: { paddingHorizontal: 10, paddingVertical: 8, borderRadius: 9, borderWidth: 1, borderColor: Colors.border, color: Colors.textPrimary },
  selected: { borderColor: Colors.primary, backgroundColor: Colors.primaryLight },
  input: { minHeight: 95, borderWidth: 1, borderColor: Colors.border, borderRadius: 10, padding: 12, textAlignVertical: 'top' },
  error: { color: Colors.danger },
  success: { color: Colors.primaryDark },
});
