"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation"; // For accessing params dynamically
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { FaPhone } from "react-icons/fa";
import { FiMenu } from "react-icons/fi";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { useRouter } from "next/navigation";
import L from "leaflet";
import Image from "next/image";

const JobDetails = () => {
  const params = useParams(); // Dynamically access `params`
  const { id } = params; // Access the `id` from `params`

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
  const [jobDetails, setJobDetails] = useState<{
    origin: string | undefined;
    destination: string | undefined;
    price: number;
    status: string;
    itemDescription: string;
    customer_name: string;
    customer_phone_number: string;
    user: { first_name: string; last_name: string; phone_number: string };
  } | null>(null);
  const router = useRouter();
  const [routeCoordinates, setRouteCoordinates] = useState<any[]>([]);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const [userId] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("userId");
    }
    return null; // default value for SSR
  });

  const handleOrderComplete = async (orderId: number) => {
    try {
      await fetch(
        `https://liytapi.fenads.org/orders/${orderId}/complete/${userId}`,
        { method: "GET" }
      );

      // Navigate to the Driver page after completing the order
      router.push(`/Driver`); // Redirect to Driver page
    } catch (error) {
      console.error("Failed to accept job:", error);
    }
  };

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  useEffect(() => {
    if (id) {
      fetch(`https://liytapi.fenads.org/orders/${id}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          setJobDetails(data);

          // Ensure origin and destination have default values if not provided
          const origin = data.origin || "0,0"; // Default to "0,0" if not available
          const destination = data.destination || "0,0"; // Default to "0,0" if not available

          fetchRoute(origin, destination); // Fetch route after getting job details
        })
        .catch((error) => console.error("Error fetching job details:", error));
    }
  }, [id]);

  const fetchRoute = async (origin: string, destination: string) => {
    if (origin && destination) {
      try {
        const response = await fetch(
          `https://liytapi.fenads.org/orders/get_price?origin=${origin}&destination=${destination}`
        );
        const data = await response.json();
        setRouteCoordinates(data.payload.directions);
      } catch (error) {
        console.error("Error fetching route:", error);
      }
    }
  };

  if (!jobDetails) {
    return <p>Loading...</p>;
  }

  const {
    origin,
    destination,
    price,
    status,
    itemDescription = "Red T-shirt",
    customer_name,
    customer_phone_number,
    user: sender,
  } = jobDetails;

  const isValidCoordinate = (lat: number, lon: number): boolean => {
    return (
      typeof lat === "number" &&
      typeof lon === "number" &&
      lat >= -90 &&
      lat <= 90 &&
      lon >= -180 &&
      lon <= 180
    );
  };

  // Set default coordinates if origin and destination are not provided
  const originLatLng: [number, number] =
    origin && typeof origin === "string"
      ? (origin.split(",").map((coord) => parseFloat(coord)) as [
          number,
          number
        ])
      : [9.04, 38.75];
  const destinationLatLng: [number, number] = destination
    ? (destination.split(",").map((coord) => parseFloat(coord)) as [
        number,
        number
      ])
    : [9.04, 38.75];

  // Validate coordinates, and fallback to default if invalid
  const validOriginLatLng = isValidCoordinate(originLatLng[0], originLatLng[1])
    ? originLatLng
    : [9.04, 38.75];
  const validDestinationLatLng = isValidCoordinate(
    destinationLatLng[0],
    destinationLatLng[1]
  )
    ? destinationLatLng
    : [9.04, 38.75];

  const centerLatLng: [number, number] = [
    (validOriginLatLng[0] + validDestinationLatLng[0]) / 2,
    (validOriginLatLng[1] + validDestinationLatLng[1]) / 2,
  ];

  return (
    <div className="relative min-h-screen">
      <div className="w-full p-4 bg-gradient-to-r from-purple-600 to-blue-400 text-white flex items-center justify-between shadow-md fixed top-0 z-20">
        <FiMenu size={24} className="cursor-pointer" />
        <Image
          src="/img/logo.png"
          alt="LIYT Logo"
          className="h-10"
          width={100}
          height={100}
        />
      </div>

      <div className="absolute inset-0 z-10">
        <MapContainer
          key={centerLatLng.join(",")}
          center={centerLatLng}
          zoom={13}
          style={{ height: "100vh", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          <Marker
            icon={originIcon}
            position={validOriginLatLng as [number, number]}
          >
            <Popup>Origin</Popup>
          </Marker>
          <Marker
            icon={markerIcon}
            position={validDestinationLatLng as [number, number]}
          >
            <Popup>Destination</Popup>
          </Marker>

          {/* Polyline for the route path from API */}
          <Polyline positions={routeCoordinates} color="blue" />
        </MapContainer>
      </div>

      <div
        className={`absolute bottom-0 left-0 right-0 z-30 p-4 bg-white bg-opacity-90 rounded-t-lg shadow-lg mx-4 mb-4 text-gray-800 transition-transform duration-300 ${
          isCollapsed
            ? "transform translate-y-[90%]"
            : "transform translate-y-0"
        }`}
      >
        <button
          className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-purple-700 text-white rounded-full p-2 shadow-md"
          onClick={toggleCollapse}
        >
          {isCollapsed ? (
            <IoIosArrowUp size={24} />
          ) : (
            <IoIosArrowDown size={24} />
          )}
        </button>

        {!isCollapsed && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="font-bold">Sender</p>
                <p>
                  {sender.first_name} {sender.last_name}
                </p>
                <a
                  href={`tel:${sender.phone_number}`}
                  className="flex items-center text-blue-500 mt-1"
                >
                  <FaPhone className="mr-1" /> {sender.phone_number}
                </a>
              </div>
              <div>
                <p className="font-bold">Receiver</p>
                <p>{customer_name}</p>
                <a
                  href={`tel:${customer_phone_number}`}
                  className="flex items-center text-blue-500 mt-1"
                >
                  <FaPhone className="mr-1" /> {customer_phone_number}
                </a>
              </div>
            </div>

            <div className="mb-4">
              <p className="font-bold">Item</p>
              <p>{itemDescription}</p>
              <p className="text-sm text-gray-600">Order ID: {id}</p>
              <p className="text-purple-600">Status: {status}</p>
            </div>

            <div className="mb-4">
              <p className="font-bold">Route</p>
              <p>
                {origin} ➔ {destination}
              </p>
              <p className="font-bold mt-2">Estimated Price: Birr {price}</p>
            </div>

            <button
              className="w-full py-2 bg-purple-700 text-white font-bold rounded-lg mt-6"
              onClick={(e) => {
                e.stopPropagation();
                handleOrderComplete(Number(id));
              }}
            >
              Order Completed
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDetails;
