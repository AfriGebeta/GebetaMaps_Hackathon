"use client";
import React, { useState } from "react";
import Header from "../Header/page";
import dynamic from "next/dynamic";
import { FaSearch } from "react-icons/fa";
import Footer from "../Footer/page";
import OrderTable from "../components/orderTable";

const Map = dynamic(() => import("../map"), { ssr: false });

const Orders = () => {
  const [pickUp, setPickUp] = useState([]);
  const [dropOff, setDropOff] = useState([]);
  const [pickUpInput, setPickUpInput] = useState("");
  const [dropOffInput, setDropOffInput] = useState("");
  const [originLat, setOriginLat] = useState("");
  const [originLon, setOriginLon] = useState("");
  const [destinationLat, setDestinationLat] = useState("");
  const [destinationLon, setDestinationLon] = useState("");
  const [price, setPrice] = useState<number | null>(null);
  const [routeCoordinates, setRouteCoordinates] = useState<any[]>([]);

  const [userId] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("userId");
    }
    return null; // Default value for SSR
  });

  const [formData, setFormData] = useState({
    user_id: userId,
    driver_id: "",
    status: "pending",
    origin: `${originLat},${originLon}`,
    destination: `${destinationLat},${destinationLon}`,
    price: 0,
    customer_name: "",
    customer_phone_number: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasSearched] = useState(false); // New state to track search attempts

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const fetchLocationSuggestions = async (query: string, type: string) => {
    try {
      const response = await fetch(
        `https://liytapi.fenads.org/location/${query}`
      );
      const data = await response.json();
      if (type === "primary") {
        if (data.payload.data && data.payload.data.length > 0) {
          setPickUp(data.payload.data);
        } else {
          setPickUp([]); // Clear pickUp if no data
          alert(
            "The location you are trying to set does not exist. Please try again."
          ); // Show alert
        }
      } else {
        if (data.payload.data && data.payload.data.length > 0) {
          setDropOff(data.payload.data);
        } else {
          setDropOff([]); // Clear dropOff if no data
          alert(
            "The location you are trying to set does not exist. Please try again."
          ); // Show alert
        }
      }
    } catch (error) {
      console.error("Failed to fetch location suggestions", error);
    }
  };

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

  const handleSubmit = async () => {
    if (price === null) {
      alert("Please calculate the price first.");
    } else {
      try {
        const response = await fetch("https://liytapi.fenads.org/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          setIsModalOpen(false);
        } else {
          const errorData = await response.json();
          console.log(errorData);
        }
      } catch (error) {
        console.error("Order creation error:", error);
      }
    }
  };

  const handlePriceCalculation = async (
    originLat: string,
    originLon: string,
    destinationLat: string,
    destinationLon: string
  ) => {
    try {
      const response = await fetch(
        `https://liytapi.fenads.org/orders/get_price?origin=${originLat},${originLon}&destination=${destinationLat},${destinationLon}`
      );
      const data = await response.json();
      setPrice(data.payload.total_price);
      fetchRoute(
        `${originLat},${originLon}`,
        `${destinationLat},${destinationLon}`
      );
      setFormData((prevData) => ({
        ...prevData,
        price: data.payload.total_price,
      }));
    } catch (error) {
      console.error("Failed to fetch price", error);
    }
  };

  const handleLocationSelect = (
    location: any,
    type: "primary" | "secondary"
  ) => {
    const { latitude, longitude, name } = location;
    if (type === "primary") {
      setPickUpInput(name);
      setPickUp([]);
      setOriginLat(latitude);
      setOriginLon(longitude);
      if (destinationLat && destinationLon) {
        handlePriceCalculation(
          latitude,
          longitude,
          destinationLat,
          destinationLon
        );
      }
      setFormData((prevData) => ({
        ...prevData,
        origin: `${latitude},${longitude}`,
      }));
    } else {
      setDropOffInput(name);
      setDropOff([]);
      setDestinationLat(latitude);
      setDestinationLon(longitude);
      if (originLat && originLon) {
        handlePriceCalculation(originLat, originLon, latitude, longitude);
      }
      setFormData((prevData) => ({
        ...prevData,
        destination: `${latitude},${longitude}`,
      }));
    }
  };

  return (
    <>
      <Header />
      <div className="bg-white w-full h-[700px] p-6">
        <div className="flex justify-between items-center mb-4 w-full">
          <h1 className="text-2xl font-bold">Orders Details</h1>

          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg font-semibold"
          >
            New Orders
          </button>
        </div>

        <OrderTable />

        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
            <div className="bg-black w-5/6 h-5/6 flex justify-center items-center bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500">
              <div className="bg-white p-6 rounded-lg w-10/12 h-5/6">
                <h2 className="text-xl font-bold mb-4">Create New Order</h2>
                <form>
                  <div className="flex justify-evenly">
                    <div className="w-1/2">
                      <Map
                        zoom={12}
                        h={50}
                        origin={{ lat: originLat, lon: originLon }}
                        destination={{
                          lat: destinationLat,
                          lon: destinationLon,
                        }}
                        routeCoordinates={routeCoordinates}
                      />
                    </div>
                    <div className="w-1/3">
                      {/* <div className="mb-4">
                        <label className="block text-gray-700">Item:</label>
                        <input
                          type="text"
                          className="w-full p-2 border rounded"
                          placeholder="Enter Item"
                          onChange={handleChange}
                        />
                      </div> */}
                      <div className="mb-4">
                        {/* <label className="block text-gray-700">
                          Recipient name:
                        </label> */}
                        <input
                          type="text"
                          name="customer_name"
                          value={formData.customer_name}
                          className="w-full p-2 border rounded"
                          placeholder="Recipient name"
                          onChange={handleChange}
                        />
                      </div>
                      <div className="mb-4">
                        {/* <label className="block text-gray-700">
                          Recipient Phone NO:
                        </label> */}
                        <input
                          type="text"
                          name="customer_phone_number"
                          value={formData.customer_phone_number}
                          className="w-full p-2 border rounded"
                          placeholder="Receiver's Phone Number"
                          onChange={handleChange}
                        />
                      </div>
                      <div className="relative mb-4">
                        <input
                          type="text"
                          placeholder="Pick Up Address"
                          className="w-full p-3 border border-gray-300 rounded-md"
                          value={pickUpInput}
                          onChange={(e) => setPickUpInput(e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            fetchLocationSuggestions(pickUpInput, "primary")
                          }
                          className="absolute inset-y-0 right-3 flex items-center"
                        >
                          <FaSearch className="text-gray-500" />
                        </button>
                        {Array.isArray(pickUp) && pickUp.length > 0 ? (
                          <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-y-auto">
                            {pickUp.map((location: any, index) => (
                              <li
                                key={index}
                                className="p-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() =>
                                  handleLocationSelect(location, "primary")
                                }
                              >
                                {location.name} - {location.City},{" "}
                                {location.Country}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          hasSearched && ( // Only show message if a search has been attempted
                            <p className="text-red-500">
                              The location you are trying to set does not exist.
                              Please try again.
                            </p>
                          )
                        )}
                      </div>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Drop Of Address"
                          className="w-full p-3 border border-gray-300 rounded-md"
                          value={dropOffInput}
                          onChange={(e) => setDropOffInput(e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            fetchLocationSuggestions(dropOffInput, "secondary")
                          }
                          className="absolute inset-y-0 right-3 flex items-center"
                        >
                          <FaSearch className="text-gray-500" />
                        </button>
                        {dropOff.length > 0 && (
                          <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-y-auto">
                            {dropOff.map((location: any, index) => (
                              <li
                                key={index}
                                className="p-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() =>
                                  handleLocationSelect(location, "secondary")
                                }
                              >
                                {location.name} - {location.City},
                                {location.Country}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                      <div className="flex justify-between w-full mt-4">
                        <div>Price: {price ? `${price}birr` : "N/A"}</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-4 mt-16">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="bg-gray-400 hover:bg-gray-500 text-white py-2 px-4 rounded"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault(); // Prevents form submission behavior
                        handleSubmit();
                      }}
                      className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded"
                    >
                      Create Order
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Orders;
