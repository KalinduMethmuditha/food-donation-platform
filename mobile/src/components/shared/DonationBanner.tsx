import { Image, StyleSheet } from 'react-native';

export default function DonationBanner() {
  return <Image source={require('../../../assets/images/donation-banner.jpg')}
    accessibilityLabel="Food donation" style={styles.image} resizeMode="cover" />;
}

const styles = StyleSheet.create({ image: { width: '100%', height: 132, borderRadius: 20, marginBottom: 16 } });
