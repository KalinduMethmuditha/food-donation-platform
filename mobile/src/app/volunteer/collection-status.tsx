import { router } from 'expo-router';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import Icon from '@/components/ui/Icon';
import { Colors } from '@/constants/colors';
import { mockActivePickup } from '@/data/mockVolunteerData';
import VolunteerScreenHeader from '@/components/volunteer/VolunteerScreenHeader';
import { useVolunteerStore } from '@/store/volunteerStore';

const REPORT_OPTIONS = [
  'Damaged food',
  'Donor unavailable',
  'Quantity mismatch',
  'Pickup delayed',
  'Wrong address',
  'Food quality concern',
  'Transport issue',
  'Other',
];

export default function CollectionStatusScreen() {
  const pickup = mockActivePickup;

  const {
    pickupStatus,
    setPickupStatus,
    addActivity,
    addNotification,
  } = useVolunteerStore();

  const [reportVisible, setReportVisible] = useState(false);
  const [otherIssueVisible, setOtherIssueVisible] = useState(false);

  const [updateText, setUpdateText] = useState('');

  const [issueType, setIssueType] = useState('');
  const [issueDesc, setIssueDesc] = useState('');

  const statuses = [
    {
      key: 'ASSIGNED',
      label: 'Assigned',
      sub: 'Ready for pickup',
    },
    {
      key: 'ON_WAY',
      label: 'On the Way',
      sub: 'Navigating to donor',
    },
    {
      key: 'ARRIVED',
      label: 'Arrived',
      sub: 'At pickup location',
    },
    {
      key: 'COLLECTED',
      label: 'Collected',
      sub: 'Food secured',
    },
    {
      key: 'DELIVERED',
      label: 'Delivered',
      sub: 'Completed',
    },
  ];

  const currentIdx = statuses.findIndex(
    (status) => status.key === pickupStatus
  );

  const handleStagePress = (idx: number, key: string) => {
    // Keep the existing logical progression.
    if (idx > currentIdx + 1) {
      Alert.alert(
        'Action not allowed',
        'Please complete the previous steps first.'
      );
      return;
    }

    setPickupStatus(key as any);
  };

  const handleAddUpdate = () => {
    if (!updateText.trim()) return;

    addActivity({
      icon: 'message',
      title: 'Pickup Update',
      description: updateText,
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
      status: pickupStatus,
    });

    addNotification({
      type: 'update',
      title: 'Pickup update added',
      description: `You added a new update: "${updateText}"`,
      time: 'Just now',
      read: false,
      navigateTo: '/volunteer/collection-status',
    });

    setUpdateText('');

    Alert.alert(
      'Success',
      'Update has been added to your timeline.'
    );
  };

  const handleReport = (option: string) => {
    if (option === 'Other') {
      setOtherIssueVisible(true);
      return;
    }

    addActivity({
      icon: 'alert-triangle',
      title: 'Issue Reported',
      description: option,
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
      status: pickupStatus,
    });

    addNotification({
      type: 'issue',
      title: 'Issue reported',
      description: `A ${option.toLowerCase()} issue was reported.`,
      time: 'Just now',
      read: false,
      navigateTo: '/volunteer/collection-status',
    });

    setReportVisible(false);

    Alert.alert(
      'Issue Reported',
      `Your report for "${option}" has been recorded.`
    );
  };

  const submitOtherIssue = () => {
    if (!issueType.trim() || !issueDesc.trim()) {
      Alert.alert(
        'Validation Error',
        'Please fill in both fields.'
      );
      return;
    }

    addActivity({
      icon: 'alert-triangle',
      title: `Issue: ${issueType}`,
      description: issueDesc,
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
      status: pickupStatus,
    });

    addNotification({
      type: 'issue',
      title: 'New issue reported',
      description: `You reported: ${issueType}`,
      time: 'Just now',
      read: false,
      navigateTo: '/volunteer/collection-status',
    });

    setOtherIssueVisible(false);
    setReportVisible(false);
    setIssueType('');
    setIssueDesc('');

    Alert.alert(
      'Issue Reported',
      'Your custom issue has been recorded.'
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <VolunteerScreenHeader
        title="Collection Status"
        onBack={() => router.back()}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardContainer}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* ─── TIMELINE ─── */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              Pickup Progress
            </Text>

            <View style={styles.timeline}>
              {statuses.map((stage, idx) => {
                const isCompleted = idx < currentIdx;
                const isCurrent = idx === currentIdx;

                return (
                  <TouchableOpacity
                    key={stage.key}
                    style={styles.stageRow}
                    onPress={() =>
                      handleStagePress(idx, stage.key)
                    }
                    activeOpacity={0.7}
                  >
                    <View style={styles.stageLeft}>
                      {idx !== 0 && (
                        <View
                          style={[
                            styles.connector,
                            (isCompleted || isCurrent) &&
                              styles.connectorActive,
                          ]}
                        />
                      )}

                      {idx !== statuses.length - 1 && (
                        <View
                          style={[
                            styles.connectorBottom,
                            isCompleted &&
                              styles.connectorActive,
                          ]}
                        />
                      )}

                      <View
                        style={{
                          zIndex: 1,
                          backgroundColor: Colors.surface,
                          paddingVertical: 4,
                        }}
                      >
                        {isCompleted ? (
                          <Icon
                            name="check-circle"
                            size={24}
                            color={Colors.primary}
                          />
                        ) : isCurrent ? (
                          <Icon
                            name="check-circle"
                            size={24}
                            color={Colors.primaryDark}
                          />
                        ) : (
                          <Icon
                            name="x-circle"
                            size={24}
                            color={Colors.border}
                          />
                        )}
                      </View>
                    </View>

                    <View style={styles.stageLabelBox}>
                      <Text
                        style={[
                          styles.stageLabel,
                          isCurrent &&
                            styles.stageLabelActive,
                        ]}
                      >
                        {stage.label}
                      </Text>

                      <Text
                        style={[
                          styles.stageSub,
                          isCompleted &&
                            styles.stageSubCompleted,
                          isCurrent &&
                            styles.stageSubCurrent,
                        ]}
                      >
                        {stage.sub}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* ─── ADD UPDATE ─── */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              Add Update
            </Text>

            <View style={styles.updateBox}>
              <TextInput
                style={styles.updateInput}
                placeholder="Write an update about this pickup..."
                placeholderTextColor={Colors.textMuted}
                multiline
                maxLength={150}
                value={updateText}
                onChangeText={setUpdateText}
              />

              <View style={styles.updateFooter}>
                <Text style={styles.charCount}>
                  {updateText.length} / 150
                </Text>

                <TouchableOpacity
                  style={[
                    styles.smallBtn,
                    !updateText.trim() &&
                      styles.smallBtnDisabled,
                  ]}
                  onPress={handleAddUpdate}
                  disabled={!updateText.trim()}
                >
                  <Text style={styles.smallBtnText}>
                    Add Update
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* ─── MARK AS COLLECTED ─── */}
          <TouchableOpacity
            onPress={() => {
              setPickupStatus('COLLECTED');
              router.push('/volunteer/confirmation');
            }}
            style={styles.markBtn}
            accessibilityRole="button"
          >
            <Icon
              name="package"
              size={19}
              color={Colors.white}
            />

            <Text style={styles.markBtnText}>
              Mark as Collected
            </Text>
          </TouchableOpacity>

          {/* ─── MARK AS DELIVERED ─── */}
          <TouchableOpacity
            onPress={() => {
              setPickupStatus('DELIVERED');
              router.push('/volunteer/confirmation');
            }}
            style={[
              styles.markBtn,
              {
                backgroundColor: '#3B82F6',
                marginTop: -4,
              },
            ]}
            accessibilityRole="button"
          >
            <Icon
              name="check-circle"
              size={19}
              color={Colors.white}
            />

            <Text style={styles.markBtnText}>
              Mark as Delivered
            </Text>
          </TouchableOpacity>

          {/* ─── REPORT ISSUE ─── */}
          <TouchableOpacity
            onPress={() => setReportVisible(true)}
            style={styles.reportBtn}
            accessibilityRole="button"
            accessibilityLabel="Report Issue"
          >
            <Icon
              name="alert-triangle"
              size={17}
              color={Colors.danger}
            />

            <Text style={styles.reportBtnText}>
              Report Issue
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* ─── REPORT ISSUE MODAL ─── */}
      <Modal
        visible={reportVisible}
        transparent
        animationType="slide"
        onRequestClose={() => {
          setReportVisible(false);
          setOtherIssueVisible(false);
        }}
      >
        <View style={modal.overlay}>
          <View style={modal.sheet}>
            <View style={modal.handle} />

            {!otherIssueVisible ? (
              <>
                <Text style={modal.title}>
                  Report an Issue
                </Text>

                <Text style={modal.subtitle}>
                  Select the issue you're experiencing:
                </Text>

                {REPORT_OPTIONS.map((option) => (
                  <TouchableOpacity
                    key={option}
                    onPress={() => handleReport(option)}
                    style={modal.optionRow}
                  >
                    <View style={modal.optionDot} />

                    <Text style={modal.optionText}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}

                <TouchableOpacity
                  onPress={() => setReportVisible(false)}
                  style={modal.cancelBtn}
                >
                  <Text style={modal.cancelText}>
                    Cancel
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={modal.title}>
                  Custom Issue
                </Text>

                <Text style={modal.subtitle}>
                  Please describe the problem
                </Text>

                <Text style={modal.inputLabel}>
                  Issue Type
                </Text>

                <TextInput
                  style={modal.textInput}
                  placeholder="e.g. Packaging problem"
                  placeholderTextColor={Colors.textMuted}
                  value={issueType}
                  onChangeText={setIssueType}
                />

                <Text style={modal.inputLabel}>
                  Description
                </Text>

                <TextInput
                  style={[
                    modal.textInput,
                    {
                      height: 80,
                      textAlignVertical: 'top',
                    },
                  ]}
                  placeholder="Describe the issue..."
                  placeholderTextColor={Colors.textMuted}
                  multiline
                  value={issueDesc}
                  onChangeText={setIssueDesc}
                />

                <View style={modal.btnRow}>
                  <TouchableOpacity
                    onPress={() =>
                      setOtherIssueVisible(false)
                    }
                    style={[
                      modal.cancelBtn,
                      {
                        flex: 1,
                        marginTop: 0,
                      },
                    ]}
                  >
                    <Text style={modal.cancelText}>
                      Back
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={submitOtherIssue}
                    style={[
                      modal.submitBtn,
                      {
                        flex: 1,
                      },
                    ]}
                  >
                    <Text style={modal.submitText}>
                      Send Issue
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const modal = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.40)',
  },

  sheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    gap: 14,
    paddingBottom: 36,
  },

  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
    alignSelf: 'center',
    marginBottom: 8,
  },

  title: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
  },

  subtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
  },

  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },

  optionDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },

  optionText: {
    fontSize: 15,
    color: Colors.textPrimary,
    fontWeight: '500',
  },

  cancelBtn: {
    marginTop: 4,
    paddingVertical: 13,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },

  cancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },

  submitBtn: {
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: Colors.primaryDark,
    alignItems: 'center',
  },

  submitText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.white,
  },

  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginTop: 4,
  },

  textInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: Colors.textPrimary,
    backgroundColor: Colors.background,
  },

  btnRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
});

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  keyboardContainer: {
    flex: 1,
  },

  content: {
    padding: 20,
    gap: 14,
    paddingBottom: 32,
  },

  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
  },

  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 14,
  },

  timeline: {
    gap: 0,
  },

  stageRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    minHeight: 52,
  },

  stageLeft: {
    width: 32,
    alignItems: 'center',
    position: 'relative',
  },

  connector: {
    position: 'absolute',
    top: 0,
    left: '50%',
    marginLeft: -1,
    width: 2,
    height: 14,
    backgroundColor: Colors.border,
    zIndex: 0,
  },

  connectorBottom: {
    position: 'absolute',
    bottom: 0,
    left: '50%',
    marginLeft: -1,
    width: 2,
    height: 14,
    backgroundColor: Colors.border,
    zIndex: 0,
  },

  connectorActive: {
    backgroundColor: Colors.primaryDark,
  },

  stageLabelBox: {
    flex: 1,
    paddingLeft: 12,
    justifyContent: 'center',
    paddingVertical: 12,
  },

  stageLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },

  stageLabelActive: {
    color: Colors.textPrimary,
    fontWeight: '700',
  },

  stageSub: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },

  stageSubCompleted: {
    color: Colors.primary,
  },

  stageSubCurrent: {
    color: Colors.primaryDark,
    fontWeight: '600',
  },

  updateBox: {
    backgroundColor: Colors.background,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 12,
    minHeight: 100,
  },

  updateInput: {
    flex: 1,
    fontSize: 13,
    color: Colors.textPrimary,
    lineHeight: 19,
    minHeight: 50,
    textAlignVertical: 'top',
  },

  updateFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 10,
  },

  charCount: {
    fontSize: 11,
    color: Colors.textMuted,
  },

  smallBtn: {
    backgroundColor: Colors.primaryDark,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },

  smallBtnDisabled: {
    backgroundColor: Colors.textMuted,
  },

  smallBtnText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '600',
  },

  markBtn: {
    backgroundColor: Colors.primaryDark,
    borderRadius: 14,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
  },

  markBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.white,
  },

  reportBtn: {
    borderRadius: 14,
    paddingVertical: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    borderWidth: 1,
    borderColor: '#FECACA',
    backgroundColor: '#FFF5F5',
  },

  reportBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.danger,
  },
});