import React from 'react';
import { View, Text } from 'react-native';
import styles from '@screens/AppScreen/Setting/SettingsStyles';

/**
 * Props cho SettingsSection
 */
type SettingsSectionProps = {
  /**
   * Tiêu đề của section
   * Ví dụ: "Account", "Preferences", "Security"
   */
  title: string;

  /**
   * Nội dung bên trong section
   * Thường là nhiều <SettingRow />
   */
  children: React.ReactNode;
};

/**
 * SettingsSection
 *
 * Component dùng để:
 * - Nhóm các setting liên quan lại với nhau
 * - Hiển thị tiêu đề section + danh sách item bên dưới
 *
 * Ví dụ sử dụng:
 *
 * <SettingsSection title="Account">
 *   <SettingRow ... />
 *   <SettingRow ... />
 * </SettingsSection>
 */
const SettingsSection: React.FC<SettingsSectionProps> = ({
  title,
  children,
}) => {
  return (
    /**
     * Container bao toàn bộ section
     * - spacing, background, border… được xử lý trong styles
     */
    <View style={styles.groupContainer}>
      {/* Tiêu đề section */}
      <Text style={styles.groupTitle}>{title}</Text>

      {/* Các setting item truyền từ ngoài vào */}
      {children}
    </View>
  );
};

export default SettingsSection;
