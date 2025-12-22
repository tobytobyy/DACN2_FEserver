import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import GoogleIcon from '@assets/icons/svgs/google_color_2122.svg';
import RefreshIcon from '@assets/icons/svgs/reload_2424.svg';
import CheckIcon from '@assets/icons/svgs/verify_1515.svg';

import styles from '@screens/AppScreen/Setting/SettingsStyles';

type Provider = 'google' | 'none';

type Props = {
  /** Tên hiển thị của user */
  name: string;

  /** Email của user */
  email: string;

  /** Chữ cái avatar (fallback khi không có ảnh) */
  avatarLetter: string;

  /** Trạng thái verified */
  verified?: boolean;

  /** Provider đăng nhập (nếu cần show icon) */
  provider?: Provider;

  /** Callback khi bấm nút refresh/sync */
  onPressRefresh?: () => void;
};

/**
 * Màu icon (tách ra constant để tránh inline prop)
 * - Nếu bạn muốn 100% theo theme, mình có thể chuyển về theme.colors
 */
const VERIFIED_ICON_COLOR = '#2D8C83';
const REFRESH_ICON_COLOR = '#6B7280';

/**
 * ProfileCard
 * - Hiển thị info user (avatar letter, provider icon, name, email)
 * - Có badge Verified (tuỳ chọn)
 * - Có nút refresh để sync tài khoản (tuỳ chọn)
 */
const ProfileCard: React.FC<Props> = ({
  name,
  email,
  avatarLetter,
  verified = true,
  provider = 'google',
  onPressRefresh,
}) => {
  return (
    <View style={styles.profileCard}>
      {/* ===== Left: Avatar + Provider badge ===== */}
      <View style={styles.profileIconContainer}>
        {/* Avatar placeholder (chữ cái đầu) */}
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarText}>{avatarLetter}</Text>
        </View>

        {/* Badge icon provider (VD: Google) */}
        {provider === 'google' ? (
          <View style={styles.smallIconBadge}>
            <GoogleIcon width={12} height={12} />
          </View>
        ) : null}
      </View>

      {/* ===== Middle: Name / Email / Verified ===== */}
      <View style={styles.profileInfo}>
        <Text style={styles.profileName}>{name}</Text>
        <Text style={styles.profileEmail}>{email}</Text>

        {/* Verified badge (optional) */}
        {verified ? (
          <View style={styles.verifiedBadge}>
            <CheckIcon width={10} height={10} color={VERIFIED_ICON_COLOR} />
            <Text style={styles.verifiedText}>Verified</Text>
          </View>
        ) : null}
      </View>

      {/* ===== Right: Refresh button (optional) ===== */}
      <TouchableOpacity style={styles.refreshBtn} onPress={onPressRefresh}>
        <RefreshIcon width={20} height={20} color={REFRESH_ICON_COLOR} />
      </TouchableOpacity>
    </View>
  );
};

export default ProfileCard;
