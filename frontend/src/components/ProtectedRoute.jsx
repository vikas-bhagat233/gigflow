import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Loader from "./Loader";

export default function ProtectedRoute({ children }) {
  const auth = useAuth();
  if (auth.isLoading) return <Loader />;
  return auth.isAuth ? children : <Navigate to="/login" />;
}
