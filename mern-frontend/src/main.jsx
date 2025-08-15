import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Home from "./components/Home";
import Profile from "./components/Profile";
import PrivateRoute from "./components/PrivateRoute";
import MySkillOffers from "./components/MySkillOffers";
import AddSkillOffer from "./components/AddSkillOffer";
import EditSkillOffer from "./components/EditSkillOffer";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/my-skill-offers"
          element={
            <PrivateRoute>
              <MySkillOffers />
            </PrivateRoute>
          }
        />
        <Route
          path="/add-skill-offer"
          element={
            <PrivateRoute>
              <AddSkillOffer />
            </PrivateRoute>
          }
        />
        <Route
          path="/edit-skill-offer/:id"
          element={
            <PrivateRoute>
              <EditSkillOffer />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
