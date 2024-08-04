import { useState, useEffect } from "react";

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  error: string | null;
}

export function useGeolocation(): GeolocationState {
  const [location, setLocation] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    accuracy: null,
    error: null,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation((prev) => ({
        ...prev,
        error: "Geolocation is not supported by your browser",
      }));
      return;
    }

    const handleSuccess = (position: GeolocationPosition) => {
      const { latitude, longitude, accuracy } = position.coords;
      setLocation({ latitude, longitude, accuracy, error: null });
    };

    const handleError = (error: GeolocationPositionError) => {
      setLocation((prev) => ({ ...prev, error: error.message }));
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

  return location;
}
