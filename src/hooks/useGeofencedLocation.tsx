import {
  calculateDistance,
  GEOFENCE_RADIUS,
  HOSTEL_LATITUDE,
  HOSTEL_LONGITUDE,
} from "@/lib/utils";
import { useState, useEffect } from "react";

interface GeofencedLocationState {
  isWithinGeofence: boolean;
  accuracy: number | null;
  error: string | null;
}

export function useGeofencedLocation(): GeofencedLocationState {
  const [state, setState] = useState<GeofencedLocationState>({
    isWithinGeofence: false,
    accuracy: null,
    error: null,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        error: "Geolocation is not supported by your browser",
      }));
      return;
    }

    const handleSuccess = (position: GeolocationPosition) => {
      const { latitude, longitude, accuracy } = position.coords;
      const distance = calculateDistance(
        latitude,
        longitude,
        HOSTEL_LATITUDE,
        HOSTEL_LONGITUDE,
      );
      const isWithinGeofence = distance <= GEOFENCE_RADIUS;
      setState({ isWithinGeofence, accuracy, error: null });
    };

    const handleError = (error: GeolocationPositionError) => {
      setState((prev) => ({ ...prev, error: error.message }));
    };

    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };

    const watchId = navigator.geolocation.watchPosition(
      handleSuccess,
      handleError,
      options,
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return state;
}
