import { router, type Href } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import { Image, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import Screen from '@/components/shared/Screen';
import AppHeader from '@/components/shared/AppHeader';
import FormField from '@/components/ui/FormField';
import Card from '@/components/ui/Card';
import PrimaryButton from '@/components/ui/PrimaryButton';
import SecondaryButton from '@/components/ui/SecondaryButton';
import { Colors } from '@/constants/colors';
import { getAccountProfile, updateAccountProfile, uploadProfilePhoto, removeProfilePhoto } from '@/services/account';
import { getAccountErrorMessage } from '@/services/apiErrors';
import type { UserRole } from '@/services/auth';
import { useAccountStore } from '@/store/account.store';

export default function AccountEditProfileScreen({ role }: { role: UserRole }) {
  const user = useAccountStore((state) => state.user);
  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [location, setLocation] = useState(user?.location ?? '');
  const [loading, setLoading] = useState(!user);
  const [saving, setSaving] = useState(false);
  const [photoSaving, setPhotoSaving] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    if (useAccountStore.getState().user) return;
    let active = true;
    const controller = new AbortController();
    void getAccountProfile(controller.signal).then(({ user: loaded }) => {
      if (active) { setName(loaded.name); setEmail(loaded.email); setPhone(loaded.phone ?? ''); setLocation(loaded.location ?? ''); }
    }).catch((cause) => { if (active) setError(getAccountErrorMessage(cause)); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; controller.abort(); };
  }, []);
  const goBack = () => router.replace(`/${role}/profile` as Href);
  const pickPhoto = async () => {
    if (saving || photoSaving) return;
    setError('');
    try {
      const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: Platform.OS !== 'web', aspect: [1, 1], quality: 0.8 });
      if (result.canceled) return;
      const asset = result.assets[0];
      if (asset.fileSize && asset.fileSize > 2 * 1024 * 1024) { setError('Choose a JPG, PNG, or WebP photo smaller than 2 MB.'); return; }
      setPhotoSaving(true);
      await uploadProfilePhoto(asset);
    } catch (cause) { setError(getAccountErrorMessage(cause)); }
    finally { setPhotoSaving(false); }
  };
  const removePhoto = async () => {
    setPhotoSaving(true); setError('');
    try { await removeProfilePhoto(); }
    catch (cause) { setError(getAccountErrorMessage(cause)); }
    finally { setPhotoSaving(false); }
  };
  const save = async () => {
    if (saving || photoSaving || loading) return;
    setSaving(true); setError('');
    try { await updateAccountProfile({ name: name.trim(), email: email.trim(), phone: phone.trim(), location: location.trim() }); goBack(); }
    catch (cause) { setError(getAccountErrorMessage(cause)); }
    finally { setSaving(false); }
  };
  return <Screen keyboardAvoiding>
    <AppHeader title="Edit Profile" showBack onBackPress={goBack} />
    <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <View style={styles.photoSection}><View style={styles.avatar}>
        {user?.avatar_url ? <Image source={{ uri: user.avatar_url }} style={styles.image} /> : <Text style={styles.initials}>{name.trim().split(/\s+/).map((part) => part[0] ?? '').slice(0, 2).join('').toUpperCase()}</Text>}
      </View><Text style={styles.hint}>JPG, PNG or WebP · Maximum 2 MB</Text>
        <PrimaryButton title="Upload Profile Photo" disabled={saving || loading} loading={photoSaving} onPress={() => void pickPhoto()} />
        {user?.avatar_url ? <SecondaryButton title="Remove Photo" disabled={photoSaving || saving} onPress={() => void removePhoto()} /> : null}
        <Text style={styles.hint}>Photo changes are saved immediately.</Text>
      </View>
      <Card style={styles.form}>
        <FormField label="Full Name" accessibilityLabel="Full Name" value={name} onChangeText={setName} />
        <FormField label="Email Address" accessibilityLabel="Email Address" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        <FormField label="Phone Number" accessibilityLabel="Phone Number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
        <FormField label="Location" accessibilityLabel="Location" value={location} onChangeText={setLocation} />
      </Card>
      {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
      <PrimaryButton title="Save Changes" loading={saving} disabled={photoSaving || loading || !name.trim() || !email.trim()} onPress={() => void save()} />
      <SecondaryButton title="Cancel" disabled={saving || photoSaving} onPress={goBack} />
    </ScrollView>
  </Screen>;
}
const styles = StyleSheet.create({
  content: { padding: 16, gap: 16, paddingBottom: 32 }, photoSection: { alignItems: 'center', gap: 12, paddingVertical: 12 },
  avatar: { width: 96, height: 96, borderRadius: 48, overflow: 'hidden', backgroundColor: Colors.primaryDark, alignItems: 'center', justifyContent: 'center' },
  image: { width: '100%', height: '100%' }, initials: { fontSize: 30, fontWeight: '800', color: Colors.white },
  hint: { fontSize: 12, color: Colors.textSecondary, textAlign: 'center' }, form: { gap: 16 }, error: { color: Colors.danger, fontSize: 13 },
});
