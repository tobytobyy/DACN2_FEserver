// src/components/FootStepCounting/FootStepMapHeader.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import WebView from 'react-native-webview';

import { theme } from '@assets/theme';
import ArrowLeftIcon from '@assets/icons/svgs/arrow_left_2424.svg';
import SettingIcon from '@assets/icons/svgs/setting_2424.svg';

type Props = {
  onBack: () => void;
};

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

const FootStepMapHeader: React.FC<Props> = ({ onBack }) => {
  const [mapError, setMapError] = useState<string | null>(null);

  return (
    <View style={styles.mapContainer}>
      {/* Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity
          style={styles.circleIconButton}
          onPress={onBack}
          activeOpacity={0.7}
        >
          <ArrowLeftIcon width={18} height={18} color={theme.colors.text} />
        </TouchableOpacity>

        <View style={styles.gpsBadge}>
          <Text style={styles.gpsText}>GPS SIGNAL</Text>
        </View>

        <TouchableOpacity style={styles.circleIconButton} activeOpacity={0.7}>
          <SettingIcon width={18} height={18} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      {/* Map (OpenStreetMap qua WebView) */}
      <View style={styles.mapWrapper}>
        {mapError ? (
          <View style={styles.mapFallback}>
            <Text style={styles.mapFallbackText}>Map error: {mapError}</Text>
          </View>
        ) : (
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

const styles = StyleSheet.create({
  mapContainer: {
    flex: 1.1,
    backgroundColor: '#E5E7EB',
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.sm,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  circleIconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  gpsBadge: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: 999,
    backgroundColor: theme.colors.white,
    elevation: 2,
  },
  gpsText: {
    fontSize: theme.fonts.size.xs,
    fontFamily: theme.fonts.poppins.bold,
    color: theme.colors.text,
  },
  mapWrapper: {
    flex: 1,
    marginTop: theme.spacing.lg,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#E5E5E5',
  },
  mapFallback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapFallbackText: {
    color: '#444',
    fontSize: 14,
  },
});
