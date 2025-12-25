// useFootStepMap.ts
import { useRef, useCallback } from 'react';
import MapView, { Region } from 'react-native-maps';

export const useFootStepMap = () => {
  const mapRef = useRef<MapView>(null);
  const isMapReadyRef = useRef(false);

  const DEFAULT_REGION: Region = {
    latitude: 10.762622,
    longitude: 106.660172,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  const centerMap = useCallback((lat?: number | null, lng?: number | null) => {
    if (lat && lng && mapRef.current) {
      mapRef.current.animateCamera(
        {
          center: { latitude: lat, longitude: lng },
          pitch: 0,
          heading: 0,
          altitude: 1000,
          zoom: 17, // Zoom gần vào để thấy rõ đường đi
        },
        { duration: 800 },
      );
    }
  }, []);

  return { mapRef, isMapReadyRef, DEFAULT_REGION, centerMap };
};
