import {
  ACCURACCY_THRESHOLD,
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
  userLocation: { lat: number; lng: number } | null;
}

export function useGeofencedLocation(): GeofencedLocationState {
  const [state, setState] = useState<GeofencedLocationState>({
    isWithinGeofence: false,
    accuracy: null,
    error: null,
    userLocation: null,
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
      if (accuracy > ACCURACCY_THRESHOLD) {
        setState((prev) => ({
          ...prev,
          error: `Location accuracy  is too low. Please try again in a more open area.`,
          userLocation: { lat: latitude, lng: longitude },
        }));
        return;
      }
      const distance = calculateDistance(
        latitude,
        longitude,
        HOSTEL_LATITUDE,
        HOSTEL_LONGITUDE,
      );
      const isWithinGeofence = distance <= GEOFENCE_RADIUS;
      setState({
        isWithinGeofence,
        accuracy,
        error: null,
        userLocation: { lat: latitude, lng: longitude },
      });
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
