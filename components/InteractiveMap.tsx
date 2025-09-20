"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

type LayerType = L.Marker | L.Polyline | L.Polygon | L.Circle | L.Rectangle;

const InteractiveMap = () => {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const KOLKATA_LOCATION: L.LatLngExpression = [22.4829, 88.3948];

  const createIcon = (color: string = "blue"): L.DivIcon => {
    return L.divIcon({
      className: `custom-marker marker-${color}`,
      html: `<div class="marker-pin"></div>`,
      iconSize: [30, 42],
      iconAnchor: [15, 42],
    });
  };

  useEffect(() => {
    setIsMounted(true);
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!isMounted || typeof window === "undefined") return;
    if (!containerRef.current || mapRef.current) return;

    mapRef.current = L.map(containerRef.current, {
      zoomControl: true,
      dragging: true,
      scrollWheelZoom: true,
      doubleClickZoom: true,
      boxZoom: true,
    }).setView(KOLKATA_LOCATION, 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(mapRef.current);

    L.marker(KOLKATA_LOCATION, {
      icon: createIcon("red"),
    })
      .addTo(mapRef.current)
      .bindPopup(
        `
      <div class="map-popup">
        <strong>360 Panchasayar</strong><br>
        Kolkata – 700094<br>
        West Bengal, India
      </div>
    `
      )
      .openPopup();
  }, [isMounted]);

  const handleFindNearestLocation = () => {
    if (!mapRef.current) return;

    setIsFullscreen(true);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const userLocation: L.LatLngExpression = [latitude, longitude];

          mapRef.current?.eachLayer((layer: LayerType) => {
            if (layer instanceof L.Marker || layer instanceof L.Polyline) {
              mapRef.current?.removeLayer(layer);
            }
          });

          mapRef.current?.flyTo(userLocation, 13);

          L.marker(userLocation, {
            icon: createIcon("blue"),
          })
            .addTo(mapRef.current)
            .bindPopup("Your Location")
            .openPopup();

          L.marker(KOLKATA_LOCATION, {
            icon: createIcon("red"),
          }).addTo(mapRef.current).bindPopup(`
            <div class="map-popup">
              <strong>360 Panchasayar</strong><br>
              Kolkata – 700094<br>
              West Bengal, India
            </div>
          `);

          L.polyline([userLocation, KOLKATA_LOCATION], {
            color: "#0284c7",
            weight: 3,
            dashArray: "5, 5",
          }).addTo(mapRef.current);
        },
        (error) => {
          console.error("Geolocation error:", error);
          alert(
            "Could not get your location. Please enable location services."
          );
        }
      );
    } else {
      alert("Geolocation is not supported by your browser");
    }
  };

  if (!isMounted) {
    return <div className="h-[400px] bg-gray-200 rounded-xl animate-pulse" />;
  }

  return (
    <div
      className={`relative ${
        isFullscreen
          ? "fixed inset-0 z-[9999] h-[100dvh] w-[100dvw]"
          : "h-[400px] rounded-xl overflow-hidden shadow-md"
      }`}
    >
      <div
        ref={containerRef}
        className="h-full w-full"
        style={isFullscreen ? { height: "100dvh", width: "100dvw" } : {}}
      />

      {!isFullscreen && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6 pointer-events-none">
          <button
            onClick={handleFindNearestLocation}
            className="bg-[#0284c7] hover:bg-[#0369a1] text-white px-4 py-2 rounded-md transition-colors pointer-events-auto"
          >
            Find Nearest Location
          </button>
        </div>
      )}

      {isFullscreen && (
        <div className="absolute top-4 left-4 z-[10000]">
          <button
            onClick={() => setIsFullscreen(false)}
            className="bg-white hover:bg-gray-100 text-gray-800 px-4 py-2 rounded-md shadow-md transition-colors flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Back to App
          </button>
        </div>
      )}
    </div>
  );
};

export default InteractiveMap;
