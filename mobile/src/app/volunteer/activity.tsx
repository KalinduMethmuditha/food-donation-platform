import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from '@/components/ui/Icon';
import { Colors } from '@/constants/colors';
import VolunteerScreenHeader from '@/components/volunteer/VolunteerScreenHeader';
import { useVolunteerStore } from '@/store/volunteerStore';

export default function ActivityScreen() {
  const { activities } = useVolunteerStore();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <VolunteerScreenHeader title="Activity" onBack={() => router.back()} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          {activities.map((activity, index) => (
            <View key={activity.id} style={styles.timelineRow}>
              {/* Connector line */}
              <View style={styles.timelineLeft}>
                {index !== activities.length - 1 && <View style={styles.connector} />}
                <View style={[
                  styles.iconBox,
                  activity.status === 'ISSUE' && styles.iconBoxDanger,
                  activity.status === 'INFO' && styles.iconBoxInfo
                ]}>
                  <Icon 
                    name={activity.icon} 
                    size={16} 
                    color={
                      activity.status === 'ISSUE' ? Colors.danger : 
                      activity.status === 'INFO' ? Colors.primary : 
                      Colors.primaryDark
                    } 
                  />
                </View>
              </View>

              {/* Content */}
              <View style={styles.timelineContent}>
                <View style={styles.titleRow}>
                  <Text style={styles.title}>{activity.title}</Text>
                  <Text style={styles.time}>{activity.time}</Text>
                </View>
                <Text style={styles.desc}>{activity.description}</Text>
                {activity.status !== 'INFO' && activity.status !== 'ISSUE' && (
                  <View style={styles.statusTag}>
                    <Text style={styles.statusTagText}>{activity.status}</Text>
                  </View>
                )}
              </View>
            </View>
          ))}
          
          {activities.length === 0 && (
            <Text style={styles.emptyText}>No activity recorded yet.</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 20, paddingBottom: 32 },

  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 20,
    paddingBottom: 0,
  },
  
  timelineRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  timelineLeft: {
    width: 32,
    alignItems: 'center',
    marginRight: 12,
  },
  connector: {
    position: 'absolute',
    top: 32,
    bottom: -20,
    width: 2,
    backgroundColor: Colors.border,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primaryWash,
    borderWidth: 1,
    borderColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  iconBoxDanger: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  iconBoxInfo: {
    backgroundColor: '#EFF6FF',
    borderColor: '#DBEAFE',
  },
  timelineContent: {
    flex: 1,
    paddingTop: 4,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  time: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  desc: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 8,
  },
  statusTag: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  emptyText: {
    textAlign: 'center',
    color: Colors.textMuted,
    paddingVertical: 20,
  }
});
