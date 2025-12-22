// src/components/FootStepCounting/FootStepMapHeader.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import WebView from 'react-native-webview';

import ArrowLeftIcon from '@assets/icons/svgs/arrow_left_2424.svg';
import SettingIcon from '@assets/icons/svgs/setting_2424.svg';
import { theme } from '@assets/theme';
import styles from './styles';

/**
 * Props cho FootStepMapHeader
 * - onBack: callback khi bấm nút quay lại
 */
type Props = {
  onBack: () => void;
};

/**
 * HTML hiển thị bản đồ OpenStreetMap
 * - Sử dụng iframe embed
 * - Có marker cố định (demo)
 * - Chiếm toàn bộ diện tích WebView
 */
const MAP_HTML = `
<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      html, body {
        margin: 0;
        padding: 0;
        height: 100%;
        width: 100%;
      }
      #map-frame {
        border: 0;
        width: 100%;
        height: 100%;
      }
    </style>
  </head>
  <body>
    <iframe
      id="map-frame"
      src="https://www.openstreetmap.org/export/embed.html?bbox=106.650172,10.752622,106.670172,10.772622&layer=mapnik&marker=10.762622,106.660172"
    ></iframe>
  </body>
</html>
`;

/**
 * FootStepMapHeader
 * - Header + map hiển thị hành trình đi bộ
 * - Phần trên: nút back, trạng thái GPS, nút setting
 * - Phần dưới: bản đồ OpenStreetMap render bằng WebView
 */
const FootStepMapHeader: React.FC<Props> = ({ onBack }) => {
  /**
   * State lưu lỗi load map (nếu có)
   * - null: map load bình thường
   * - string: nội dung lỗi
   */
  const [mapError, setMapError] = useState<string | null>(null);

  return (
    <View style={styles.mapContainer}>
      {/* ================= Header ================= */}
      <View style={styles.topHeader}>
        {/* Nút quay lại */}
        <TouchableOpacity
          style={styles.circleIconButton}
          onPress={onBack}
          activeOpacity={0.7}
        >
          <ArrowLeftIcon width={18} height={18} color={theme.colors.text} />
        </TouchableOpacity>

        {/* Badge trạng thái GPS */}
        <View style={styles.gpsBadge}>
          <Text style={styles.gpsText}>GPS SIGNAL</Text>
        </View>

        {/* Nút setting (chưa xử lý logic) */}
        <TouchableOpacity style={styles.circleIconButton} activeOpacity={0.7}>
          <SettingIcon width={18} height={18} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      {/* ================= Map Area ================= */}
      <View style={styles.mapWrapper}>
        {mapError ? (
          // Fallback UI khi map bị lỗi
          <View style={styles.mapFallback}>
            <Text style={styles.mapFallbackText}>Map error: {mapError}</Text>
          </View>
        ) : (
          // WebView hiển thị OpenStreetMap
          <WebView
            style={{ flex: 1 }}
            originWhitelist={['*']}
            javaScriptEnabled
            domStorageEnabled
            source={{ html: MAP_HTML }}
            onError={e =>
              setMapError(e.nativeEvent.description || 'Unknown error')
            }
          />
        )}
      </View>
    </View>
  );
};

export default FootStepMapHeader;
