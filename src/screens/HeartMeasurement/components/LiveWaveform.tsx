import React from 'react';
import Svg, { Polyline } from 'react-native-svg';

type Props = {
  /** Recent raw luma/red samples (any scale); the component normalizes them. */
  samples: number[];
  color: string;
  width?: number;
  height?: number;
};

/**
 * Draws recent PPG samples as a scrolling waveform. Normalizes the input to the
 * view height; an empty/flat input renders a centered flat line. Pure presentation.
 */
const LiveWaveform: React.FC<Props> = ({
  samples,
  color,
  width = 240,
  height = 48,
}) => {
  let points: string;
  if (samples.length < 2) {
    points = `0,${height / 2} ${width},${height / 2}`;
  } else {
    let min = Infinity;
    let max = -Infinity;
    for (const v of samples) {
      if (v < min) min = v;
      if (v > max) max = v;
    }
    const range = max - min || 1;
    const pad = 4;
    const usable = height - pad * 2;
    const step = width / (samples.length - 1);
    points = samples
      .map((v, i) => {
        const x = i * step;
        // Invert y so higher value draws higher on screen.
        const y = pad + (1 - (v - min) / range) * usable;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
  }

  return (
    <Svg width={width} height={height}>
      <Polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </Svg>
  );
};

export default LiveWaveform;
