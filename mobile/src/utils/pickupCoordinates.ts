export function isValidPickupCoordinates(latitude: unknown, longitude: unknown): boolean {
  return typeof latitude === 'number' && Number.isFinite(latitude) && latitude >= -90 && latitude <= 90
    && typeof longitude === 'number' && Number.isFinite(longitude) && longitude >= -180 && longitude <= 180;
}

export function parsePickupCoordinate(value: string | number | null | undefined, limit: number): number | undefined {
  if (value == null || (typeof value === 'string' && !value.trim())) return undefined;
  const number = Number(value);
  return Number.isFinite(number) && Math.abs(number) <= limit ? number : undefined;
}
