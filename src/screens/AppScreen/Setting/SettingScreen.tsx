import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';

import styles from '@screens/AppScreen/Setting/SettingsStyles';

// import theme
import { theme } from '@assets/theme';

// components tách riêng
import ProfileCard from '@components/Setting/ProfileCard/ProfileCard';
import SettingsSection from '@components/Setting/SettingsSection/SettingsSection';
import SettingRow from '@components/Setting/SettingRow/SettingRow';
import LogoutButton from '@components/Setting/LoginButton/LogoutButton';

import GoogleIcon from '@assets/icons/svgs/google_color_2122.svg';
import MailIcon from '@assets/icons/svgs/email_1512.svg';
import ShieldIcon from '@assets/icons/svgs/security_1418.svg';
import BellIcon from '@assets/icons/svgs/notification_1518.svg';
import GlobeIcon from '@assets/icons/svgs/language_1515.svg';
import HelpIcon from '@assets/icons/svgs/help_1616.svg';
import ArrowLeftIcon from '@assets/icons/svgs/arrow_left_2424.svg';
import AccountIcon from '@assets/icons/svgs/account_circle.svg';
import HeartIcon from '@assets/icons/svgs/heart.svg';

// Pages
import LinkedAccountsPage from './pages/LinkedAccountsPage';
import BackupEmailPage from './pages/BackupEmailPage';
import PrivacyPage from './pages/PrivacyPage';
import LanguagePage from './pages/LanguagePage';
import HelpPage from './pages/HelpPage';
import { api } from '../../../services/api';
import { UserProfile } from '@components/Home/HeaderSection/types';
import { useUser } from '@context/UserContext';

type SettingsView =
  | 'main'
  | 'linked_account'
  | 'backup_email'
  | 'privacy'
  | 'language'
  | 'help'
  | 'profile_edit';

const getAvatarLetter = (name: string, email: string) =>
  (name || email || 'U').trim().charAt(0).toUpperCase();

