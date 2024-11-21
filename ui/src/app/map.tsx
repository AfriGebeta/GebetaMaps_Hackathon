import React, { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface MapProps {
  zoom: number;
  h: number;
  destination: any;
  origin: any;
  routeCoordinates: any;
}

const MapComponent: React.FC<MapProps> = ({
  zoom,
  h,
  origin,
  destination,
  routeCoordinates,
}) => {
  const mapRefi: any = useRef();

  const center = [9.010947259288999, 38.761515309323606];

  const markerIcon = new L.Icon({
    iconUrl: "/location.svg",
    iconSize: [40, 40],
    iconAnchor: [17, 46], //[left/right, top/bottom]
    popupAnchor: [0, -46], //[left/right, top/bottom]
  });
  const originIcon = new L.Icon({
    iconUrl: "/bluelocation.svg",
    iconSize: [40, 40],
    iconAnchor: [17, 46], //[left/right, top/bottom]
    popupAnchor: [0, -46], //[left/right, top/bottom]
  });

  useEffect(() => {
    // Logic to update the map with new routeCoordinates
    if (routeCoordinates.length > 0) {
      drawRoute(routeCoordinates);
    }
  }, [routeCoordinates]);

  const drawRoute = (coordinates: any) => {
    // Implement your map library's logic to draw the route
    console.log("Drawing route:", coordinates);
  };

  return (
    <>
      <MapContainer
        center={center as any}
        zoom={zoom}
        ref={mapRefi}
        style={{ height: `${h}vh`, width: "100%" }}
      >
        {origin.lat && origin.lon && (
          <Marker icon={originIcon} position={[origin.lat, origin.lon]} />
        )}
        {destination.lat && destination.lon && (
          <Marker
            icon={markerIcon}
            position={[destination.lat, destination.lon]}
          />
        )}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          // attribution={osm.maptiler.attribution}
        />
        <Polyline positions={routeCoordinates} color="blue" />
      </MapContainer>
    </>
  );
};

export default MapComponent;
