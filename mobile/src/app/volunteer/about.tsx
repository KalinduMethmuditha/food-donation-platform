import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from '@/components/ui/Icon';
import { Colors } from '@/constants/colors';
import VolunteerScreenHeader from '@/components/volunteer/VolunteerScreenHeader';

export default function AboutScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <VolunteerScreenHeader
        title="About"
        onBack={() => router.back()}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* App Logo Section */}
        <View style={styles.logoSection}>
          <View style={styles.logoCircle}>
            <Icon name="leaf" size={34} color="#FFFFFF" />
          </View>

          <Text style={styles.appName}>
            Food Donation Platform
          </Text>

          <Text style={styles.appSubtitle}>
            Volunteer App
          </Text>

          <View style={styles.versionBadge}>
            <Text style={styles.versionText}>
              Version 1.0.0
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* About This App */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardIconWrap}>
              <Icon
                name="info"
                size={18}
                color="#10B981"
              />
            </View>

            <Text style={styles.cardTitle}>
              About This App
            </Text>
          </View>

          <Text style={styles.cardBody}>
            The Food Donation Platform connects volunteers
            with food donors to reduce food waste and help
            those in need. As a volunteer, you can accept
            pickup requests, navigate to donors, collect
            food packages, and ensure deliveries reach
            communities in need.
          </Text>
        </View>

        {/* Our Mission */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardIconWrap}>
              <Icon
                name="heart"
                size={18}
                color="#10B981"
              />
            </View>

            <Text style={styles.cardTitle}>
              Our Mission
            </Text>
          </View>

          <Text style={styles.cardBody}>
            Zero food waste. Every meal matters. We believe
            that food waste is a solvable problem when
            communities come together.
          </Text>
        </View>

        {/* Legal Links */}
        <View style={styles.card}>
          <View style={styles.legalRow}>
            <View style={styles.legalLeft}>
              <Icon
                name="info"
                size={16}
                color="#6B7280"
              />

              <Text style={styles.legalLabel}>
                Terms of Service
              </Text>
            </View>

            <Text style={styles.legalAction}>
              View Terms
            </Text>
          </View>

          <View style={styles.legalDivider} />

          <View style={styles.legalRow}>
            <View style={styles.legalLeft}>
              <Icon
                name="check"
                size={16}
                color="#6B7280"
              />

              <Text style={styles.legalLabel}>
                Privacy Policy
              </Text>
            </View>

            <Text style={styles.legalAction}>
              View Privacy
            </Text>
          </View>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          © 2026 Food Donation Platform. All rights reserved.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F9F8',
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },

  /* Logo Section */
  logoSection: {
    alignItems: 'center',
    paddingVertical: 32,
  },

  logoCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#10B981',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 16,
  },

  appName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#17221D',
    letterSpacing: 0.2,
    textAlign: 'center',
  },

  appSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
  },

  versionBadge: {
    marginTop: 10,
    backgroundColor: '#DDF7EC',
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 20,
  },

  versionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#059669',
  },

  /* Divider */
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginBottom: 20,
  },

  /* Card */
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  cardIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: '#F0FCF6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#17221D',
  },

  cardBody: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 22,
  },

  /* Legal Rows */
  legalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },

  legalLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  legalLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#17221D',
  },

  legalAction: {
    fontSize: 13,
    fontWeight: '600',
    color: '#10B981',
  },

  legalDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 8,
  },

  /* Footer */
  footer: {
    textAlign: 'center',
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 10,
    marginBottom: 4,
  },
});