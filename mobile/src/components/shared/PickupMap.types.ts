export type PickupMapProps = {
  latitude?: number;
  longitude?: number;
  onLocationChange: (latitude: number, longitude: number, address?: string) => void;
};
