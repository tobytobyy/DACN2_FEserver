import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, Switch } from 'react-native';

import ChevronRightIcon from '@assets/icons/svgs/arrow_right_2424.svg';
import styles from '@screens/AppScreen/Setting/SettingsStyles';
import { theme } from '@assets/theme';

/**
 * Variant màu nền iconBox
 * - Tránh truyền backgroundColor dạng string trực tiếp -> sẽ phải inline style object
 */
type IconVariant = 'white' | 'primary' | 'danger' | 'gray' | 'blue' | 'green';

type SettingRowProps = {
  /** Component icon truyền từ ngoài vào */
  IconComponent: React.ComponentType<any>;

  /** Chọn màu nền iconBox theo variant (không truyền color string để tránh inline) */
  iconBgVariant?: IconVariant;

  /** Màu icon theo variant (để không phải truyền color string inline) */
  iconVariant?: 'default' | 'muted' | 'primary' | 'danger' | 'success';

  /** Tiêu đề dòng setting */
  title: string;

  /** Value phụ bên phải (VD: email, language...) */
  value?: string;

  /** Kiểu row: link (mở màn khác) hoặc toggle */
  type?: 'link' | 'toggle';

  /** Trạng thái toggle */
  toggleState?: boolean;

  /** Callback toggle */
  onToggle?: () => void;

  /** Callback click khi type=link */
  onClick?: () => void;

  /**
   * Một số SVG đã có màu gốc (google icon...) -> không override màu
   * true: không truyền color vào IconComponent
   */
  isOriginalIcon?: boolean;
};

/**
 * Mapping style background cho iconBox theo variant
 * - Không dùng inline style object
 */
const ICON_BG_STYLE_MAP: Record<IconVariant, any> = {
  white: theme.colors.white,
  gray: theme.colors.grayDark,
  blue: theme.colors.blue,
  green: theme.colors.green,
  primary: theme.colors.primary,
  danger: theme,
};

/**
 * Mapping màu icon (thông qua constant)
 * - Không hardcode trong JSX
 */
const ICON_COLOR_MAP: Record<
  NonNullable<SettingRowProps['iconVariant']>,
  string | undefined
> = {
  default: undefined,
  muted: '#6B7280',
  primary: '#2D8C83',
  danger: '#EF4444',
  success: '#10B981',
};

/**
 * SettingRow
 * - Dòng setting dùng chung (icon + title + right content)
 * - Hỗ trợ link hoặc toggle
 * - Không inline styles
 */
const SettingRow: React.FC<SettingRowProps> = ({
  IconComponent,
  iconBgVariant = 'white',
  iconVariant = 'default',
  title,
  value,
  type = 'link',
  toggleState,
  onToggle,
  onClick,
  isOriginalIcon = false,
}) => {
  /**
   * Handler cho row:
   * - toggle: gọi onToggle
   * - link: gọi onClick
   */
  const handlePress = () => {
    if (type === 'toggle') onToggle?.();
    else onClick?.();
  };

  /**
   * Resolve iconBox background style theo variant
   */
  const iconBgStyle = useMemo(
    () => ICON_BG_STYLE_MAP[iconBgVariant],
    [iconBgVariant],
  );

  /**
   * Resolve icon color theo variant
   * - Nếu isOriginalIcon = true -> không override color
   */
  const resolvedIconColor = useMemo(() => {
    if (isOriginalIcon) return undefined;
    return ICON_COLOR_MAP[iconVariant];
  }, [iconVariant, isOriginalIcon]);

  return (
    <TouchableOpacity
      style={styles.settingRow}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      {/* ===== Left: Icon + Title ===== */}
      <View style={styles.settingLeft}>
        <View style={[styles.iconBox, iconBgStyle]}>
          <IconComponent width={22} height={22} color={resolvedIconColor} />
        </View>
        <Text style={styles.settingText}>{title}</Text>
      </View>

      {/* ===== Right: Toggle hoặc Link ===== */}
      {type === 'toggle' ? (
        <Switch
          trackColor={{ false: '#E5E7EB', true: '#10B981' }}
          thumbColor="#FFFFFF"
          value={!!toggleState}
          onValueChange={onToggle}
        />
      ) : (
        <View style={styles.settingRight}>
          {value ? <Text style={styles.valueText}>{value}</Text> : null}
          <ChevronRightIcon width={16} height={16} color="#9CA3AF" />
        </View>
      )}
    </TouchableOpacity>
  );
};

export default SettingRow;
