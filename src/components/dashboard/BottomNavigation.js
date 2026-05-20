import React, {useMemo} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  useWindowDimensions,
  Platform,
} from 'react-native';
import {useNavigation, useNavigationState} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
/** Inner row height (icons + labels), excluding top padding and home indicator */
export const BOTTOM_TAB_ROW_MIN_HEIGHT = 52;
const TOP_PADDING = 8;

/**
 * Total vertical space consumed by the bottom tab bar (including safe area).
 * Use for ScrollView / FlatList `contentContainerStyle.paddingBottom` so content clears the bar.
 */
export function useBottomTabBarInset() {
  const insets = useSafeAreaInsets();
  return BOTTOM_TAB_ROW_MIN_HEIGHT + TOP_PADDING + insets.bottom;
}

const TABS = [
  {
    route: 'Dashboard',
    label: 'Home',
    icon: require('../../assets/images/dashboard.png'),
  },
  {
    route: 'PrayersScreen',
    label: 'Prayers',
    icon: require('../../assets/images/prayers.png'),
  },
  {
    route: 'QuranScreen',
    label: 'Quran',
    icon: require('../../assets/images/quran.png'),
  },
  {
    route: 'UmmahApp',
    label: 'Ummah',
    icon: require('../../assets/images/umaah.png'),
  },
];

function getActiveStackRouteName(state) {
  if (!state?.routes?.length || state.index == null) {
    return '';
  }
  return state.routes[state.index]?.name ?? '';
}

const RootNavigator = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const {width} = useWindowDimensions();

  const activeRoute = useNavigationState(getActiveStackRouteName);

  const {labelFontSize, iconSize} = useMemo(() => {
    const label = Math.max(9, Math.min(12, Math.round(width / 36)));
    const icon = Math.max(22, Math.min(28, Math.round(width / 15)));
    return {labelFontSize: label, iconSize: icon};
  }, [width]);

  return (
    <View
      style={[
        styles.shell,
        {
          paddingBottom: insets.bottom,
          paddingTop: TOP_PADDING,
        },
      ]}>
        <View style={[styles.row, {minHeight: BOTTOM_TAB_ROW_MIN_HEIGHT}]}>
          {TABS.map(tab => {
            const focused = activeRoute === tab.route;
            return (
              <TouchableOpacity
                key={tab.route}
                accessibilityRole="button"
                accessibilityState={{selected: focused}}
                accessibilityLabel={tab.label}
                activeOpacity={0.7}
                style={[styles.tab, focused && styles.tabFocused]}
                onPress={() => navigation.navigate(tab.route)}>
                <Image
                  source={tab.icon}
                  style={[
                    styles.icon,
                    {width: iconSize, height: iconSize},
                    focused && styles.iconFocused,
                  ]}
                  resizeMode="contain"
                />
                <Text
                  style={[styles.label, {fontSize: labelFontSize}, focused && styles.labelFocused]}
                  numberOfLines={1}
                  maxFontSizeMultiplier={1.35}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  shell: {
    backgroundColor: 'rgba(13, 66, 54, 0.97)',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.14)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: -3},
        shadowOpacity: 0.18,
        shadowRadius: 6,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    marginHorizontal: 2,
    borderRadius: 10,
  },
  tabFocused: {
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  icon: {
    marginBottom: 2,
  },
  iconFocused: {
    opacity: 1,
  },
  label: {
    color: 'rgba(255,255,255,0.72)',
    fontWeight: '600',
    textAlign: 'center',
  },
  labelFocused: {
    color: '#fff',
  },
});

export default RootNavigator;
