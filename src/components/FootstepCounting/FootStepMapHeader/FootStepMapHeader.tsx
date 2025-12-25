import React, { useEffect, useMemo, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MapView, { Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { styles as externalStyles } from './styles';
import { useFootStepMap } from './useFootStepMap';
import { FootStepMapProps } from './types';
import { theme } from '@assets/theme';
import ArrowLeftIcon from '@assets/icons/svgs/arrow_left_2424.svg';

const FootStepMapHeader: React.FC<
  FootStepMapProps & { isTracking?: boolean }
> = ({ onBack, routeSample = [], currentLat, currentLng, isTracking }) => {
  const { mapRef, isMapReadyRef, DEFAULT_REGION, centerMap } = useFootStepMap();
  const hasFirstJump = useRef(false);

  // Nhảy Map khi có tọa độ và map đã sẵn sàng hoặc vừa bấm Start
  useEffect(() => {
    if (currentLat && currentLng && isMapReadyRef.current) {
      if (!hasFirstJump.current || isTracking) {
        centerMap(currentLat, currentLng);
        if (!isTracking) hasFirstJump.current = true;
      }
    }
  }, [currentLat, currentLng, isTracking, centerMap, isMapReadyRef]);

  const polylineCoords = useMemo(
    () => routeSample.map(p => ({ latitude: p.lat, longitude: p.lng })),
    [routeSample],
  );

  return (
    <View style={localStyles.container}>
      {/* THANH HEADER */}
      <View style={[externalStyles.topHeader, localStyles.headerOverlay]}>
        <TouchableOpacity
          style={externalStyles.circleIconButton}
          onPress={onBack}
        >
          <ArrowLeftIcon width={18} height={18} />
        </TouchableOpacity>

        <View style={externalStyles.gpsBadge}>
          <View
            style={[
              externalStyles.dot,
              currentLat
                ? externalStyles.currentActive
                : externalStyles.currentSearch,
            ]}
          />
          <Text style={externalStyles.gpsText}>
            {currentLat ? 'GPS ACTIVE' : 'SEARCHING...'}
          </Text>
        </View>

        <TouchableOpacity
          style={externalStyles.circleIconButton}
          onPress={() => {
            if (currentLat && currentLng) centerMap(currentLat, currentLng);
          }}
        >
          <Text style={externalStyles.touch}>🎯</Text>
        </TouchableOpacity>
      </View>

      {/* BẢN ĐỒ */}
      <View style={localStyles.mapWrapper}>
        <MapView
          ref={mapRef}
          style={StyleSheet.absoluteFill}
          provider={PROVIDER_GOOGLE}
          initialRegion={DEFAULT_REGION}
          onMapReady={() => {
            isMapReadyRef.current = true;
            if (currentLat && currentLng) centerMap(currentLat, currentLng);
          }}
          showsUserLocation={true}
          showsMyLocationButton={false}
          showsCompass={false}
        >
          {polylineCoords.length > 1 && (
            <Polyline
              coordinates={polylineCoords}
              strokeColor={theme.colors.primary}
              strokeWidth={6}
              lineJoin="round"
              lineCap="round"
            />
          )}
        </MapView>
      </View>
    </View>
  );
};

const localStyles = StyleSheet.create({
  container: { flex: 1 },
  headerOverlay: {
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
    zIndex: 99,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    backgroundColor: 'transparent',
  },
  mapWrapper: { flex: 1, zIndex: 1 },
});

export default FootStepMapHeader;
