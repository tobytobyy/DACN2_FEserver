import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { styles } from '../styles';
import { theme } from '@assets/theme';
import { MacroItem } from '../MacroItem/MacroItem';

type Props = {
  bottomInset: number;
  onClose: () => void;
};

export const ResultSheet: React.FC<Props> = ({ bottomInset, onClose }) => (
  <View style={[styles.resultSheet, { paddingBottom: bottomInset }]}>
    <View style={styles.dragHandle} />

    <View style={styles.sheetHeader}>
      <Text style={styles.resultTitle}>Avocado Toast</Text>
      <TouchableOpacity onPress={onClose}>
        <Ionicons name="close" size={20} color={theme.colors.text} />
      </TouchableOpacity>
    </View>

    <View style={styles.calorieRow}>
      <Text style={styles.calorieValue}>320</Text>
      <Text style={styles.calorieUnit}>kcal</Text>
    </View>

    <View style={styles.macroRow}>
      <MacroItem label="Protein" value="12g" color="#0EA5E9" percentage={40} />
      <MacroItem label="Carbs" value="45g" color="#F59E0B" percentage={60} />
      <MacroItem label="Fat" value="18g" color="#EF4444" percentage={30} />
    </View>
  </View>
);
