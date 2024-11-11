import React, { useEffect, useState, useRef } from "react";
import app, { auth, db } from "./firebase-config";
// import dotenv from "dotenv";
import "./App.css";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { LatLng, latLng } from "leaflet";

const ico = L.divIcon({
  className: "cutomMark",
  html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                <path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z" />
              </svg>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

// dotenv.config();

function SidePanel({target}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("places");
  const [showSearchResults, setShowSearchResults] = useState(false);

  const [nearbyPlaceSearch, setNearbySearch] = useState(null);
  const [nearbyGebetaSearch, setNearbyGebeta] = useState(null);

  const [navigateCoord, setNavigateCoor] = useState();

  const placeholderPlaces = [
    { name: "Coffee Shop", distance: "0.2 km", reviewed: true, rating: 4.5 },
    { name: "Park", distance: "0.5 km", reviewed: false },
    { name: "Grocery Store", distance: "0.8 km", reviewed: true, rating: 3.8 },
    { name: "Restaurant", distance: "1.2 km", reviewed: true, rating: 4.2 },
    { name: "Gym", distance: "1.5 km", reviewed: false },
    { name: "Bookstore", distance: "0.7 km", reviewed: true, rating: 4.0 },
    { name: "Cinema", distance: "2.0 km", reviewed: false },
    { name: "Bakery", distance: "0.3 km", reviewed: true, rating: 4.7 },
  ];

  const filteredPlaces = placeholderPlaces.filter((place) =>
    place.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const reviewedPlaces = filteredPlaces.filter((place) => place.reviewed);
  const unreviewedPlaces = filteredPlaces.filter((place) => !place.reviewed);

  const fetchGebetaPlaces = async (term) => {
    setNearbyGebeta(null);
    console.log("This is your token", process.env.token);
    try {
      const response = await fetch(
        `https://mapapi.gebeta.app/api/v1/route/geocoding?name=${term}&apiKey=`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json().then((data) => {
        setNearbyGebeta(data.data);
      });

      console.log("Success:", data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const renderPlaces = (places) => {
    return places.map((place, index) => (
      <li key={index} className="mb-2 p-2 bg-gray-100 rounded">
        <p className="font-semibold">{place.name}</p>
        <p className="text-sm text-gray-600">Distance: {place.distance}</p>
        {place.reviewed && (
          <p className="text-sm text-blue-600">Rating: {place.rating}</p>
        )}
      </li>
    ));
  };
  const renderUnreviewed = (places) => {
    return places == null ? (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid"
        style={{shapeRendering: "auto", display: "block", background: "transparent"}}
        width="100%"
        height="200"
      >
        <g>
          <circle fill="#464646" r="10" cy="50" cx="84">
            <animate
              begin="0s"
              keySplines="0 0.5 0.5 1"
              values="10;0"
              keyTimes="0;1"
              calcMode="spline"
              dur="0.25s"
              repeatCount="indefinite"
              attributeName="r"
            ></animate>
            <animate
              begin="0s"
              values="#464646;#464646;#dfdfdf;#a0a0a0;#464646"
              keyTimes="0;0.25;0.5;0.75;1"
              calcMode="discrete"
              dur="1s"
              repeatCount="indefinite"
              attributeName="fill"
            ></animate>
          </circle>
          <circle fill="#464646" r="10" cy="50" cx="16">
            <animate
              begin="0s"
              keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1"
              values="0;0;10;10;10"
              keyTimes="0;0.25;0.5;0.75;1"
              calcMode="spline"
              dur="1s"
              repeatCount="indefinite"
              attributeName="r"
            ></animate>
            <animate
              begin="0s"
              keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1"
              values="16;16;16;50;84"
              keyTimes="0;0.25;0.5;0.75;1"
              calcMode="spline"
              dur="1s"
              repeatCount="indefinite"
              attributeName="cx"
            ></animate>
          </circle>
          <circle fill="#a0a0a0" r="10" cy="50" cx="50">
            <animate
              begin="-0.25s"
              keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1"
              values="0;0;10;10;10"
              keyTimes="0;0.25;0.5;0.75;1"
              calcMode="spline"
              dur="1s"
              repeatCount="indefinite"
              attributeName="r"
            ></animate>
            <animate
              begin="-0.25s"
              keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1"
              values="16;16;16;50;84"
              keyTimes="0;0.25;0.5;0.75;1"
              calcMode="spline"
              dur="1s"
              repeatCount="indefinite"
              attributeName="cx"
            ></animate>
          </circle>
          <circle fill="#dfdfdf" r="10" cy="50" cx="84">
            <animate
              begin="-0.5s"
              keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1"
              values="0;0;10;10;10"
              keyTimes="0;0.25;0.5;0.75;1"
              calcMode="spline"
              dur="1s"
              repeatCount="indefinite"
              attributeName="r"
            ></animate>
            <animate
              begin="-0.5s"
              keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1"
              values="16;16;16;50;84"
              keyTimes="0;0.25;0.5;0.75;1"
              calcMode="spline"
              dur="1s"
              repeatCount="indefinite"
              attributeName="cx"
            ></animate>
          </circle>
          <circle fill="#464646" r="10" cy="50" cx="16">
            <animate
              begin="-0.75s"
              keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1"
              values="0;0;10;10;10"
              keyTimes="0;0.25;0.5;0.75;1"
              calcMode="spline"
              dur="1s"
              repeatCount="indefinite"
              attributeName="r"
            ></animate>
            <animate
              begin="-0.75s"
              keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1"
              values="16;16;16;50;84"
              keyTimes="0;0.25;0.5;0.75;1"
              calcMode="spline"
              dur="1s"
              repeatCount="indefinite"
              attributeName="cx"
            ></animate>
          </circle>
          <g></g>
        </g>
      </svg>
    ) : (
      places.map((place, index) => (
        <li key={index} className="mb-2 p-2 bg-gray-100 rounded cursor-pointer hover:bg-gray-300 transition-colors" onClick={target({lat: place.latitude, lon: place.longitude})}>
          <p className="font-semibold">{place.name}</p>
          <p className="text-sm text-gray-600">Distance: 1.0km</p>
          <p className="text-sm text-blue-600">Type: {place.type}</p>
        </li>
      ))
    );
  };

  const handleSearchChange = (e) => {
    fetchGebetaPlaces(e.target.value);
    setSearchTerm(e.target.value);
    setShowSearchResults(e.target.value.length > 0);
  };

  const placeholderPeople = [
    { name: "John Doe", distance: "0.3 km" },
    { name: "Jane Smith", distance: "0.7 km" },
    { name: "Mike Johnson", distance: "1.0 km" },
    { name: "Emily Brown", distance: "1.4 km" },
  ];

  const placeholderEvents = [
    { name: "Local Concert", distance: "0.5 km", date: "2024-11-15" },
    { name: "Art Exhibition", distance: "0.9 km", date: "2024-11-20" },
    { name: "Food Festival", distance: "1.3 km", date: "2024-11-25" },
    { name: "Charity Run", distance: "1.8 km", date: "2024-11-30" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "places":
        return placeholderPlaces.map((place, index) => (
          <li key={index} className="mb-2 p-2 bg-gray-100 rounded">
            <p className="font-semibold">{place.name}</p>
            <p className="text-sm text-gray-600">Distance: {place.distance}</p>
          </li>
        ));
      case "people":
        return placeholderPeople.map((person, index) => (
          <li key={index} className="mb-2 p-2 bg-gray-100 rounded">
            <p className="font-semibold">{person.name}</p>
            <p className="text-sm text-gray-600">Distance: {person.distance}</p>
          </li>
        ));
      case "events":
        return placeholderEvents.map((event, index) => (
          <li key={index} className="mb-2 p-2 bg-gray-100 rounded">
            <p className="font-semibold">{event.name}</p>
            <p className="text-sm text-gray-600">Distance: {event.distance}</p>
            <p className="text-sm text-gray-600">Date: {event.date}</p>
          </li>
        ));
      default:
        return null;
    }
  };

  return (
    <div
      className="rounded-lg bg-white p-4 overflow-y-auto h-full flex flex-col"
      style={{ maxHeight: "80dvh" }}
    >
      <input
        type="text"
        placeholder="Search places..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="w-full p-2 mb-4 border rounded"
      />
      {showSearchResults && (
        <div className="absolute top-16 left-0 right-0 bg-white border rounded shadow-lg z-10 max-h-96 overflow-y-auto">
          <div className="p-4">
            <h3 className="text-lg font-bold mb-2">Reviewed Places</h3>
            <ul className="mb-4">{renderPlaces(reviewedPlaces)}</ul>
            <h3 className="text-lg font-bold mb-2">Unreviewed Places</h3>
            <ul>{renderUnreviewed(nearbyGebetaSearch)}</ul>
          </div>
        </div>
      )}
      <div className="flex mb-4">
        <button
          className={`flex-1 py-2 ${
            activeTab === "places" ? "bg-gray-700 text-white" : "bg-gray-200"
          } flex flex-col justify-center items-center`}
          onClick={() => setActiveTab("places")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 576 512"
            width="32px"
            height="32px"
            fill={activeTab === "places" ? "#fff" : "#000"}
          >
            <path d="M408 120c0 54.6-73.1 151.9-105.2 192c-7.7 9.6-22 9.6-29.6 0C241.1 271.9 168 174.6 168 120C168 53.7 221.7 0 288 0s120 53.7 120 120zm8 80.4c3.5-6.9 6.7-13.8 9.6-20.6c.5-1.2 1-2.5 1.5-3.7l116-46.4C558.9 123.4 576 135 576 152l0 270.8c0 9.8-6 18.6-15.1 22.3L416 503l0-302.6zM137.6 138.3c2.4 14.1 7.2 28.3 12.8 41.5c2.9 6.8 6.1 13.7 9.6 20.6l0 251.4L32.9 502.7C17.1 509 0 497.4 0 480.4L0 209.6c0-9.8 6-18.6 15.1-22.3l122.6-49zM327.8 332c13.9-17.4 35.7-45.7 56.2-77l0 249.3L192 449.4 192 255c20.5 31.3 42.3 59.6 56.2 77c20.5 25.6 59.1 25.6 79.6 0zM288 152a40 40 0 1 0 0-80 40 40 0 1 0 0 80z" />
          </svg>
          Places
        </button>
        <button
          className={`flex-1 py-2 ${
            activeTab === "people" ? "bg-gray-700 text-white" : "bg-gray-200"
          } flex flex-col justify-center items-center`}
          onClick={() => setActiveTab("people")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            width="32px"
            height="32px"
            fill={activeTab === "people" ? "#fff" : "#000"}
          >
            <path d="M256 288A144 144 0 1 0 256 0a144 144 0 1 0 0 288zm-94.7 32C72.2 320 0 392.2 0 481.3c0 17 13.8 30.7 30.7 30.7l450.6 0c17 0 30.7-13.8 30.7-30.7C512 392.2 439.8 320 350.7 320l-189.4 0z" />
          </svg>
          People
        </button>
        <button
          className={`flex-1 py-2 ${
            activeTab === "events" ? "bg-gray-700 text-white" : "bg-gray-200"
          } flex flex-col justify-center items-center`}
          onClick={() => setActiveTab("events")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
            width="32px"
            height="32px"
            fill={activeTab === "events" ? "#fff" : "#000"}
          >
            <path d="M128 0c17.7 0 32 14.3 32 32l0 32 128 0 0-32c0-17.7 14.3-32 32-32s32 14.3 32 32l0 32 48 0c26.5 0 48 21.5 48 48l0 48L0 160l0-48C0 85.5 21.5 64 48 64l48 0 0-32c0-17.7 14.3-32 32-32zM0 192l448 0 0 272c0 26.5-21.5 48-48 48L48 512c-26.5 0-48-21.5-48-48L0 192zm64 80l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16zm128 0l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16zm144-16c-8.8 0-16 7.2-16 16l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0zM64 400l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16zm144-16c-8.8 0-16 7.2-16 16l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0zm112 16l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16z" />
          </svg>
          Events
        </button>
      </div>
      <h2 className="text-xl font-bold mb-4">
        Nearby {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
      </h2>
      <ul className="flex-grow overflow-y-auto">{renderContent()}</ul>
    </div>
  );
}

// Set a default position (latitude, longitude)
// Coordinates for London, UK

const MapComponent = ({ addEstablishment, target }) => {
  const [currentPosition, setCurrentLocation] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [locationError, setLocationError] = useState(null);

  useEffect(() => {
    // Check if geolocation is available in the browser
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // On success, set the location state with the latitude and longitude
          setCurrentLocation([
            position.coords.latitude,
            position.coords.longitude,
          ]);

          // alert(position.coords.latitude + "," + position.coords.longitude);
        },
        (error) => {
          // On error, set the error message in state
          setLocationError(error.message);
        }
      );
    } else {
      setLocationError("Geolocation is not supported by this browser.");
    }
  }, []);

  const handleMapClick = (event) => {
    const { lat, lng } = event.latlng; // Get the latitude and longitude of the click

    alert(lat + " " + lng);

    // Add a new marker to the state
    // setMarkers((prevMarkers) => [
    //   ...prevMarkers,
    //   { lat, lng, id: Date.now() }, // Use Date.now() to generate a unique ID
    // ]);
  };

  function MapEvent({target}) {
    const map = useMapEvents({
      click(e) {
        const markPos = e.latlng;

        const distance = calculateDistance(
          markPos.lat,
          markPos.lng,
          currentPosition[0],
          currentPosition[1]
        );

        if (distance < 10) {
          alert("too close");
        } else {
          addEstablishment(true);
        }
      },
    });

    useEffect(() => { 
      // if(target) map.flyTo(target, 20, { duration: 2000 }); 
    }, [map, target]);
  }

  function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c * 1000; // Distance in meters
    return distance;
  }

  function deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  return (
    <div className="w-dvw h-full flex justify-center">
      {/* MapContainer is the wrapper for your map */}
      {currentPosition == null ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid"
          style={{
            alignSelf: "center",
            shapeRendering: "auto",
            display: "block",
            background: "transparent",
          }}
          width="227px"
          height="227px"
          // xmlns:xlink="http://www.w3.org/1999/xlink"
        >
          <g>
            <g transform="translate(50 50)">
              <g transform="scale(0.8)">
                <g transform="translate(-50 -50)">
                  <g>
                    <animateTransform
                      keyTimes="0;0.33;0.66;1"
                      values="-20 -20;20 -20;0 20;-20 -20"
                      dur="1.7241379310344827s"
                      repeatCount="indefinite"
                      type="translate"
                      attributeName="transform"
                    ></animateTransform>
                    <path
                      d="M44.19 26.158c-4.817 0-9.345 1.876-12.751 5.282c-3.406 3.406-5.282 7.934-5.282 12.751 c0 4.817 1.876 9.345 5.282 12.751c3.406 3.406 7.934 5.282 12.751 5.282s9.345-1.876 12.751-5.282 c3.406-3.406 5.282-7.934 5.282-12.751c0-4.817-1.876-9.345-5.282-12.751C53.536 28.033 49.007 26.158 44.19 26.158z"
                      fill="#918978"
                    ></path>
                    <path
                      d="M78.712 72.492L67.593 61.373l-3.475-3.475c1.621-2.352 2.779-4.926 3.475-7.596c1.044-4.008 1.044-8.23 0-12.238 c-1.048-4.022-3.146-7.827-6.297-10.979C56.572 22.362 50.381 20 44.19 20C38 20 31.809 22.362 27.085 27.085 c-9.447 9.447-9.447 24.763 0 34.21C31.809 66.019 38 68.381 44.19 68.381c4.798 0 9.593-1.425 13.708-4.262l9.695 9.695 l4.899 4.899C73.351 79.571 74.476 80 75.602 80s2.251-0.429 3.11-1.288C80.429 76.994 80.429 74.209 78.712 72.492z M56.942 56.942 c-3.406 3.406-7.934 5.282-12.751 5.282s-9.345-1.876-12.751-5.282c-3.406-3.406-5.282-7.934-5.282-12.751 c0-4.817 1.876-9.345 5.282-12.751c3.406-3.406 7.934-5.282 12.751-5.282c4.817 0 9.345 1.876 12.751 5.282 c3.406 3.406 5.282 7.934 5.282 12.751C62.223 49.007 60.347 53.536 56.942 56.942z"
                      fill="#131137"
                    ></path>
                  </g>
                </g>
              </g>
            </g>
            <g></g>
          </g>
        </svg>
      ) : (
        <MapContainer
          center={currentPosition}
          zoom={20}
          style={{ width: "100%", height: "100%" }}
        >
          {/* TileLayer loads the OpenStreetMap tiles */}
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <MapEvent target={target}/>
          <Marker
            position={currentPosition}
            icon={ico}
            title="Current Location"
          >
            <Popup>Current Location</Popup>
          </Marker>
        </MapContainer>
      )}
    </div>
  );
};

function AuthPopup({ onClose }) {
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle authentication logic here
    console.log("Submitted:", { email, password, isSignUp });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center backdrop-blur z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96 transition-all">
        <h2 className="text-2xl font-bold mb-4">
          {isSignUp ? "Sign Up" : "Sign In"}
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 mb-4 border rounded"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 mb-4 border rounded"
            required
          />
          {isSignUp && (
            <input
              type="text"
              placeholder="Full Name"
              // value={password}
              // onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 mb-4 border rounded"
              required
            />
          )}
          <button
            type="submit"
            className="w-full bg-black text-white p-2 rounded mb-4 font-bold hover:bg-opacity-80 transition-all"
          >
            {isSignUp ? "Sign Up" : "Sign In"}
          </button>
        </form>
        <button className="w-full bg-red-500 text-white p-2 rounded mb-4">
          Sign in with Google
        </button>
        <p className="text-center">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}
          <button
            className="text-blue-500 ml-1 font-semibold underline"
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp ? "Sign In" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
}

function Drawer({ isOpen, onClose }) {
  return (
    <div
      className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out z-20`}
    >
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Menu</h2>
        <ul>
          <li className="mb-2">
            <button className="text-blue-500">Home</button>
          </li>
          <li className="mb-2">
            <button className="text-blue-500">Profile</button>
          </li>
          <li className="mb-2">
            <button className="text-blue-500">Settings</button>
          </li>
        </ul>
      </div>
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
      >
        ✕
      </button>
    </div>
  );
}

function EstablishmentPopup({ isOpen, onClose }) {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [images, setImages] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted:", { name, type, rating, comment, images });
    onClose();
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 6) {
      alert("You can only upload up to 6 images");
      return;
    }
    const newImages = files.map((file) => URL.createObjectURL(file));
    setImages([...images, ...newImages]);
  };

  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center overflow-y-auto">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96 max-h-screen overflow-y-auto relative">
        <h2 className="text-2xl font-bold mb-4">Add Establishment</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Establishment Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 mb-4 border rounded"
            required
          />
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full p-2 mb-4 border rounded"
            required
          >
            <option value="">Select Type</option>
            <option value="restaurant">Restaurant</option>
            <option value="cafe">Cafe</option>
            <option value="bar">Bar</option>
            <option value="shop">Shop</option>
            <option value="other">Other</option>
          </select>
          <div className="mb-4">
            <label className="block mb-2">Rating:</label>
            <div className="flex justify-between">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`text-2xl ${
                    rating >= star ? "text-yellow-500" : "text-gray-300"
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
          <textarea
            placeholder="Leave a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full p-2 mb-4 border rounded"
            rows="3"
          ></textarea>
          <div className="mb-4">
            <label className="block mb-2">Upload Images (max 6):</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {images.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={image}
                  alt={`Uploaded ${index + 1}`}
                  className="w-full h-24 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded mb-4"
          >
            Submit
          </button>
        </form>
        <button
          onClick={onClose}
          className="aspect-square absolute right-2 top-2 shadow-2xl"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 384 512"
            fill="#101010"
            width="14px"
            height="14px"
          >
            <path d="M376.6 84.5c11.3-13.6 9.5-33.8-4.1-45.1s-33.8-9.5-45.1 4.1L192 206 56.6 43.5C45.3 29.9 25.1 28.1 11.5 39.4S-3.9 70.9 7.4 84.5L150.3 256 7.4 427.5c-11.3 13.6-9.5 33.8 4.1 45.1s33.8 9.5 45.1-4.1L192 306 327.4 468.5c11.3 13.6 31.5 15.4 45.1 4.1s15.4-31.5 4.1-45.1L233.7 256 376.6 84.5z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEstablishmentPopupOpen, setIsEstablishmentPopupOpen] =
    useState(false);

  const [user, setUser] = useState(null);
  const [target, setTarget] = useState(null);

  const SignUpByEmail = async (email, password) => {
    try {
      const result = await auth.createUserWithEmailAndPassword(email, password);
      const user = result.user;
      // user.photoURL
      setUser(user);
    } catch (error) {
      if (error.code === "auth/invalid-email") {
        alert("Invalid email format.");
      } else if (error.code === "auth/email-already-in-use") {
        alert("Email is already in use.");
      } else {
        alert("Error:", error.message);
      }
    }
  };

  return (
    <div className="w-full h-screen relative">
      <div className="h-full w-full relative z-0">
        {/* <Map /> */}
        <MapComponent addEstablishment={setIsEstablishmentPopupOpen} target={target}/>
      </div>
      <button
        onClick={() => setIsDrawerOpen(true)}
        className="absolute top-4 left-12 bg-black text-white p-2 rounded-full shadow-lg z-10 aspect-square w-12 h-12"
      >
        M
      </button>
      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
      <EstablishmentPopup
        isOpen={isEstablishmentPopupOpen}
        onClose={() => setIsEstablishmentPopupOpen(false)}
      />
      <div className="rounded-lg w-1/4 bg-white shadow-2xl absolute right-7 top-28 z-10">
        <SidePanel target={setTarget}/>
      </div>
      {!isAuthenticated && (
        <AuthPopup onClose={() => setIsAuthenticated(true)} />
      )}
    </div>
  );
}

export default App;
