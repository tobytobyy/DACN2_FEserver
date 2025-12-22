import React, { memo, useMemo } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

import ChatAIIcon from '@assets/icons/svgs/chat_ai_3030.svg';
import CalendarIcon from '@assets/icons/svgs/calendar_2521.svg';
import WindowIcon from '@assets/icons/svgs/window_3030.svg';
import SettingsIcon from '@assets/icons/svgs/setting_2424.svg';
import HomeIcon from '@assets/icons/svgs/home_3737.svg';
import { theme } from '@assets/theme';

/**
 * Kích thước icon trong tab (trừ Home floating)
 */
const ICON_SIZE = 30;

/**
 * Danh sách route name của BottomTab (nên khớp với BottomTabParamList)
 * -> giúp map icon type-safe, tránh typo.
 */
type TabRouteName =
  | 'ChatbotTab'
  | 'CalendarTab'
  | 'HomeTab'
  | 'BrowserTab'
  | 'SettingsTab';

/**
 * Map route name -> Icon component
 * - type-safe: chỉ nhận đúng route của bottom tab
 */
const TAB_ICONS: Record<
  Exclude<TabRouteName, 'HomeTab'>,
  React.ComponentType<any>
> = {
  ChatbotTab: ChatAIIcon,
  CalendarTab: CalendarIcon,
  BrowserTab: WindowIcon,
  SettingsTab: SettingsIcon,
};

/**
 * CustomBottomTabBarComponent
 * - Render tab bar custom (white bar + floating home button)
 * - Tự điều hướng giữa các tab
 * - Hỗ trợ ẩn tab bar theo nested route (VD: khi đang ở AiCaloriesScan)
 */
const CustomBottomTabBarComponent: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  /**
   * Ẩn tab bar cho một số màn hình đặc biệt (ví dụ: scan full-screen)
   * - Hiện tại yêu cầu: ẩn tab bar khi đang ở BrowserTab -> AiCaloriesScan
   *
   * ✅ Dùng getFocusedRouteNameFromRoute để lấy nested route name an toàn
   */
  const shouldHideTabBar = useMemo(() => {
    const currentTabRoute = state.routes[state.index];

    // Chỉ kiểm tra nested route khi đang ở BrowserTab
    if (currentTabRoute.name !== 'BrowserTab') return false;

    // Lấy route name đang được focus trong BrowserStack
    const focusedNestedRouteName =
      getFocusedRouteNameFromRoute(currentTabRoute) ?? 'Browser';

    return focusedNestedRouteName === 'AiCaloriesScan';
  }, [state.index, state.routes]);

  // Nếu cần ẩn tab bar -> return null
  if (shouldHideTabBar) return null;

  /**
   * Tìm tab Home để xác định trạng thái focus cho floating button
   */
  const homeIndex = state.routes.findIndex(r => r.name === 'HomeTab');
  const isHomeFocused = state.index === homeIndex;

  /**
   * Màu icon theo trạng thái active/inactive
   */
  const activeColor = theme.colors.primary;
  const inactiveColor = theme.colors.text;

  return (
    <View style={styles.bottomBarContainer}>
      {/* ===================== Main Tab Bar ===================== */}
      <View style={styles.bottomBar}>
        {state.routes.map((route, index) => {
          const routeName = route.name as TabRouteName;
          const isFocused = state.index === index;

          /**
           * HomeTab được render bằng floating button,
           * nên ở đây chỉ chừa khoảng trống (spacer) để cân layout.
           */
          if (routeName === 'HomeTab') {
            return <View key={route.key} style={styles.homeSpacer} />;
          }

          /**
           * Lấy Icon theo route
           * - Vì TAB_ICONS không chứa HomeTab, nên đảm bảo Icon luôn tồn tại với các tab còn lại.
           */
          const Icon = TAB_ICONS[routeName as Exclude<TabRouteName, 'HomeTab'>];
          const color = isFocused ? activeColor : inactiveColor;

          /**
           * Handle press theo đúng hành vi của BottomTab:
           * - emit tabPress (cho listener chặn nếu cần)
           * - navigate nếu chưa focus
           */
          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(routeName);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={styles.navItem}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={
                descriptors[route.key]?.options?.tabBarLabel?.toString() ??
                routeName
              }
            >
              <Icon width={ICON_SIZE} height={ICON_SIZE} color={color} />
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ===================== Floating Home Button ===================== */}
      <TouchableOpacity
        style={styles.floatingHomeBtn}
        activeOpacity={0.9}
        onPress={() => navigation.navigate('HomeTab')}
        accessibilityRole="button"
        accessibilityLabel="Home"
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
  /**
   * Wrapper ngoài cùng của tab bar
   * - nằm sát đáy màn hình
   * - dùng alignItems center để floating button luôn nằm giữa
   */
  bottomBarContainer: {
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },

  /**
   * Thanh tab chính (nền trắng)
   * - icon nằm theo hàng ngang
   * - bo góc trên
   * - shadow nhẹ
   */
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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

  /**
   * Khoảng trống dành cho vị trí Home floating button
   * - giúp các icon 2 bên cân đối
   */
  homeSpacer: {
    width: 60,
  },

  /**
   * Item icon của mỗi tab (trừ Home)
   */
  navItem: {
    paddingVertical: theme.spacing.gap,
    paddingHorizontal: theme.spacing.xs * 2,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /**
   * Nút Home nổi ở giữa
   * - nằm đè lên thanh tab
   * - shadow rõ hơn để nổi bật
   */
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
