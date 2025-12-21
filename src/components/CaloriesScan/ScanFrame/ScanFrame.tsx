import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { FRAME_SIZE } from '../styles';

export const ScanFrame = () => (
  <Svg
    width={FRAME_SIZE}
    height={FRAME_SIZE}
    viewBox={`0 0 ${FRAME_SIZE} ${FRAME_SIZE}`}
    fill="none"
  >
    <Path
      d="M40 4H20C11.1634 4 4 11.1634 4 20v20"
      stroke="#0EA5E9"
      strokeWidth={4}
    />
    <Path
      d="M240 4h20c8.837 0 16 11.1634 16 20v20"
      stroke="#0EA5E9"
      strokeWidth={4}
    />
    <Path
      d="M40 276H20c-8.8366 0-16-7.163-16-16v-20"
      stroke="#0EA5E9"
      strokeWidth={4}
    />
    <Path
      d="M240 276h20c8.837 0 16-7.163 16-16v-20"
      stroke="#0EA5E9"
      strokeWidth={4}
    />
  </Svg>
);
