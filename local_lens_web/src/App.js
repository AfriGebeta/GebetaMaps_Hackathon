import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import app, { auth, db } from "./firebase-config";
import { doc, getDoc } from "firebase/firestore";
import { GoogleAuthProvider } from "firebase/auth";

import React, { useEffect, useState } from "react";
import "./App.css";
import MapComponent from "./components/MapComponent";
import EstablishmentPopup from "./components/EstablishmentPopup";
import SidePanel from "./components/SidePanel";
import "leaflet/dist/leaflet.css";
import L, { Map } from "leaflet";
import Layout from "./components/Layout/Layout";
import Drawer from "./components/Drawer";
import ReviewPopUp from "./components/ReviewPopUp";
import EventPopup from "./components/EventPopUp";

import google from "./assets/google.svg";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NotFoundPage from "./components/NotFoundPage";

const provider = new GoogleAuthProvider();

// Set a default position (latitude, longitude)
function AuthPopup({ onClose, setUser }) {
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  console.log("isSignUp:", isSignUp);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle authentication logic here
    console.log("Submitted:", { email, password, isSignUp });
    if (isSignUp) {
      SignUpByEmail(email, password);
    } else {
      SignInByEmail(email, password);
    }
    onClose();
  };

  //To sign in using email
  const SignInByEmail = async (email, password) => {
    try {
      const result = await auth.signInWithEmailAndPassword(email, password);
      const user = result.user;
      setUser(user);
    } catch (error) {
      setUser(null);
      console.error(error);
      alert("Failed to sign in. Please check your email and password.");
    }
  };

  //To sign up using email
  const SignUpByEmail = async (email, password) => {
    alert("Attempting to sign-up...");
    try {
      const userCredential = await auth.createUserWithEmailAndPassword(
        email,
        password
      );
      const user = userCredential.user;
      await storeUserData(user, email, name);
      setUser(user);
    } catch (error) {
      setUser(null);
      if (error.code === "auth/invalid-email") {
        alert("Invalid email format.");
      } else if (error.code === "auth/email-already-in-use") {
        alert("Email is already in use.");
      } else {
        alert("Error:", error.message);
      }
    }
  };

  //To sign in using your google account
  const signInByGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await auth.signInWithPopup(provider);
      const user = result.user;
      await storeUserData(user, email, user.displayName);
      setUser(user); // Update state or store user info
      alert("Google sign-in successful:", user);
    } catch (error) {
      setUser(null);
      alert("Google sign-in error:", error);
    }
  };

  const storeUserData = async (user, email, name) => {
    try {
      // const db = firebase.firestore();
      await db.collection("users").doc(user.uid).set({
        uid: user.uid,
        name: name, // Or `user.name` if you're using a different method for name
        email: email,
        //profilePicture: profilePicture || null,
      });
    } catch (error) {
      console.error(error);
      //throw new Error('Failed to store user data');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center backdrop-blur z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96 transition-all flex flex-col">
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
              value={name}
              onChange={(e) => setName(e.target.value)}
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
        <button
          className="w-full text-white bg-transparent rounded mb-4 max-w-16 aspect-square border-2 border-grey-500 shadow-lg self-center justify-self-center"
          onClick={() => {
            signInByGoogle();
            onClose();
          }}
        >
          <img src={google} alt="Google" />
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

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEstablishmentPopupOpen, setIsEstablishmentPopupOpen] =
    useState(false);
  const [isReviewPopupOpen, setIsReviewPopupOpen] = useState(false);

  const [user, setUser] = useState(null);
  const [target, setTarget] = useState(null);
  const [userDetail, setUserDetail] = useState(null);
  const [map, setMap] = useState(null);
  const [isEventPopupOpen, setIsEventPopupOpen] = useState(false);

  const [places, setPlaces] = useState([]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        setIsAuthenticated(false);
      } else {
        setIsAuthenticated(true);
        setUser(user);
      }
    });

    return () => unsubscribe();
  }, []);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserDetail(docSnap.data());
          console.log("User", docSnap.data());
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        // setError(error);
        console.log("fetch error", error);
      } finally {
        // setLoading(false);
      }
    };
    if (user) {
      setIsAuthenticated(true);
      fetchUser();
    } else {
      setIsAuthenticated(false);
      setUserDetail(null);
    }
  }, [user]);

  //To validate the password
  const SignUpForm = () => {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSignUp = (e) => {
      e.preventDefault(); // Prevent form submission

      // Password validation criteria
      const minLength = 8;
      const hasNumber = /\d/.test(password);
      const hasSpecialChar = /[!@#$%^&*]/.test(password); // Special character check

      // Check if all criteria are met
      if (password.length < minLength) {
        setError("Password must be at least 8 characters long.");
      } else if (!hasNumber) {
        setError("Password must contain at least one number.");
      } else if (!hasSpecialChar) {
        setError("Password must contain at least one special character.");
      } else {
        setError("");
        console.log("Sign-up successful:", password);
      }
    };
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Layout
              children={
                <div className="w-full h-screen relative">
                  <div className="h-full w-full relative z-0">
                    {/* <Map /> */}
                    <MapComponent
                      addEstablishment={setIsEstablishmentPopupOpen}
                      addReview={setIsReviewPopupOpen}
                      target={setTarget}
                      map={map}
                      setMap={setMap}
                      places={setPlaces}
                    />
                  </div>
                  <button
                    onClick={() => {
                      setIsDrawerOpen(true);
                    }}
                    className="absolute top-4 left-12 bg-black text-white p-2 rounded-full shadow-lg z-10 aspect-square w-12 h-12 font-bold text-lg"
                  >
                    {userDetail &&
                      userDetail.name[0].toUpperCase() +
                        userDetail.name.split(" ")[1][0].toUpperCase()}
                  </button>
                  <button
                    onClick={() => setIsEventPopupOpen(true)}
                    className="absolute bottom-4 left-4 bg-white text-white p-2 rounded-full shadow-lg z-10"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                      width="24px"
                      height="24px"
                      fill="#000"
                    >
                      <path d="M128 0c17.7 0 32 14.3 32 32l0 32 128 0 0-32c0-17.7 14.3-32 32-32s32 14.3 32 32l0 32 48 0c26.5 0 48 21.5 48 48l0 48L0 160l0-48C0 85.5 21.5 64 48 64l48 0 0-32c0-17.7 14.3-32 32-32zM0 192l448 0 0 272c0 26.5-21.5 48-48 48L48 512c-26.5 0-48-21.5-48-48L0 192zm64 80l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16zm128 0l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16zm144-16c-8.8 0-16 7.2-16 16l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0zM64 400l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16zm144-16c-8.8 0-16 7.2-16 16l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0zm112 16l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16z" />
                    </svg>
                  </button>
                  <Drawer
                    isOpen={isDrawerOpen}
                    onClose={() => setIsDrawerOpen(false)}
                    setUser={setUser}
                  />
                  <EstablishmentPopup
                    isOpen={isEstablishmentPopupOpen}
                    onClose={() => {
                      setIsEstablishmentPopupOpen(false);
                      setTarget(null);
                    }}
                    target={target}
                    user={userDetail}
                  />
                  <ReviewPopUp
                    isOpen={isReviewPopupOpen}
                    onClose={() => {
                      setIsReviewPopupOpen(false);
                      setTarget(null);
                    }}
                    target={target}
                    user={userDetail}
                  />
                  <EventPopup
                    isOpen={isEventPopupOpen}
                    onClose={() => setIsEventPopupOpen(false)}
                    user={userDetail}
                  />
                  <SidePanel map={map} target={target} places={places} />
                  {/* map.setView([ 9.03, 38.74], 20, { animate: true, duration: 2}); */}
                  {!isAuthenticated && (
                    <AuthPopup
                      onClose={() => {
                        user == null
                          ? setIsAuthenticated(false)
                          : setIsAuthenticated(true);
                      }}
                      setUser={setUser}
                    />
                  )}
                </div>
              }
            />
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
