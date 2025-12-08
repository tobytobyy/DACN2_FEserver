// src/screens/HomeScreen/components/HeaderSection.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import UserAvatar from '@assets/icons/svgs/account_circle.svg';

const HeaderSection: React.FC = () => {
  return (
    <View style={styles.headerBackground}>
      <View style={styles.headerContent}>
        <View>
          <View style={styles.helloRow}>
            <Text style={styles.waveIcon}>👋</Text>
            <Text style={styles.helloText}>Hello!</Text>
          </View>
          <Text style={styles.usernameText}>Username</Text>
        </View>

        <View style={styles.avatarButton}>
          <UserAvatar />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerBackground: {
    backgroundColor: '#98F6D6',
    height: 240,
    width: '100%',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    position: 'absolute',
    top: 0,
    zIndex: 0,
  },
  headerContent: {
    paddingHorizontal: 24,
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  helloRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  waveIcon: {
    fontSize: 18,
  },
  helloText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  usernameText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 2,
  },
  avatarButton: {
    padding: 4,
  },
});

export default HeaderSection;
