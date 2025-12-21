import React, { memo } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

import ChatAIIcon from '@assets/icons/svgs/chat_ai_3030.svg';
import CalendarIcon from '@assets/icons/svgs/calendar_2521.svg';
import WindowIcon from '@assets/icons/svgs/window_3030.svg';
import SettingsIcon from '@assets/icons/svgs/setting_2424.svg';
import HomeIcon from '@assets/icons/svgs/home_3737.svg';
import { theme } from '@assets/theme';

const ICON_SIZE = 30;

type Props = BottomTabBarProps;

// map tên route → icon component
const TAB_ICONS: Record<string, React.ComponentType<any>> = {
  ChatbotTab: ChatAIIcon,
  CalendarTab: CalendarIcon,
  BrowserTab: WindowIcon,
  SettingsTab: SettingsIcon,
};

const CustomBottomTabBarComponent: React.FC<Props> = ({
  state,
  navigation,
}) => {
  const shouldHideTabBar = () => {
    const activeRoute = state.routes[state.index];

    if (activeRoute.name !== 'BrowserTab') return false;

    const stackState = activeRoute.state as
      | { index: number; routes: { name: string }[] }
      | undefined;
    const activeStackRoute =
      stackState && stackState.routes[stackState.index]?.name;

    return activeStackRoute === 'AiCaloriesScan';
  };

  if (shouldHideTabBar()) {
    return null;
  }

  const homeIndex = state.routes.findIndex(r => r.name === 'HomeTab');
  const isHomeFocused = state.index === homeIndex;

  const activeColor = theme.colors.primary;
  const inactiveColor = theme.colors.text;

  return (
    <View style={styles.bottomBarContainer}>
      {/* White tab bar */}
      <View style={styles.bottomBar}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;

          // chừa slot giữa cho nút home nổi
          if (route.name === 'HomeTab') {
            return <View key={route.key} style={styles.homeSpacer} />;
          }

          const Icon = TAB_ICONS[route.name];
          if (!Icon) return null;

          const color = isFocused ? activeColor : inactiveColor;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name as never);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={styles.navItem}
              activeOpacity={0.7}
            >
              <Icon width={ICON_SIZE} height={ICON_SIZE} color={color} />
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Floating home button */}
      <TouchableOpacity
        style={styles.floatingHomeBtn}
        activeOpacity={0.9}
        onPress={() => navigation.navigate('HomeTab' as never)}
      >
        <HomeIcon
          width={32}
          height={32}
          color={isHomeFocused ? activeColor : inactiveColor}
          fill={isHomeFocused ? activeColor : inactiveColor}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomBarContainer: {
    // position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0, // dính sát đáy màn hình
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', // icon nằm giữa theo chiều dọc
    backgroundColor: theme.colors.white,
    width: '100%',
    height: 80,
    paddingHorizontal: theme.spacing.gap * 3,
    borderTopLeftRadius: theme.spacing.gap * 2,
    borderTopRightRadius: theme.spacing.gap * 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 10,
  },
  homeSpacer: {
    width: 60,
  },
  navItem: {
    paddingVertical: theme.spacing.gap,
    paddingHorizontal: theme.spacing.xs * 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingHomeBtn: {
    position: 'absolute',
    top: -26,
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: theme.colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
});

export default memo(CustomBottomTabBarComponent);