export default function SettingScreen() {
  const { clearUser } = useUser();
  const [currentView, setCurrentView] = useState<SettingsView>('main');
  const [notifications, setNotifications] = useState(true);
  const [isSavingNotif, setIsSavingNotif] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    avatarUrl: '',
    gender: '',
    birthDate: '',
    heightCm: '',
    weightKg: '',
    bloodType: '',
    conditions: '',
  });

  const goBack = () => setCurrentView('main');

  const syncUser = useCallback(async () => {
    try {
      const res = await api.get<UserProfile>('/auth/me');
      const nextUser = res.data;
      const profile = nextUser.profile || {};
      setUser(nextUser);
      setNotifications(nextUser.settings?.notifications?.enabled ?? true);
      setForm({
        fullName: profile.fullName || nextUser.username || '',
        avatarUrl: profile.avatarUrl || '',
        gender: profile.gender || '',
        birthDate: (profile.birthDate || '').slice(0, 10),
        heightCm: String(profile.heightCm || ''),
        weightKg: String(profile.weightKg || ''),
        bloodType: profile.bloodType || '',
        conditions: (profile.conditions || []).join(', '),
      });
    } catch (error) {
      console.warn('Fetch user settings failed:', error);
    }
  }, []);

  useEffect(() => {
    syncUser();
  }, [syncUser]);

  const profile = user?.profile || null;
  const displayName = profile?.fullName || user?.username || 'Health User';
  const email =
    user?.primaryEmail || user?.displayIdentifier || 'Not connected';

  const healthRows = useMemo(
    () => [
      { label: 'Chiều cao', value: `${profile?.heightCm || 0} cm` },
      { label: 'Cân nặng', value: `${profile?.weightKg || 0} kg` },
      { label: 'Giới tính', value: profile?.gender || 'Chưa cập nhật' },
      { label: 'Nhóm máu', value: profile?.bloodType || 'Chưa cập nhật' },
    ],
    [profile],
  );

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const payload = {
        fullName: form.fullName.trim(),
        avatarUrl: form.avatarUrl.trim() || null,
        gender: form.gender || null,
        birthDate: form.birthDate ? form.birthDate.slice(0, 10) : null,
        heightCm: Number(form.heightCm || 0),
        weightKg: Number(form.weightKg || 0),
        bloodType: form.bloodType.trim() || null,
        conditions: form.conditions
          .split(',')
          .map(item => item.trim())
          .filter(Boolean),
      };
      await api.put('/users/me/profile', payload);
      await syncUser();
      Alert.alert(
        'Đã lưu',
        'Hồ sơ cá nhân và chỉ số sức khỏe đã được cập nhật.',
      );
      setCurrentView('main');
    } catch (error: any) {
      Alert.alert(
        'Không thể lưu',
        error?.response?.data?.message || 'Vui lòng kiểm tra kết nối backend.',
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleNotifications = async () => {
    if (isSavingNotif) return;
    const next = !notifications;
    setNotifications(next); // optimistic
    setIsSavingNotif(true);
    try {
      await api.patch('/users/me/settings/notifications', { enabled: next });
    } catch (error: any) {
      setNotifications(!next); // revert
      Alert.alert(
        'Không thể cập nhật',
        error?.response?.data?.message || 'Vui lòng kiểm tra kết nối backend.',
      );
    } finally {
      setIsSavingNotif(false);
    }
  };

  if (currentView === 'linked_account')
    return <LinkedAccountsPage onBack={goBack} />;
  if (currentView === 'backup_email')
    return <BackupEmailPage onBack={goBack} />;
  if (currentView === 'privacy') return <PrivacyPage onBack={goBack} />;
  if (currentView === 'language') return <LanguagePage onBack={goBack} />;
  if (currentView === 'help') return <HelpPage onBack={goBack} />;

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={theme.colors.white} barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <ArrowLeftIcon width={24} height={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {currentView === 'profile_edit' ? 'Edit profile' : 'Setting'}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {currentView === 'profile_edit' ? (
          <View style={styles.profileFormCard}>
            <Text style={styles.formLabel}>Họ tên</Text>
            <TextInput
              value={form.fullName}
              onChangeText={fullName =>
                setForm(prev => ({ ...prev, fullName }))
              }
              style={styles.formInput}
              placeholder="Nhập họ tên"
            />
            <Text style={styles.formLabel}>Avatar URL</Text>
            <TextInput
              value={form.avatarUrl}
              onChangeText={avatarUrl =>
                setForm(prev => ({ ...prev, avatarUrl }))
              }
              style={styles.formInput}
              placeholder="https://..."
              autoCapitalize="none"
            />
            <Text style={styles.formLabel}>Giới tính</Text>
            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
              {(['MALE', 'FEMALE', 'OTHER'] as const).map(option => {
                const selected = form.gender === option;
                return (
                  <TouchableOpacity
                    key={option}
                    onPress={() =>
                      setForm(prev => ({ ...prev, gender: option }))
                    }
                    style={[
                      styles.formInput,
                      {
                        flex: 1,
                        marginBottom: 0,
                        alignItems: 'center',
                        backgroundColor: selected ? '#2D8C83' : '#F3F4F6',
                      },
                    ]}
                  >
                    <Text style={{ color: selected ? '#FFFFFF' : '#374151' }}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <Text style={styles.formLabel}>Ngày sinh (YYYY-MM-DD)</Text>
            <TextInput
              value={form.birthDate}
              onChangeText={birthDate =>
                setForm(prev => ({ ...prev, birthDate }))
              }
              style={styles.formInput}
              placeholder="2000-01-01"
            />
            <Text style={styles.formLabel}>Chiều cao (cm)</Text>
            <TextInput
              value={form.heightCm}
              onChangeText={heightCm =>
                setForm(prev => ({ ...prev, heightCm }))
              }
              style={styles.formInput}
              keyboardType="numeric"
            />
            <Text style={styles.formLabel}>Cân nặng (kg)</Text>
            <TextInput
              value={form.weightKg}
              onChangeText={weightKg =>
                setForm(prev => ({ ...prev, weightKg }))
              }
              style={styles.formInput}
              keyboardType="numeric"
            />
            <Text style={styles.formLabel}>Nhóm máu</Text>
            <TextInput
              value={form.bloodType}
              onChangeText={bloodType =>
                setForm(prev => ({ ...prev, bloodType }))
              }
              style={styles.formInput}
              placeholder="A+, O-, ..."
            />
            <Text style={styles.formLabel}>Bệnh nền / ghi chú sức khỏe</Text>
            <TextInput
              value={form.conditions}
              onChangeText={conditions =>
                setForm(prev => ({ ...prev, conditions }))
              }
              style={styles.formInput}
              placeholder="Ví dụ: dị ứng penicillin, huyết áp cao"
              multiline
            />
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleSaveProfile}
            >
              <Text style={styles.primaryButtonText}>
                {isSaving ? 'Đang lưu...' : 'Lưu hồ sơ'}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <ProfileCard
              name={displayName}
              email={email}
              avatarLetter={getAvatarLetter(displayName, email)}
              avatarUrl={profile?.avatarUrl}
              verified
              provider="google"
              onPressRefresh={syncUser}
            />

            <SettingsSection title="PROFILE & HEALTH DATA">
              <SettingRow
                IconComponent={AccountIcon}
                color={theme.colors.primary}
                iconColor={theme.colors.white}
                title="Edit personal profile"
                value="Name, avatar, birthday"
                onClick={() => setCurrentView('profile_edit')}
              />
              <View style={styles.metricGrid}>
                {healthRows.map(item => (
                  <View key={item.label} style={styles.metricChip}>
                    <Text style={styles.metricLabel}>{item.label}</Text>
                    <Text style={styles.metricValue}>{item.value}</Text>
                  </View>
                ))}
              </View>
              <SettingRow
                IconComponent={HeartIcon}
                color={theme.colors.red}
                iconColor={theme.colors.white}
                title="Health notes"
                value={(profile?.conditions || []).join(', ') || 'No notes'}
                onClick={() => setCurrentView('profile_edit')}
              />
            </SettingsSection>

            <SettingsSection title="LINKED ACCOUNTS">
              <SettingRow
                IconComponent={GoogleIcon}
                isOriginalIcon
                title="Google"
                value="Connected"
                onClick={() => setCurrentView('linked_account')}
              />
              <SettingRow
                IconComponent={MailIcon}
                color={theme.colors.blue}
                iconColor={theme.colors.white}
                title="Backup Email"
                value="Not set up yet"
                onClick={() => setCurrentView('backup_email')}
              />
              <SettingRow
                IconComponent={ShieldIcon}
                color={theme.colors.green}
                iconColor={theme.colors.white}
                title="Privacy and Security"
                onClick={() => setCurrentView('privacy')}
              />
            </SettingsSection>

            <SettingsSection title="GENERAL">
              <SettingRow
                IconComponent={BellIcon}
                color={theme.colors.orange}
                iconColor={theme.colors.white}
                title="Notification"
                type="toggle"
                toggleState={notifications}
                onToggle={handleToggleNotifications}
              />
            </SettingsSection>

            <SettingsSection title="OTHERS">
              <SettingRow
                IconComponent={GlobeIcon}
                color={theme.colors.info}
                iconColor={theme.colors.white}
                title="Language"
                value="English"
                onClick={() => setCurrentView('language')}
              />
              <SettingRow
                IconComponent={HelpIcon}
                color={theme.colors.muted}
                iconColor={theme.colors.white}
                title="Help & Support"
                onClick={() => setCurrentView('help')}
              />
            </SettingsSection>

            <LogoutButton
              onPress={async () => {
                await api.post('/auth/logout').catch(() => undefined);
                await clearUser();
              }}
            />
            <Text style={styles.versionText}>Version 1.0</Text>
          </>
        )}
      </ScrollView>
    </View>
  );
}
