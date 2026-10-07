import { router } from 'expo-router';
import {
  Alert,
  Linking,
  Modal,
  ScrollView,
  StyleSheet,
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

const FAQ_ITEMS = [
  {
    q: 'How do I start a pickup?',
    a: 'Go to Pickup Details from the Dashboard or Pickups tab, then tap "Start Route". This will update your status to "On the Way" and open the route screen.',
  },
  {
    q: 'How do I update a pickup status?',
    a: 'Navigate to Collection Status from the Dashboard or Pickups tab. You can tap each stage in the timeline to advance your status, or use the action buttons at the bottom.',
  },
  {
    q: 'How do I report an issue?',
    a: 'On the Collection Status screen, scroll to the bottom and tap "Report Issue". Select the issue type from the list and submit your report.',
  },
  {
    q: 'What should I do if the donor is unavailable?',
    a: 'First try calling the donor from Pickup Details. If still unavailable, go to Collection Status and use "Report Issue" → select "Donor unavailable".',
  },
  {
    q: 'How do I change my pickup preferences?',
    a: 'Go to Profile → Pickup Preferences. You can change your preferred time, area, pickup radius, food types, and availability days.',
  },
  {
    q: 'How do I update my profile?',
    a: 'Go to Profile → Edit Profile. Update your name, phone, email, or location and tap "Save Changes".',
  },
];

const ISSUE_TYPES = ['App Problem', 'Pickup Problem', 'Route Problem', 'Donor Problem', 'Notification Problem', 'Profile Problem', 'Other'];

export default function HelpSupportScreen() {
  const { addActivity, addNotification, notificationPreferences } = useVolunteerStore();
  
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const [reportVisible, setReportVisible] = useState(false);
  const [issueType, setIssueType] = useState('');
  const [issueDesc, setIssueDesc] = useState('');
  const [errors, setErrors] = useState<{ issueType?: string; issueDesc?: string }>({});

  const handleCall = () => Linking.openURL('tel:+94112345678');
  const handleEmail = () => Linking.openURL('mailto:support@fooddonation.example.com?subject=Volunteer Support Request');
  const handleMessage = () => Linking.openURL('sms:+94112345678');

  const validateReport = () => {
    const e: typeof errors = {};
    if (!issueType) e.issueType = 'Please select an issue type.';
    if (!issueDesc.trim()) e.issueDesc = 'Please describe your issue.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmitReport = () => {
    if (!validateReport()) return;
    addActivity('Support request submitted', `${issueType}: ${issueDesc}`, 'INFO', 'questionmark.circle');
    if (notificationPreferences.issueUpdates) {
      addNotification('Support request submitted', 'Your issue has been recorded.', 'issue', '/volunteer/activity');
    }
    setReportVisible(false);
    setIssueType('');
    setIssueDesc('');
    setErrors({});
    Alert.alert('Support Request Submitted', 'Your issue has been recorded. Our team will review it shortly.', [{ text: 'OK' }]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <VolunteerScreenHeader title="Help & Support" onBack={() => router.back()} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* FAQ */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          <View style={styles.card}>
            {FAQ_ITEMS.map((item, i) => (
              <View key={i}>
                <TouchableOpacity
                  style={styles.faqRow}
                  onPress={() => setExpandedIdx(expandedIdx === i ? null : i)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.faqQuestion}>{item.q}</Text>
                  <Icon name={expandedIdx === i ? 'arrow-up' : 'chevron.right'} size={16} color={Colors.textMuted} />
                </TouchableOpacity>
                {expandedIdx === i && (
                  <View style={styles.faqAnswer}>
                    <Text style={styles.faqAnswerText}>{item.a}</Text>
                  </View>
                )}
                {i < FAQ_ITEMS.length - 1 && <View style={styles.divider} />}
              </View>
            ))}
          </View>
        </View>

        {/* Contact Support */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Support</Text>
          <View style={styles.card}>
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>Support Hotline</Text>
              <Text style={styles.contactValue}>+94 11 234 5678</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>Support Email</Text>
              <Text style={styles.contactValue}>support@fooddonation.example.com</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.contactBtns}>
              <TouchableOpacity style={styles.contactBtn} onPress={handleCall}>
                <Icon name="phone" size={18} color={Colors.primaryDark} />
                <Text style={styles.contactBtnText}>Call</Text>
              </TouchableOpacity>
              <View style={styles.btnDivider} />
              <TouchableOpacity style={styles.contactBtn} onPress={handleEmail}>
                <Icon name="message" size={18} color={Colors.primaryDark} />
                <Text style={styles.contactBtnText}>Email</Text>
              </TouchableOpacity>
              <View style={styles.btnDivider} />
              <TouchableOpacity style={styles.contactBtn} onPress={handleMessage}>
                <Icon name="message" size={18} color={Colors.primaryDark} />
                <Text style={styles.contactBtnText}>Message</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Report a Problem */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Report a Problem</Text>
          <TouchableOpacity style={styles.reportCard} onPress={() => setReportVisible(true)}>
            <View style={styles.reportIcon}>
              <Icon name="alert-triangle" size={22} color={Colors.danger} />
            </View>
            <View style={styles.reportText}>
              <Text style={styles.reportTitle}>Report a Problem</Text>
              <Text style={styles.reportDesc}>Submit a technical or operational issue</Text>
            </View>
            <Icon name="chevron.right" size={16} color={Colors.border} />
          </TouchableOpacity>
        </View>

        {/* App Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Information</Text>
          <View style={styles.card}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>App Version</Text>
              <Text style={styles.infoValue}>1.0.0</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Platform</Text>
              <Text style={styles.infoValue}>Volunteer Mobile App</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Support Hours</Text>
              <Text style={styles.infoValue}>8 AM – 8 PM (Mon–Sat)</Text>
            </View>
          </View>
        </View>

      </ScrollView>

      {/* Report Modal */}
      <Modal visible={reportVisible} transparent animationType="slide" onRequestClose={() => setReportVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Report a Problem</Text>

            <Text style={styles.fieldLabel}>Issue Type *</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 4 }}>
              <View style={styles.typeChips}>
                {ISSUE_TYPES.map(t => (
                  <TouchableOpacity
                    key={t}
                    onPress={() => { setIssueType(t); setErrors(e => ({ ...e, issueType: undefined })); }}
                    style={[styles.chip, issueType === t && styles.chipActive]}
                  >
                    <Text style={[styles.chipText, issueType === t && styles.chipTextActive]}>{t}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
            {errors.issueType && <Text style={styles.errorText}>{errors.issueType}</Text>}

            <Text style={[styles.fieldLabel, { marginTop: 16 }]}>Description *</Text>
            <TextInput
              style={[styles.textArea, errors.issueDesc && styles.inputError]}
              multiline
              numberOfLines={4}
              placeholder="Please describe your issue in detail..."
              value={issueDesc}
              onChangeText={t => { setIssueDesc(t); setErrors(e => ({ ...e, issueDesc: undefined })); }}
              textAlignVertical="top"
            />
            {errors.issueDesc && <Text style={styles.errorText}>{errors.issueDesc}</Text>}

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => { setReportVisible(false); setErrors({}); }}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.submitBtn} onPress={handleSubmitReport}>
                <Text style={styles.submitBtnText}>Submit Report</Text>
              </TouchableOpacity>
            </View>
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
  sectionTitle: { fontSize: 13, fontWeight: '700', color: Colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5, marginLeft: 4 },
  card: { backgroundColor: Colors.surface, borderRadius: 16, borderWidth: 1, borderColor: Colors.border, overflow: 'hidden' },
  divider: { height: 1, backgroundColor: Colors.border, marginHorizontal: 16 },

  faqRow: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 },
  faqQuestion: { flex: 1, fontSize: 14, fontWeight: '600', color: Colors.textPrimary, lineHeight: 20 },
  faqAnswer: { backgroundColor: Colors.primaryWash, padding: 16, paddingTop: 0 },
  faqAnswerText: { fontSize: 14, color: Colors.textSecondary, lineHeight: 22 },

  contactInfo: { padding: 16 },
  contactLabel: { fontSize: 12, color: Colors.textMuted, marginBottom: 4 },
  contactValue: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },
  contactBtns: { flexDirection: 'row' },
  contactBtn: { flex: 1, alignItems: 'center', paddingVertical: 14, gap: 6 },
  contactBtnText: { fontSize: 13, fontWeight: '600', color: Colors.primaryDark },
  btnDivider: { width: 1, backgroundColor: Colors.border },

  reportCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 14,
  },
  reportIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reportText: { flex: 1 },
  reportTitle: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  reportDesc: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },

  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  infoLabel: { fontSize: 14, color: Colors.textSecondary },
  infoValue: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },

  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.45)' },
  modalSheet: { backgroundColor: Colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
  modalHandle: { width: 36, height: 4, borderRadius: 2, backgroundColor: Colors.border, alignSelf: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 18, fontWeight: '800', color: Colors.textPrimary, marginBottom: 20 },
  fieldLabel: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary, marginBottom: 8 },
  typeChips: { flexDirection: 'row', gap: 8 },
  chip: { borderWidth: 1, borderColor: Colors.border, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, backgroundColor: Colors.surface },
  chipActive: { backgroundColor: Colors.primaryWash, borderColor: Colors.primaryDark },
  chipText: { fontSize: 13, color: Colors.textSecondary },
  chipTextActive: { color: Colors.primaryDark, fontWeight: '700' },
  textArea: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
    color: Colors.textPrimary,
    minHeight: 100,
  },
  inputError: { borderColor: Colors.danger },
  errorText: { fontSize: 12, color: Colors.danger, marginTop: 4 },
  modalActions: { flexDirection: 'row', gap: 12, marginTop: 24 },
  cancelBtn: { flex: 1, paddingVertical: 14, borderRadius: 12, borderWidth: 1, borderColor: Colors.border, alignItems: 'center' },
  cancelBtnText: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },
  submitBtn: { flex: 1, paddingVertical: 14, borderRadius: 12, backgroundColor: Colors.primaryDark, alignItems: 'center' },
  submitBtnText: { fontSize: 14, fontWeight: '700', color: Colors.white },
});
