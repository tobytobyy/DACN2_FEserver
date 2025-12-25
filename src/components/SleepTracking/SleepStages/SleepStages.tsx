// src/screens/SleepTracking/components/SleepStages/SleepStages.tsx
import React from 'react';
import { View, Text } from 'react-native';

import ZapIcon from '@assets/icons/svgs/thunder_2424.svg';
import styles, { dynamicStyles } from '@components/SleepTracking/styles';

type Stage = { text: string; percent: number; color: string };

type Props = {
  stages: {
    deep: Stage;
    light: Stage;
    rem: Stage;
  };
};

/**
 * ✅ Render 3 thanh: Deep/Light/REM
 * - Mỗi stage có percent + màu
 * - width dynamic được xử lý qua dynamicStyles.stageBarWidth()
 */
const SleepStages: React.FC<Props> = ({ stages }) => {
  return (
    <View>
      {/* Header của block stages */}
      <View style={styles.cardHeaderRow}>
        <View style={styles.cardHeaderLeft}>
          <ZapIcon width={20} height={20} color="#6366F1" fill="#6366F1" />
          <Text style={styles.cardTitle}>Sleep Stages</Text>
        </View>
      </View>

      <View style={styles.stagesGap}>
        <StageRow label="Deep Sleep" value={stages.deep.text} />
        <StageBar percent={stages.deep.percent} color={stages.deep.color} />

        <StageRow label="Light Sleep" value={stages.light.text} />
        <StageBar percent={stages.light.percent} color={stages.light.color} />

        <StageRow label="REM" value={stages.rem.text} />
        <StageBar percent={stages.rem.percent} color={stages.rem.color} />
      </View>
    </View>
  );
};

export default SleepStages;

/* ================== Local helpers ================== */

type StageRowProps = { label: string; value: string };

const StageRow: React.FC<StageRowProps> = ({ label, value }) => (
  <View style={styles.stageInfo}>
    <Text style={styles.stageLabel}>{label}</Text>
    <Text style={styles.stageValue}>{value}</Text>
  </View>
);

type StageBarProps = { percent: number; color: string };

const StageBar: React.FC<StageBarProps> = ({ percent, color }) => (
  <View style={styles.progressBarBg}>
    <View
      style={[
        styles.progressBarFillBase,
        dynamicStyles.stageBarWidth(percent),
        { backgroundColor: color },
      ]}
    />
  </View>
);
