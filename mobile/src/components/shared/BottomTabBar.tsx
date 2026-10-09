import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon, { type IconName } from '@/components/ui/Icon';
import { Colors } from '@/constants/colors';

export type BottomTab = { id: string; label: string; icon: IconName; onPress: () => void };

export default function BottomTabBar({ tabs, activeTab }: { tabs: BottomTab[]; activeTab: string }) {
  return (
    <SafeAreaView edges={['bottom']} style={styles.wrap}>
      <View style={styles.bar}>
        {tabs.map((tab) => {
          const active = activeTab === tab.id;
          return (
            <Pressable key={tab.id} accessibilityRole="tab" accessibilityLabel={tab.label}
              accessibilityState={{ selected: active }} onPress={tab.onPress} style={styles.tab}>
              <View style={[styles.icon, active && styles.activeIcon]}>
                <Icon name={tab.icon} size={20} color={active ? Colors.primaryDark : Colors.textMuted} />
              </View>
              <Text style={[styles.label, active && styles.activeLabel]}>{tab.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: 12, paddingTop: 6, backgroundColor: Colors.background },
  bar: { flexDirection: 'row', backgroundColor: Colors.surface, borderRadius: 26,
    paddingVertical: 8, marginBottom: 6, boxShadow: '0 -2px 14px rgba(11,61,42,0.12)' },
  tab: { flex: 1, alignItems: 'center', minHeight: 48 },
  icon: { width: 50, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  activeIcon: { backgroundColor: Colors.primaryLight },
  label: { fontSize: 10, fontWeight: '600', color: Colors.textMuted, marginTop: 3 },
  activeLabel: { color: Colors.primaryDark },
});
