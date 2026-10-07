import { router } from 'expo-router';
<<<<<<< Updated upstream
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';
=======
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, Modal, Image, Platform } from 'react-native';
>>>>>>> Stashed changes
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import Icon from '@/components/ui/Icon';
import { Colors } from '@/constants/colors';
import VolunteerScreenHeader from '@/components/volunteer/VolunteerScreenHeader';
import { useVolunteerStore } from '@/store/volunteerStore';

export default function EditProfileScreen() {
  const { profile, updateProfile } = useVolunteerStore();
  
  const [name, setName] = useState(profile.fullName);
  const [phone, setPhone] = useState(profile.phone);
  const [email, setEmail] = useState(profile.email);
  const [location, setLocation] = useState(profile.location);
<<<<<<< Updated upstream

  const getInitials = (n: string) => n.split(' ').map(x => x[0]).join('').substring(0, 2);
=======
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl);
  
  const [avatarModalVisible, setAvatarModalVisible] = useState(false);

  const getInitials = (n: string) => n.split(' ').map(x => x[0]).join('').substring(0, 2).toUpperCase();

  const handlePickImage = () => {
    if (Platform.OS === 'web') {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (e: any) => {
        const file = e.target.files?.[0];
        if (file) {
          const blobUrl = URL.createObjectURL(file);
          setAvatarUrl(blobUrl);
          setAvatarModalVisible(false);
        }
      };
      input.click();
    } else {
      Alert.alert('Not Supported', 'Please run on web to select local files without native plugins.');
    }
  };
>>>>>>> Stashed changes

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Validation Error', 'Full Name is required.');
      return;
    }
<<<<<<< Updated upstream
    if (!phone.trim()) {
      Alert.alert('Validation Error', 'Phone Number is required.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      Alert.alert('Validation Error', 'A valid Email is required.');
      return;
    }
=======
>>>>>>> Stashed changes
    
    updateProfile({
      fullName: name,
      phone,
      email,
      location,
<<<<<<< Updated upstream
=======
      avatarUrl,
>>>>>>> Stashed changes
    });
    
    Alert.alert('Profile Updated', 'Your profile information has been updated successfully.', [
      { text: 'OK', onPress: () => router.back() }
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <VolunteerScreenHeader title="Edit Profile" onBack={() => router.back()} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Photo Edit */}
        <View style={styles.photoSection}>
          <View style={styles.avatar}>
<<<<<<< Updated upstream
            <Text style={styles.avatarText}>{getInitials(name || 'Volunteer')}</Text>
          </View>
          <TouchableOpacity style={styles.editPhotoBtn}>
=======
            {avatarUrl ? (
              <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
            ) : (
              <Text style={styles.avatarText}>{getInitials(name || 'Volunteer')}</Text>
            )}
          </View>
          <TouchableOpacity style={styles.editPhotoBtn} onPress={() => setAvatarModalVisible(true)}>
>>>>>>> Stashed changes
            <Icon name="person" size={16} color={Colors.white} />
            <Text style={styles.editPhotoText}>Change Photo</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formCard}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Volunteer ID</Text>
            <TextInput
              style={[styles.input, styles.inputDisabled]}
              value={profile.volunteerId}
              editable={false}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name *</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter your full name"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number *</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              placeholder="+94 7X XXX XXXX"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address *</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="your.email@example.com"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Location</Text>
            <TextInput
              style={styles.input}
              value={location}
              onChangeText={setLocation}
              placeholder="City, Country"
            />
          </View>
        </View>

      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.cancelBtn} onPress={() => router.back()}>
          <Text style={styles.cancelBtnText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>Save Changes</Text>
        </TouchableOpacity>
      </View>
<<<<<<< Updated upstream
=======

      {/* Avatar Selection Modal */}
      <Modal visible={avatarModalVisible} transparent animationType="slide" onRequestClose={() => setAvatarModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Profile Photo</Text>
            
            <View style={styles.avatarActions}>
              <TouchableOpacity style={styles.actionBtn} onPress={handlePickImage}>
                <Icon name="person" size={20} color={Colors.primaryDark} />
                <Text style={styles.actionBtnText}>Upload from Device</Text>
              </TouchableOpacity>
              
              {avatarUrl ? (
                <TouchableOpacity 
                  style={[styles.actionBtn, styles.actionBtnDanger]}
                  onPress={() => {
                    setAvatarUrl(null);
                    setAvatarModalVisible(false);
                  }}
                >
                  <Icon name="trash" size={20} color={Colors.danger} />
                  <Text style={[styles.actionBtnText, { color: Colors.danger }]}>Remove Photo</Text>
                </TouchableOpacity>
              ) : null}
            </View>

            <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setAvatarModalVisible(false)}>
              <Text style={styles.modalCloseBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
>>>>>>> Stashed changes
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16, paddingBottom: 40 },

  photoSection: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
<<<<<<< Updated upstream
=======
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
>>>>>>> Stashed changes
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.white,
  },
  editPhotoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 8,
  },
  editPhotoText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: 14,
  },

  formCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    gap: 16,
  },
  inputGroup: { gap: 6 },
  label: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary },
  input: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    color: Colors.textPrimary,
  },
  inputDisabled: {
    backgroundColor: '#F3F4F6',
    color: Colors.textMuted,
  },

  bottomBar: {
    flexDirection: 'row',
    padding: 16,
    paddingBottom: 24,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  cancelBtnText: { fontSize: 15, fontWeight: '600', color: Colors.textPrimary },
  saveBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: Colors.primaryDark,
    alignItems: 'center',
  },
  saveBtnText: { fontSize: 15, fontWeight: '700', color: Colors.white },
<<<<<<< Updated upstream
});
=======

  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.45)' },
  modalSheet: { backgroundColor: Colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
  modalHandle: { width: 36, height: 4, borderRadius: 2, backgroundColor: Colors.border, alignSelf: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 18, fontWeight: '800', color: Colors.textPrimary, marginBottom: 20, textAlign: 'center' },
  avatarActions: { gap: 12, marginBottom: 24 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.primaryWash, padding: 16, borderRadius: 12, gap: 12 },
  actionBtnDanger: { backgroundColor: '#FEF2F2' },
  actionBtnText: { fontSize: 16, fontWeight: '600', color: Colors.primaryDark },
  modalCloseBtn: { paddingVertical: 14, borderRadius: 12, borderWidth: 1, borderColor: Colors.border, alignItems: 'center', backgroundColor: Colors.background },
  modalCloseBtnText: { fontSize: 15, fontWeight: '600', color: Colors.textPrimary },
});

>>>>>>> Stashed changes
