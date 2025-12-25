// Định nghĩa kiểu dữ liệu dùng chung
export type LatLng = {
  lat: number;
  lng: number;
};

export type FootStepMapProps = {
  onBack: () => void;
  routeSample?: LatLng[];
  currentLat?: number | null;
  currentLng?: number | null;
};
