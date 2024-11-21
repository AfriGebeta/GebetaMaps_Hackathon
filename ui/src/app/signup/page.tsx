"use client";
import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { IoEyeSharp } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const SignUp = () => {
  // const [error, setError] = useState<string | null>(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isPasswordConfirmVisible, setIsPasswordConfirmVisible] =
    useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
    email: "",
    password: "",
    business_name: "",
    business_email: "",
    primary_address: {
      latitude: null as number | null,
      longitude: null as number | null,
    },
    secondary_address: {
      latitude: null as number | null,
      longitude: null as number | null,
    },
  });
  const [primaryAddressInput, setPrimaryAddressInput] = useState("");
  const [secondaryAddressInput, setSecondaryAddressInput] = useState("");
  const [primarySuggestions, setPrimarySuggestions] = useState([]);
  const [secondarySuggestions, setSecondarySuggestions] = useState([]);
  const [confirmPassword, setConfirmPassword] = useState("");

  const router = useRouter();

  const fetchLocationSuggestions = async (query: any, type: any) => {
    try {
      const response = await fetch(
        `https://liytapi.fenads.org/location/${query}`
      );
      const data = await response.json();
      if (type === "primary") {
        setPrimarySuggestions(data.payload.data);
      } else {
        setSecondarySuggestions(data.payload.data);
      }
    } catch (error) {
      console.error("Failed to fetch location suggestions", error);
    }
  };

  const handleLocationSelect = (location: any, type: any) => {
    const { latitude, longitude, name } = location;
    if (type === "primary") {
      setFormData((prevData) => ({
        ...prevData,
        primary_address: { latitude, longitude },
      }));
      setPrimaryAddressInput(name);
      setPrimarySuggestions([]);
    } else {
      setFormData((prevData) => ({
        ...prevData,
        secondary_address: { latitude, longitude },
      }));
      setSecondaryAddressInput(name);
      setSecondarySuggestions([]);
    }
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSignUp = async (e: any) => {
    e.preventDefault();

    if (formData.password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("https://liytapi.fenads.org/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user: formData }),
      });

      if (response.ok) {
        router.push("/Login");
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Sign-up failed");
      }
    } catch (error) {
      alert(`${error}An error occurred. Please try again.`);
    }
  };

  return (
    <>
      <div className="min-h-screen flex flex-col lg:flex-row items-center justify-center bg-gray-100 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col lg:flex-row max-w-4xl w-full"
        >
          {/* Left Panel */}
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="w-full lg:w-1/2 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 p-10 text-white flex flex-col justify-center"
          >
            <h1 className="text-4xl font-bold mb-2">LIYT</h1>
            <h2 className="text-2xl font-semibold mb-4">
              Revolutionize Your Delivery System
            </h2>
            <div className="mt-10">
              <p className="text-lg">Already have an account?</p>
              <a
                href="/Login"
                className="text-white underline mt-2 inline-block hover:text-gray-200"
              >
                Log in here
              </a>
            </div>
          </motion.div>

          {/* Right Panel */}
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="w-full lg:w-2/3 p-6 sm:p-10"
          >
            <h2 className="text-3xl font-bold mb-6 text-center lg:text-left">
              User Info
            </h2>
            <motion.form
              className="space-y-4"
              onSubmit={handleSignUp}
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    delayChildren: 0.3,
                    staggerChildren: 0.2,
                  },
                },
              }}
            >
              {/* User Info */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <input
                  type="text"
                  name="first_name"
                  placeholder="First Name"
                  className="w-full p-3 border border-gray-300 rounded-md"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  name="last_name"
                  placeholder="Last Name"
                  className="w-full p-3 border border-gray-300 rounded-md"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                />
              </motion.div>
              <motion.input
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                type="text"
                name="phone_number"
                placeholder="Phone Number"
                className="w-full p-3 border border-gray-300 rounded-md"
                value={formData.phone_number}
                onChange={handleChange}
                required
              />
              <motion.input
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                type="email"
                name="email"
                placeholder="Email"
                className="w-full p-3 border border-gray-300 rounded-md"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                className="flex flex-col sm:flex-row gap-4"
              >
                {/* Password */}
                <div className="relative w-full">
                  <input
                    type={isPasswordVisible ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    className="w-full p-3 border border-gray-300 rounded-md"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                    className="absolute inset-y-0 right-3 flex items-center"
                  >
                    <IoEyeSharp />
                  </button>
                </div>
                {/* Confirm Password */}
                <div className="relative w-full">
                  <input
                    type={isPasswordConfirmVisible ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    className="w-full p-3 border border-gray-300 rounded-md"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setIsPasswordConfirmVisible(!isPasswordConfirmVisible)
                    }
                    className="absolute inset-y-0 right-3 flex items-center"
                  >
                    <IoEyeSharp />
                  </button>
                </div>
              </motion.div>

              {/* Organization Info */}
              <h2 className="text-3xl font-bold mb-6 text-center lg:text-left">
                Organization Info
              </h2>
              <motion.input
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                type="text"
                name="business_name"
                placeholder="Business Name"
                className="w-full p-3 border border-gray-300 rounded-md"
                value={formData.business_name}
                onChange={handleChange}
                required
              />
              <motion.input
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                type="email"
                name="business_email"
                placeholder="Business Email"
                className="w-full p-3 border border-gray-300 rounded-md"
                value={formData.business_email}
                onChange={handleChange}
                required
              />
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                className="flex flex-col sm:flex-row gap-4"
              >
                {/* Primary Address */}
                <div className="relative w-full">
                  <input
                    type="text"
                    placeholder="Primary Address"
                    className="w-full p-3 border border-gray-300 rounded-md"
                    value={primaryAddressInput}
                    onChange={(e) => setPrimaryAddressInput(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      fetchLocationSuggestions(primaryAddressInput, "primary")
                    }
                    className="absolute inset-y-0 right-3 flex items-center"
                  >
                    <FaSearch className="text-gray-500" />
                  </button>
                  {primarySuggestions.length > 0 && (
                    <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-y-auto">
                      {primarySuggestions.map((location: any, index) => (
                        <li
                          key={index}
                          className="p-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() =>
                            handleLocationSelect(location, "primary")
                          }
                        >
                          {location.name} - {location.City}, {location.Country}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Secondary Address */}
                <div className="relative w-full">
                  <input
                    type="text"
                    placeholder="Secondary Address"
                    className="w-full p-3 border border-gray-300 rounded-md"
                    value={secondaryAddressInput}
                    onChange={(e) => setSecondaryAddressInput(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      fetchLocationSuggestions(
                        secondaryAddressInput,
                        "secondary"
                      )
                    }
                    className="absolute inset-y-0 right-3 flex items-center"
                  >
                    <FaSearch className="text-gray-500" />
                  </button>
                  {secondarySuggestions.length > 0 && (
                    <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-y-auto">
                      {secondarySuggestions.map((location: any, index) => (
                        <li
                          key={index}
                          className="p-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() =>
                            handleLocationSelect(location, "secondary")
                          }
                        >
                          {location.name} - {location.City}, {location.Country}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </motion.div>

              <motion.button
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-md font-semibold"
              >
                Sign Up
              </motion.button>
            </motion.form>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};

export default SignUp;
