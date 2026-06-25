import React, { useEffect, useMemo, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MapView, { Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { styles as externalStyles } from './styles';
import { useFootStepMap } from './useFootStepMap';
import { FootStepMapProps } from './types';
import ArrowLeftIcon from '@assets/icons/svgs/arrow_left_2424.svg';

const DARK_MAP_STYLE = [
  { elementType: 'geometry', stylers: [{ color: '#0d1b2a' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#7a94b0' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#0a0f1c' }] },
  {
    featureType: 'administrative',
    elementType: 'geometry',
    stylers: [{ color: '#1c2840' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#1c2840' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#0f1928' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#243050' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#061622' }],
  },
  {
    featureType: 'landscape',
    elementType: 'geometry',
    stylers: [{ color: '#0d1b2a' }],
  },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
];

const FootStepMapHeader: React.FC<
  FootStepMapProps & { isTracking?: boolean }
> = ({ onBack, routeSample = [], currentLat, currentLng, isTracking }) => {
  const { mapRef, isMapReadyRef, DEFAULT_REGION, centerMap } = useFootStepMap();
  const hasFirstJump = useRef(false);

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
      {/* HEADER OVERLAY */}
      <View style={localStyles.headerOverlay}>
        <TouchableOpacity
          style={externalStyles.circleIconButton}
          onPress={onBack}
        >
          <ArrowLeftIcon
            width={18}
            height={18}
            fill="#EFF6FF"
            color="#EFF6FF"
          />
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
            {currentLat ? 'ĐANG THEO DÕI' : 'TÌM GPS…'}
          </Text>
        </View>

        <TouchableOpacity
          style={externalStyles.circleIconButton}
          onPress={() => {
            if (currentLat && currentLng) centerMap(currentLat, currentLng);
          }}
        >
          <Text style={externalStyles.touch}>⊕</Text>
        </TouchableOpacity>
      </View>

      {/* MAP */}
      <View style={localStyles.mapWrapper}>
        <MapView
          ref={mapRef}
          style={StyleSheet.absoluteFill}
          provider={PROVIDER_GOOGLE}
          initialRegion={DEFAULT_REGION}
          customMapStyle={DARK_MAP_STYLE}
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
              strokeColor="#4F8EF7"
              strokeWidth={4}
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
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  mapWrapper: { flex: 1, zIndex: 1 },
});

export default FootStepMapHeader;
