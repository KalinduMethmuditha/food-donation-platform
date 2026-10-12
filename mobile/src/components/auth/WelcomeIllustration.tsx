import { StyleSheet, View } from 'react-native';

// Percentage-based shapes keep the illustration sharp on both native and web.
export default function WelcomeIllustration() {
  return (
    <View style={styles.art} accessible accessibilityRole="image" accessibilityLabel="A basket of fresh fruit">
      <View style={styles.largeCircle} />
      <View style={styles.smallCircle} />
      <View style={styles.shadow} />
      <View style={styles.basket}>
        <View style={styles.apple}><View style={styles.appleShine} /></View>
        <View style={styles.stem} />
        <View style={styles.leaf} />
        <View style={styles.purpleFruit} />
        <View style={styles.yellowFruit} />
        <View style={styles.rimBack} />
        <View style={styles.bowl} />
        <View style={styles.rimFront} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  art: { width: '100%', aspectRatio: 268 / 248, backgroundColor: '#ECFDF5', borderRadius: 28 },
  largeCircle: { position: 'absolute', width: '58%', aspectRatio: 1, borderRadius: 999, top: '-5.5%', right: '-5%', backgroundColor: '#D1FAE5' },
  smallCircle: { position: 'absolute', width: '40%', aspectRatio: 1, borderRadius: 999, left: '3%', bottom: '3%', backgroundColor: '#C2F8E3' },
  shadow: { position: 'absolute', left: '24%', top: '68%', width: '52%', height: '12%', borderRadius: 999, backgroundColor: '#C5E9DD' },
  basket: { position: 'absolute', left: '26%', top: '35%', width: '48%', height: '46%' },
  apple: { position: 'absolute', left: '12%', top: '14%', width: '36%', aspectRatio: 1, borderRadius: 999, backgroundColor: '#EF4444' },
  appleShine: { position: 'absolute', left: '17%', top: '17%', width: '28%', aspectRatio: 1, borderRadius: 999, backgroundColor: '#FCA5A5' },
  stem: { position: 'absolute', left: '56%', top: '15%', width: '3%', height: '24%', backgroundColor: '#D97706', transform: [{ rotate: '-25deg' }] },
  leaf: { position: 'absolute', left: '49%', top: '5%', width: '21%', height: '22%', backgroundColor: '#10B981', borderTopLeftRadius: 14, borderTopRightRadius: 14, borderBottomLeftRadius: 14, transform: [{ rotate: '-35deg' }] },
  purpleFruit: { position: 'absolute', left: '49%', top: '28%', width: '30%', aspectRatio: 1, borderRadius: 999, backgroundColor: '#8B5CF6' },
  yellowFruit: { position: 'absolute', left: '29%', top: '24%', width: '33%', aspectRatio: 1, borderRadius: 999, backgroundColor: '#FACC15' },
  rimBack: { position: 'absolute', left: '1%', top: '49%', width: '96%', height: '18%', borderRadius: 999, backgroundColor: '#FFEDD5' },
  bowl: { position: 'absolute', left: '7%', top: '56%', width: '84%', height: '43%', backgroundColor: '#D97706', borderBottomLeftRadius: 60, borderBottomRightRadius: 60 },
  rimFront: { position: 'absolute', left: '1%', top: '48%', width: '96%', height: '16%', borderBottomLeftRadius: 70, borderBottomRightRadius: 70, borderBottomWidth: 10, borderBottomColor: '#C2410C', transform: [{ rotate: '-2deg' }] },
});
