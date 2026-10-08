import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from '@/components/ui/Icon';
import { donations } from '@/constants/donations';

// ---------- Colour palette (same as other screens) ----------
const C = {
  gradientTop: '#2FB584',
  gradientBottom: '#14855A',
  primary: '#1E9E6A',
  primaryDark: '#14855A',
  tint: '#E3F4EA',
  bg: '#F2F6F4',
  card: '#FFFFFF',
  border: '#E6ECE8',
  text: '#1B2B24',
  muted: '#8A9A93',
  pending: '#C9D3CE',
  white: '#FFFFFF',
};

const timeNow = () => {
  const d = new Date();
  let h = d.getHours();
  const m = d.getMinutes().toString().padStart(2, '0');
  const ap = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `Today, ${h}:${m} ${ap}`;
};

export default function ActiveCollection() {
  const { id, volunteer } = useLocalSearchParams<{ id?: string; volunteer?: string }>();
  const donation = donations.find((d) => d.id === id) ?? donations[0];
  const volunteerName = volunteer || 'Ayesha Perera';
  const initials = volunteerName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  // stage: 0 Assigned, 1 Picked up, 2 In transit, 3 Completed
  const [stage, setStage] = useState(2);
  const [times, setTimes] = useState<string[]>(['Today, 9:30 AM', 'Today, 11:30 AM', '', '']);
  const [note, setNote] = useState('');

  const steps = [
    { title: 'Assigned' },
    { title: 'Picked up' },
    { title: 'In transit' },
    { title: 'Completed' },
  ];

  const finished = stage >= 3;

  const handleUpdate = () => {
    if (finished) {
      router.dismissTo('/ngo/dashboard' as any);
      return;
    }
    // TODO: call your API here with `note`
    setTimes((t) => {
      const copy = [...t];
      copy[stage] = copy[stage] || timeNow();
      return copy;
    });
    setStage(stage + 1);
  };

  const subtitle = (i: number) => {
    if (i < stage) return times[i] || 'Done';
    if (i === stage) return i === 3 ? timeNow() : 'In progress';
    return 'Pending';
  };

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingBottom: 130 }}
          >
            {/* ================= TOP BAR ================= */}
            <View style={styles.topBar}>
              <TouchableOpacity style={styles.backRow} onPress={() => router.back()} hitSlop={10}>
                <Text style={styles.backText}>‹ BACK</Text>
              </TouchableOpacity>
              <Text style={styles.topTitle}>Active Collection</Text>
              <View style={styles.backRow} />
            </View>

            {/* ================= SUMMARY CARD ================= */}
            <View style={[styles.card, styles.summary]}>
              {donation.image ? (
                <Image source={donation.image} style={styles.thumb} />
              ) : (
                <View style={[styles.thumb, styles.thumbPlaceholder]}>
                  <Text style={{ fontSize: 30 }}>{donation.emoji}</Text>
                </View>
              )}

              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.summaryTitle} numberOfLines={1}>
                  {donation.title} · {donation.quantity}
                </Text>
                <Text style={styles.summarySub}>Volunteer: {volunteerName}</Text>
              </View>

              <LinearGradient colors={[C.gradientTop, C.gradientBottom]} style={styles.volAvatar}>
                <Text style={styles.volAvatarText}>{initials}</Text>
              </LinearGradient>
            </View>

            {/* ================= MAP ================= */}
            <View style={[styles.card, styles.mapCard]}>
              <View style={styles.mapBg}>
                {/* roads */}
                <View style={[styles.road, { top: 28, left: 0, right: 0, height: 10 }]} />
                <View style={[styles.road, { top: 96, left: 0, right: 0, height: 8 }]} />
                <View style={[styles.road, { left: '22%', top: 0, bottom: 0, width: 10 }]} />
                <View style={[styles.road, { left: '72%', top: 0, bottom: 0, width: 8 }]} />
                {/* water + parks */}
                <View style={[styles.water, { left: 0, bottom: 0, width: 70, height: 36 }]} />
                <View style={[styles.park, { top: 50, left: '56%', width: 60, height: 30 }]} />

                {/* route: solid part (bottom to arrow) */}
                <View style={styles.routeSolidV} />
                <View style={styles.routeSolidH} />

                {/* route: dotted part (arrow to home) */}
                <View style={styles.dotsRow}>
                  {Array.from({ length: 9 }).map((_, i) => (
                    <View key={i} style={styles.dot} />
                  ))}
                </View>

                {/* current position arrow */}
                <View style={styles.arrowPos}>
                  <View style={styles.arrowOuter}>
                    <Text style={styles.arrowText}>▲</Text>
                  </View>
                </View>

                {/* destination (home) */}
                <View style={styles.homePos}>
                  <View style={styles.homeOuter}>
                    <View style={styles.homeInner}>
                      <Text style={styles.homeText}>⌂</Text>
                    </View>
                  </View>
                </View>
              </View>

              <View style={styles.eta}>
                <Icon name="clock" size={13} color={C.primaryDark} />
                <Text style={styles.etaText}>{finished ? 'Collected' : 'Arriving in 12 min'}</Text>
              </View>
            </View>

            {/* ================= PROGRESS ================= */}
            <View style={[styles.card, styles.progressCard]}>
              <Text style={styles.progressTitle}>Collection Progress</Text>

              {steps.map((s, i) => {
                const done = i < stage || (i === 3 && finished);
                const current = i === stage && !done;
                const last = i === steps.length - 1;
                return (
                  <View key={s.title} style={styles.stepRow}>
                    {/* indicator column */}
                    <View style={styles.indCol}>
                      <View
                        style={[
                          styles.circle,
                          done && styles.circleDone,
                          current && styles.circleCurrent,
                          !done && !current && styles.circlePending,
                        ]}
                      >
                        {done && <Text style={styles.tick}>✓</Text>}
                        {current && <View style={styles.currentDot} />}
                      </View>
                      {!last && <View style={[styles.line, i < stage && styles.lineDone]} />}
                    </View>

                    {/* text */}
                    <View style={styles.stepText}>
                      <Text style={[styles.stepTitle, !done && !current && { color: C.muted }]}>{s.title}</Text>
                      <Text
                        style={[
                          styles.stepSub,
                          current && { color: C.primary, fontWeight: '700' },
                        ]}
                      >
                        {subtitle(i)}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>

            {/* ================= NOTES ================= */}
            <Text style={styles.notesLabel}>Notes</Text>
            <View style={[styles.card, styles.notesBox]}>
              <Icon name="info" size={16} color={C.muted} />
              <TextInput
                value={note}
                onChangeText={setNote}
                placeholder="Add a note about this collection..."
                placeholderTextColor={C.muted}
                style={styles.notesInput}
                multiline
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        {/* ================= BOTTOM BUTTON ================= */}
        <SafeAreaView edges={['bottom']} style={styles.actionBar}>
          <TouchableOpacity activeOpacity={0.85} onPress={handleUpdate}>
            <LinearGradient
              colors={[C.gradientTop, C.gradientBottom]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.updateBtn}
            >
              <Text style={styles.updateTick}>✓</Text>
              <Text style={styles.updateText}>{finished ? 'Back to Dashboard' : 'Update Status'}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </SafeAreaView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },

  // Top bar
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backRow: { width: 90, paddingHorizontal: 20, paddingVertical: 14 },
  backText: { fontSize: 13, fontWeight: '800', color: C.primary, letterSpacing: 0.5 },
  topTitle: { fontSize: 17, fontWeight: '800', color: C.text, textAlign: 'center' },

  // Shared card
  card: {
    backgroundColor: C.card,
    borderRadius: 18,
    shadowColor: '#0B3D2A',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  // Summary
  summary: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginTop: 4, padding: 12 },
  thumb: { width: 56, height: 56, borderRadius: 14 },
  thumbPlaceholder: { backgroundColor: C.tint, alignItems: 'center', justifyContent: 'center' },
  summaryTitle: { fontSize: 15, fontWeight: '800', color: C.text },
  summarySub: { fontSize: 12, color: C.muted, marginTop: 3 },
  volAvatar: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  volAvatarText: { fontSize: 13, fontWeight: '800', color: C.white },

  // Map
  mapCard: { marginHorizontal: 16, marginTop: 14, height: 150, overflow: 'hidden' },
  mapBg: { flex: 1, backgroundColor: '#E4EEE8' },
  road: { position: 'absolute', backgroundColor: '#FFFFFF' },
  water: { position: 'absolute', backgroundColor: '#CFE3EE', borderTopRightRadius: 30 },
  park: { position: 'absolute', backgroundColor: '#CFE6D6', borderRadius: 8 },
  routeSolidV: {
    position: 'absolute',
    left: '30%',
    top: 92,
    bottom: 0,
    width: 4,
    marginLeft: -2,
    backgroundColor: C.primaryDark,
    borderRadius: 2,
  },
  routeSolidH: {
    position: 'absolute',
    left: '30%',
    top: 88,
    width: '10%',
    height: 4,
    backgroundColor: C.primaryDark,
    borderRadius: 2,
  },
  dotsRow: {
    position: 'absolute',
    left: '42%',
    right: '16%',
    top: 88,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dot: { width: 5, height: 5, borderRadius: 3, backgroundColor: C.primaryDark },
  arrowPos: { position: 'absolute', left: '40%', top: 90, marginLeft: -16, marginTop: -16 },
  arrowOuter: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: C.white,
    borderWidth: 2.5,
    borderColor: C.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowText: { fontSize: 12, color: C.primaryDark },
  homePos: { position: 'absolute', right: '10%', top: 90, marginTop: -22 },
  homeOuter: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(30,158,106,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeInner: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: C.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeText: { fontSize: 14, color: C.white, lineHeight: 17 },
  eta: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: C.white,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
    elevation: 3,
  },
  etaText: { fontSize: 12, fontWeight: '700', color: C.text },

  // Progress
  progressCard: { marginHorizontal: 16, marginTop: 14, padding: 16 },
  progressTitle: { fontSize: 16, fontWeight: '800', color: C.text, marginBottom: 14 },
  stepRow: { flexDirection: 'row', minHeight: 56 },
  indCol: { width: 28, alignItems: 'center' },
  circle: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  circleDone: { backgroundColor: C.primary },
  circleCurrent: { backgroundColor: C.white, borderWidth: 3, borderColor: C.primary },
  circlePending: { backgroundColor: C.white, borderWidth: 2, borderColor: C.pending },
  tick: { fontSize: 13, fontWeight: '900', color: C.white, lineHeight: 16 },
  currentDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: C.primary },
  line: { flex: 1, width: 3, backgroundColor: C.pending, marginVertical: 2, borderRadius: 2 },
  lineDone: { backgroundColor: C.primary },
  stepText: { marginLeft: 12, paddingTop: 1 },
  stepTitle: { fontSize: 15, fontWeight: '800', color: C.text },
  stepSub: { fontSize: 12, color: C.muted, marginTop: 2 },

  // Notes
  notesLabel: { fontSize: 15, fontWeight: '800', color: C.text, marginHorizontal: 20, marginTop: 18, marginBottom: 8 },
  notesBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 16,
    paddingHorizontal: 14,
    minHeight: 50,
    borderRadius: 14,
  },
  notesInput: { flex: 1, fontSize: 13, color: C.text, paddingVertical: 12, maxHeight: 90 },

  // Bottom bar
  actionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: C.card,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 16,
    paddingTop: 16,
    shadowColor: '#0B3D2A',
    shadowOpacity: 0.1,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: -3 },
    elevation: 12,
  },
  updateBtn: {
    height: 54,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 8,
  },
  updateTick: { fontSize: 16, fontWeight: '900', color: C.white },
  updateText: { fontSize: 15, fontWeight: '800', color: C.white },
});