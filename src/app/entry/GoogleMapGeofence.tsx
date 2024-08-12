import React from "react";
import { GoogleMap, LoadScript, Circle } from "@react-google-maps/api";
import { env } from "process";
import {
  GEOFENCE_RADIUS,
  HOSTEL_LATITUDE,
  HOSTEL_LONGITUDE,
} from "@/lib/utils";

const containerStyle = {
  width: "100%",
  height: "400px",
};

// Hostel's coordinates
const center = {
  lat: HOSTEL_LATITUDE,
  lng: HOSTEL_LONGITUDE,
};

interface GoogleMapGeofenceProps {
  userLocation: google.maps.LatLngLiteral | null;
}

const GoogleMapGeofence: React.FC<GoogleMapGeofenceProps> = ({
  userLocation,
}) => {
  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_API as string}>
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={18}>
        {/* Geofence circle */}
        <Circle
          center={center}
          radius={GEOFENCE_RADIUS}
          options={{
            fillColor: "rgba(0, 255, 0, 0.1)",
            strokeColor: "green",
            strokeOpacity: 0.8,
            strokeWeight: 2,
          }}
        />

        {/* User's location marker */}
        {userLocation && (
          <Circle
            center={userLocation}
            radius={5}
            options={{
              fillColor: "blue",
              strokeColor: "blue",
              strokeOpacity: 1,
              strokeWeight: 1,
            }}
          />
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default GoogleMapGeofence;
