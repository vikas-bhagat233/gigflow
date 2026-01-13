import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Gigs from "./pages/Gigs";
import Dashboard from "./pages/Dashboard";
import GigDetails from "./pages/GigDetails";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import { fetchMe } from "./features/auth/authSlice";
import { useAuth } from "./hooks/useAuth";
import socket from "./services/socket";

export default function App() {
  const dispatch = useDispatch();
  const auth = useAuth();

  useEffect(() => {
    dispatch(fetchMe());
  }, [dispatch]);

  useEffect(() => {
    if (!auth.isAuth || !auth.userId) return;
    socket.emit("join", String(auth.userId));
  }, [auth.isAuth, auth.userId]);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Gigs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/gigs/:id" element={<GigDetails />} />
      </Routes>
    </>
  );
}
