import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ArrowLeftIcon from '../../../assets/icons/svgs/arrow_left_2424.svg';

const AiAnalysisScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Header với nút trở về */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <ArrowLeftIcon width={24} height={24} color="#2D8C83" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AI Analysis</Text>
      </View>

      {/* Nội dung chính */}
      <View style={styles.content}>
        <Text style={styles.text}>AI Analysis Screen (đang phát triển)</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f5f5f5',
    elevation: 2,
  },
  backButton: {
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D8C83',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AiAnalysisScreen;
