import { router } from 'expo-router';
import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import StatCard from '@/components/shared/StatCard';
import ActivityItem from '@/components/shared/ActivityItem';
import Screen from '@/components/shared/Screen';
import Card from '@/components/ui/Card';
import Icon from '@/components/ui/Icon';
import PrimaryButton from '@/components/ui/PrimaryButton';
import SecondaryButton from '@/components/ui/SecondaryButton';
import StatusBadge from '@/components/ui/StatusBadge';
import { Colors } from '@/constants/colors';
import type { RoleDashboardData } from '@/data/mockRoleDashboards';

export default function RoleDashboardShell({ data }: { data: RoleDashboardData }) {
  const [dialog, setDialog] = useState<'menu' | 'unavailable' | null>(null);

  return <Screen footer={<View style={styles.tabBar}>
    {data.tabs.map((tab, index) => <Pressable key={tab.label} accessibilityRole="tab"
      accessibilityState={{ selected: index === 0 }}
      accessibilityLabel={index === 0 ? tab.label : `${tab.label}, coming soon`}
      onPress={index === 0 ? undefined : () => setDialog('unavailable')}
      style={styles.tab}>
      <Icon name={tab.icon} size={21} color={index === 0 ? Colors.primaryDark : Colors.textMuted} />
      <Text style={[styles.tabLabel, index === 0 && styles.activeTabLabel]}>{tab.label}</Text>
    </Pressable>)}
  </View>}>
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.hero}>
        <View style={styles.heroCircle} />
        <View style={styles.header}>
          <Pressable onPress={() => setDialog('menu')} accessibilityRole="button" accessibilityLabel="Open menu" style={styles.headerButton}>
            <Icon name="menu" color={Colors.white} />
          </Pressable>
          <Text style={styles.headerTitle}>{data.title}</Text>
          <Pressable onPress={() => setDialog('unavailable')} accessibilityRole="button" accessibilityLabel="Notifications, coming soon" style={styles.headerButton}>
            <Icon name="bell" color={Colors.white} />
          </Pressable>
        </View>
        <View style={styles.welcomeRow}>
          <View style={styles.welcomeCopy}>
            <Text style={styles.welcome}>Welcome back!</Text>
            <Text style={styles.subtitle}>{data.subtitle}</Text>
          </View>
          <View style={styles.heroSymbol}><Icon name={data.heroIcon} size={35} color={Colors.primaryDark} /></View>
        </View>
      </View>

      <View style={styles.main}>
        <View style={styles.actionCard}>
          <Text style={styles.actionTitle}>{data.actionTitle}</Text>
          <Text style={styles.actionDescription}>{data.actionDescription}</Text>
          <PrimaryButton title={data.actionLabel} onPress={() => setDialog('unavailable')} style={styles.actionButton} />
        </View>

        <View style={styles.statsRow}>
          {data.stats.map((stat) => <StatCard key={stat.label} value={stat.value} label={stat.label} />)}
        </View>

        <Text style={styles.sectionTitle}>{data.featuredTitle}</Text>
        <View style={styles.cardList}>
          {data.featured.map((item) => <Card key={item.id}>
            <View style={styles.cardTop}>
              <View style={styles.itemCopy}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemDetail}>{item.detail}</Text>
                {'destination' in item && item.destination ? <Text style={styles.itemDetail}>{item.destination}</Text> : null}
              </View>
              <StatusBadge label={item.status} />
            </View>
            <View style={styles.metaRow}><Icon name="clock" size={15} color={Colors.textSecondary} />
              <Text style={styles.metaText}>{item.extra}</Text></View>
          </Card>)}
        </View>

        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.cardList}>
          {data.activities.map((activity) => <ActivityItem key={activity.id} {...activity} />)}
        </View>
      </View>
    </ScrollView>

    <Modal transparent visible={dialog !== null} animationType="fade" onRequestClose={() => setDialog(null)}>
      <View style={styles.modalBackdrop}>
        <Card style={styles.modalCard}>
          {dialog === 'menu' ? <>
            <Text style={styles.modalTitle}>Menu</Text>
            <Text style={styles.modalDescription}>You’re viewing the {data.title.toLowerCase()} demo.</Text>
            <PrimaryButton title="Switch Role" onPress={() => { setDialog(null); router.replace('/welcome'); }} />
          </> : <>
            <Text style={styles.modalTitle}>Coming soon</Text>
            <Text style={styles.modalDescription}>This feature will be available when this role’s full workflow is built.</Text>
          </>}
          <SecondaryButton title="Close" onPress={() => setDialog(null)} style={styles.closeButton} />
        </Card>
      </View>
    </Modal>
  </Screen>;
}

const styles = StyleSheet.create({
  content: { paddingBottom: 28 },
  hero: { backgroundColor: Colors.primaryDark, paddingHorizontal: 16, paddingTop: 8, paddingBottom: 48, overflow: 'hidden' },
  heroCircle: { position: 'absolute', width: 210, height: 210, right: -75, top: -75, borderRadius: 105, backgroundColor: 'rgba(255,255,255,0.10)' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 48 },
  headerButton: { width: 44, height: 44, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { color: Colors.white, fontSize: 17, fontWeight: '700' },
  welcomeRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 25 },
  welcomeCopy: { flex: 1 },
  welcome: { fontSize: 27, fontWeight: '800', color: Colors.white },
  subtitle: { marginTop: 7, color: Colors.white, opacity: 0.92, fontSize: 13, lineHeight: 20 },
  heroSymbol: { width: 62, height: 62, borderRadius: 31, backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center' },
  main: { paddingHorizontal: 16 },
  actionCard: { marginTop: -28, backgroundColor: Colors.primaryLight, borderRadius: 16, padding: 18 },
  actionTitle: { color: Colors.textPrimary, fontSize: 18, fontWeight: '700' },
  actionDescription: { color: Colors.textSecondary, fontSize: 13, lineHeight: 19, marginTop: 5 },
  actionButton: { marginTop: 16 },
  statsRow: { flexDirection: 'row', gap: 9, marginTop: 18 },
  sectionTitle: { marginTop: 24, marginBottom: 12, color: Colors.textPrimary, fontSize: 17, fontWeight: '700' },
  cardList: { gap: 10 },
  cardTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  itemCopy: { flex: 1 },
  itemName: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  itemDetail: { marginTop: 5, color: Colors.textSecondary, fontSize: 12, lineHeight: 18 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 14 },
  metaText: { fontSize: 12, color: Colors.textSecondary },
  tabBar: { flexDirection: 'row' },
  tab: { flex: 1, minHeight: 49, alignItems: 'center', justifyContent: 'center', gap: 4 },
  tabLabel: { fontSize: 10, color: Colors.textMuted, fontWeight: '600' },
  activeTabLabel: { color: Colors.primaryDark },
  modalBackdrop: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: Colors.overlay },
  modalCard: { width: '100%', maxWidth: 380, alignSelf: 'center', gap: 14 },
  modalTitle: { fontSize: 20, fontWeight: '800', color: Colors.textPrimary },
  modalDescription: { fontSize: 14, lineHeight: 20, color: Colors.textSecondary },
  closeButton: { marginTop: 4 },
});
