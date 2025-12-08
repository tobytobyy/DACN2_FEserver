// src/navigation/CustomBottomTabBar.tsx
import React, { memo } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// SVG icons
import ChatAIIcon from '@assets/icons/svgs/chat_ai_3030.svg';
import CalendarIcon from '@assets/icons/svgs/calendar_2521.svg';
import WindowIcon from '@assets/icons/svgs/window_3030.svg';
import SettingsIcon from '@assets/icons/svgs/setting_2424.svg';
import HomeIcon from '@assets/icons/svgs/home_3737.svg';

const ICON_SIZE = 30;

type Props = BottomTabBarProps;

const CustomBottomTabBarComponent: React.FC<Props> = props => {
  const { state, navigation } = props;
  const insets = useSafeAreaInsets();

  const homeIndex = state.routes.findIndex(r => r.name === 'HomeTab');
  const isHomeFocused = state.index === homeIndex;

  return (
    <View
      style={[styles.bottomBarContainer, { paddingBottom: insets.bottom || 0 }]}
    >
      {/* Background bar */}
      <View style={styles.bottomBar}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;

          // chừa chỗ cho nút Home nổi
          if (route.name === 'HomeTab') {
            return <View key={route.key} style={{ width: 60 }} />;
          }

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              // cast nho nhỏ để thỏa ts
              navigation.navigate(route.name as never);
            }
          };

          const color = isFocused ? '#0EA5E9' : '#6B7280';

          const renderIcon = () => {
            switch (route.name) {
              case 'ChatbotTab':
                return (
                  <ChatAIIcon
                    width={ICON_SIZE}
                    height={ICON_SIZE}
                    color={color}
                    fill={color}
                  />
                );
              case 'CalendarTab':
                return <CalendarIcon width={ICON_SIZE} height={ICON_SIZE} />;
              case 'BrowserTab':
                return (
                  <WindowIcon
                    width={ICON_SIZE}
                    height={ICON_SIZE}
                    color={color}
                    fill={color}
                  />
                );
              case 'SettingsTab':
                return (
                  <SettingsIcon
                    width={ICON_SIZE}
                    height={ICON_SIZE}
                    color={color}
                    fill={color}
                  />
                );
              default:
                return null;
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={styles.navItem}
              activeOpacity={0.7}
            >
              {renderIcon()}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Floating Home button */}
      <TouchableOpacity
        style={styles.floatingHomeBtn}
        activeOpacity={0.9}
        onPress={() => navigation.navigate('HomeTab' as never)}
      >
        <HomeIcon
          width={32}
          height={32}
          color={isHomeFocused ? '#0EA5E9' : '#000'}
          fill={isHomeFocused ? '#0EA5E9' : '#000'}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomBarContainer: {
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    width: '100%',
    height: 80,
    paddingHorizontal: 30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 10,
    paddingBottom: 10,
  },
  navItem: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingHomeBtn: {
    position: 'absolute',
    top: -30,
    width: 64,
    height: 64,
    backgroundColor: '#FFF',
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
});

const CustomBottomTabBar = memo(CustomBottomTabBarComponent);

export default CustomBottomTabBar;
