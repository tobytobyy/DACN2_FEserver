import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
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
import MoonIcon from '@assets/icons/svgs/sleep_2424.svg';
import GlobeIcon from '@assets/icons/svgs/language_1515.svg';
import HelpIcon from '@assets/icons/svgs/help_1616.svg';
import ArrowLeftIcon from '@assets/icons/svgs/arrow_left_2424.svg';
import CloudIcon from '@assets/icons/svgs/cloud_2015.svg';

// Pages
import LinkedAccountsPage from './pages/LinkedAccountsPage';
import BackupEmailPage from './pages/BackupEmailPage';
import PrivacyPage from './pages/PrivacyPage';
import LanguagePage from './pages/LanguagePage';
import HelpPage from './pages/HelpPage';

export default function SettingScreen() {
  const [currentView, setCurrentView] = useState<
    'main' | 'linked_account' | 'backup_email' | 'privacy' | 'language' | 'help'
  >('main');
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [dataSync, setDataSync] = useState(true);

  const goBack = () => setCurrentView('main');

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
        <TouchableOpacity style={styles.backButton}>
          <ArrowLeftIcon width={24} height={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Setting</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile */}
        <ProfileCard
          name="Đạt Nguyễn"
          email="ngtiendat.94.04@gmail.com"
          avatarLetter="D"
          verified
          provider="google"
          onPressRefresh={() => console.log('refresh')}
        />

        {/* Linked Accounts */}
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

        {/* General */}
        <SettingsSection title="GENERAL">
          <SettingRow
            IconComponent={BellIcon}
            color={theme.colors.orange}
            iconColor={theme.colors.white}
            title="Notification"
            type="toggle"
            toggleState={notifications}
            onToggle={() => setNotifications(!notifications)}
          />

          <SettingRow
            IconComponent={MoonIcon}
            color={theme.colors.violet}
            iconColor={theme.colors.white}
            title="Dark Mode"
            type="toggle"
            toggleState={darkMode}
            onToggle={() => setDarkMode(!darkMode)}
          />

          <SettingRow
            IconComponent={CloudIcon}
            color={theme.colors.danger}
            iconColor={theme.colors.white}
            title="Data synchronization"
            type="toggle"
            toggleState={dataSync}
            onToggle={() => setDataSync(!dataSync)}
          />
        </SettingsSection>

        {/* Others */}
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

        {/* Logout */}
        <LogoutButton />

        <Text style={styles.versionText}>Version 1.0</Text>
      </ScrollView>
    </View>
  );
}
