import { router } from 'expo-router';
import { Alert, Linking, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import Icon from '@/components/ui/Icon';
import { Colors } from '@/constants/colors';
import VolunteerScreenHeader from '@/components/volunteer/VolunteerScreenHeader';
import { useVolunteerStore } from '@/store/volunteerStore';

const FAQ_DATA = [
  { id: '1', question: 'How do I start a pickup?', answer: 'To start a pickup, go to your Dashboard and tap "View Details" on the Active Pickup card. Then tap "Start Route" to begin navigating to the pickup location.' },
  { id: '2', question: 'How do I update a pickup status?', answer: 'Go to Collection Status from your Dashboard or Quick Actions. Tap any status step to update your current progress. Each update is saved locally and reflected across the app.' },
  { id: '3', question: 'How do I report an issue?', answer: 'On the Collection Status screen, tap "Report Issue". Select the type of issue, add a description if needed, and tap Submit. The issue will be recorded locally.' },
  { id: '4', question: 'What should I do if the donor is unavailable?', answer: 'If the donor is unavailable, use the Report Issue feature on the Collection Status screen and select "Donor unavailable". Contact our support team if you need further help.' },
  { id: '5', question: 'How do I change my pickup preferences?', answer: 'Go to Profile > Pickup Preferences. You can set your preferred pickup time, area, radius, and food types. Changes are saved immediately.' },
  { id: '6', question: 'How do I update my profile?', answer: 'Go to Profile > Edit Profile. Update your details and tap Save Changes. Your profile is updated instantly for the current session.' },
];

const ISSUE_TYPES = ['App Problem', 'Pickup Problem', 'Route Problem', 'Donor Problem', 'Notification Problem', 'Profile Problem', 'Other'];

export default function HelpSupportScreen() {
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportType, setReportType] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [reportTypeError, setReportTypeError] = useState('');
  const [reportDescError, setReportDescError] = useState('');

  const { addActivity, addNotification, addSupportRequest } = useVolunteerStore();

  const handleSubmitReport = () => {
    setReportTypeError('');
    setReportDescError('');
    let valid = true;

    if (!reportType) {
      setReportTypeError('Please select an issue type');
      valid = false;
    }
    if (reportDescription.length < 10) {
      setReportDescError('Description must be at least 10 characters');
      valid = false;
    }

    if (!valid) return;

    addSupportRequest(reportType, reportDescription);
    addActivity({
      icon: 'alert-triangle',
      title: 'Support Request Submitted',
      description: `Reported issue: ${reportType}`,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
    });
    addNotification({
      type: 'issue',
      title: 'Support request submitted',
      description: 'Your issue has been recorded.',
      time: 'Just now',
      read: false,
      navigateTo: '/volunteer/help-support',
    });

    setShowReportModal(false);
    setReportType('');
    setReportDescription('');
    Alert.alert('Report Submitted', 'Our support team will review your report shortly.');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <VolunteerScreenHeader title="Help & Support" onBack={() => router.back()} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* FAQ Section */}
        <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
        <View style={styles.card}>
          {FAQ_DATA.map((faq, index) => (
            <View key={faq.id}>
              <Pressable
                style={styles.faqRow}
                onPress={() => setExpandedFaq(faq.id === expandedFaq ? null : faq.id)}
              >
                <Text style={styles.faqQuestion}>{faq.question}</Text>
                <Icon
                  name={faq.id === expandedFaq ? 'trash' : 'chevron-right'} // Just using chevron as placeholder or similar for state
                  size={20}
                  color={Colors.textMuted}
                />
              </Pressable>
              {faq.id === expandedFaq && (
                <View style={styles.faqAnswerContainer}>
                  <Text style={styles.faqAnswer}>{faq.answer}</Text>
                </View>
              )}
              {index < FAQ_DATA.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>

        {/* Contact Support Section */}
        <Text style={styles.sectionTitle}>Contact Support</Text>
        <View style={styles.card}>
          <Pressable style={styles.contactRow} onPress={() => Linking.openURL('tel:+94112345678')}>
            <View style={styles.contactIconBox}><Icon name="phone" size={20} color={Colors.primaryDark} /></View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>Call Support</Text>
              <Text style={styles.contactDesc}>Support Hotline: +94 11 234 5678</Text>
            </View>
            <Icon name="chevron-right" size={20} color={Colors.textMuted} />
          </Pressable>
          <View style={styles.divider} />
          <Pressable style={styles.contactRow} onPress={() => Linking.openURL('mailto:support@fooddonation.lk?subject=Support Request')}>
            <View style={styles.contactIconBox}><Icon name="message" size={20} color={Colors.primaryDark} /></View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>Email Support</Text>
              <Text style={styles.contactDesc}>support@fooddonation.lk</Text>
            </View>
            <Icon name="chevron-right" size={20} color={Colors.textMuted} />
          </Pressable>
          <View style={styles.divider} />
          <Pressable style={styles.contactRow} onPress={() => Linking.openURL('sms:+94112345678')}>
            <View style={styles.contactIconBox}><Icon name="message" size={20} color={Colors.primaryDark} /></View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>Message Support</Text>
              <Text style={styles.contactDesc}>Send us a message</Text>
            </View>
            <Icon name="chevron-right" size={20} color={Colors.textMuted} />
          </Pressable>
        </View>

        {/* Report Problem Button */}
        <TouchableOpacity style={styles.reportBtn} onPress={() => setShowReportModal(true)}>
          <Text style={styles.reportBtnText}>Report a Problem</Text>
        </TouchableOpacity>

        {/* App Info */}
        <Text style={styles.sectionTitle}>App Information</Text>
        <View style={styles.card}>
          <View style={{ padding: 16 }}>
            <Text style={{ fontSize: 15, fontWeight: '700', color: Colors.textPrimary }}>Food Donation Platform - Volunteer App</Text>
            <Text style={{ fontSize: 13, color: Colors.textSecondary, marginTop: 4 }}>Version 1.0.0</Text>
            <Text style={{ fontSize: 13, color: Colors.textSecondary, marginTop: 2 }}>For volunteer pickup coordination</Text>
          </View>
        </View>
      </ScrollView>

      {/* Report Modal */}
      <Modal visible={showReportModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Report a Problem</Text>

            <Text style={styles.inputLabel}>Issue Type *</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 4 }}>
              {ISSUE_TYPES.map(type => (
                <TouchableOpacity
                  key={type}
                  style={[styles.typeChip, reportType === type && styles.typeChipActive]}
                  onPress={() => setReportType(type)}
                >
                  <Text style={[styles.typeChipText, reportType === type && styles.typeChipTextActive]}>{type}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            {reportTypeError ? <Text style={styles.errorText}>{reportTypeError}</Text> : <View style={{ height: 16 }} />}

            <Text style={styles.inputLabel}>Description *</Text>
            <TextInput
              style={styles.inputArea}
              placeholder="Describe the issue..."
              multiline
              numberOfLines={4}
              value={reportDescription}
              onChangeText={setReportDescription}
              textAlignVertical="top"
            />
            {reportDescError ? <Text style={styles.errorText}>{reportDescError}</Text> : <View style={{ height: 16 }} />}

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowReportModal(false)}>
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
  content: { padding: 16, paddingBottom: 40 },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
    marginTop: 16,
    marginLeft: 4,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  divider: { height: 1, backgroundColor: Colors.border },
  
  // FAQ
  faqRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  faqQuestion: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
    paddingRight: 16,
  },
  faqAnswerContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  faqAnswer: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },

  // Contact
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  contactIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.primaryWash,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  contactInfo: { flex: 1 },
  contactLabel: { fontSize: 15, fontWeight: '600', color: Colors.textPrimary },
  contactDesc: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },

  // Report button
  reportBtn: {
    marginTop: 24,
    marginBottom: 8,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.primaryDark,
    alignItems: 'center',
    backgroundColor: Colors.primaryWash,
  },
  reportBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.primaryDark,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 24,
    textAlign: 'center',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  typeChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    marginRight: 8,
    marginBottom: 8,
  },
  typeChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  typeChipText: { fontSize: 14, fontWeight: '500', color: Colors.textPrimary },
  typeChipTextActive: { color: Colors.white },
  
  inputArea: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 12,
    height: 100,
    fontSize: 15,
    color: Colors.textPrimary,
  },
  errorText: {
    fontSize: 12,
    color: Colors.danger,
    marginTop: 4,
  },
  
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  cancelBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  submitBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: Colors.primaryDark,
    alignItems: 'center',
  },
  submitBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.white,
  },
});
