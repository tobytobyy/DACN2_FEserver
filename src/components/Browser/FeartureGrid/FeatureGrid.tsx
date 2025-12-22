import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import ArrowRightIcon from '@assets/icons/svgs/arrow_right_2424.svg';
import GridIcon from '@assets/icons/svgs/window_3030.svg';

import styles from './styles';

export interface FeatureItem {
  id: string;
  title: string;
  desc: string;
  icon: React.ComponentType<any>;
  bgColor: string;
  iconColor: string;
  borderColor: string;
  screen: string;
}

interface FeatureGridProps {
  title: string;
  features: FeatureItem[];
  onPressFeature: (screen: string) => void;
}

const FeatureGrid: React.FC<FeatureGridProps> = ({
  title,
  features,
  onPressFeature,
}) => {
  return (
    <>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>

        {/* Placeholder cho action "View all" trong tương lai */}
        <TouchableOpacity style={styles.seeAllBtn}>
          <Text style={styles.seeAllText}>View all</Text>
          <ArrowRightIcon width={14} height={14} color="#2D8C83" />
        </TouchableOpacity>
      </View>

      <View style={styles.gridContainer}>
        {features.map(item => {
          const Icon = item.icon;
          return (
            <TouchableOpacity
              key={item.id}
              style={[styles.gridItem, { borderColor: item.borderColor }]}
              onPress={() => onPressFeature(item.screen)}
            >
              <View style={[styles.iconBox, { backgroundColor: item.bgColor }]}>
                <Icon
                  width={24}
                  height={24}
                  color={item.iconColor}
                  fill={item.iconColor}
                />
              </View>

              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemDesc} numberOfLines={2}>
                {item.desc}
              </Text>

              <View style={styles.arrowIcon}>
                <ArrowRightIcon width={16} height={16} color="#9CA3AF" />
              </View>
            </TouchableOpacity>
          );
        })}

        {/* Thẻ placeholder cho các tính năng sẽ bổ sung sau */}
        <TouchableOpacity style={styles.moreCard}>
          <View style={styles.moreIconBox}>
            <GridIcon width={20} height={20} color="#9CA3AF" />
          </View>
          <Text style={styles.moreText}>Coming soon...</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default FeatureGrid;
