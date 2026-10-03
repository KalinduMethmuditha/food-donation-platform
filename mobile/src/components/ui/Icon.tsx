import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { View } from 'react-native';
import { Colors } from '@/constants/colors';

// Use the already-installed Expo symbols on iOS, Android, and web.
const symbols = {
  home: { ios: 'house', android: 'home', web: 'home' },
  gift: { ios: 'gift', android: 'redeem', web: 'redeem' },
  bell: { ios: 'bell', android: 'notifications', web: 'notifications' },
  user: { ios: 'person.crop.circle', android: 'account_circle', web: 'account_circle' },
  menu: { ios: 'line.3.horizontal', android: 'menu', web: 'menu' },
  'arrow-left': { ios: 'arrow.left', android: 'arrow_back', web: 'arrow_back' },
  'chevron-right': { ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' },
  check: { ios: 'checkmark', android: 'check', web: 'check' },
  clock: { ios: 'clock', android: 'schedule', web: 'schedule' },
  pin: { ios: 'mappin.and.ellipse', android: 'location_on', web: 'location_on' },
  plus: { ios: 'plus', android: 'add', web: 'add' },
  search: { ios: 'magnifyingglass', android: 'search', web: 'search' },
  leaf: { ios: 'leaf', android: 'eco', web: 'eco' },
  users: { ios: 'person.2', android: 'group', web: 'group' },
  info: { ios: 'info.circle', android: 'info', web: 'info' },
  'arrow-up': { ios: 'arrow.up', android: 'arrow_upward', web: 'arrow_upward' },
  eye: { ios: 'eye', android: 'visibility', web: 'visibility' },
  'eye-slash': { ios: 'eye.slash', android: 'visibility_off', web: 'visibility_off' },
  truck: { ios: 'truck.box', android: 'local_shipping', web: 'local_shipping' },
  heart: { ios: 'heart', android: 'favorite', web: 'favorite' },
  building: { ios: 'building.2', android: 'apartment', web: 'apartment' },
} satisfies Record<string, SymbolViewProps['name']>;

export type IconName = keyof typeof symbols;

export default function Icon({ name, size = 22, color = Colors.primaryDark }: {
  name: IconName;
  size?: number;
  color?: string;
}) {
  return <View accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants"
    aria-hidden style={{ width: size, height: size }}>
    <SymbolView name={symbols[name]} size={size} tintColor={color}
      style={{ width: size, height: size }} />
  </View>;
}
