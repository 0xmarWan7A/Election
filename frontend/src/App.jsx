import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Home from "./pages/Home";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import Election from "./pages/Election";
import ContactUS from "./pages/Contact";
import Register from "./pages/Register";
import PositionPage from "./pages/PositionPage";
import { useUserStore } from "./stores/useUserStore";
import Navbar from "./components/Navbar";
import { useEffect } from "react";

function App() {
  const { user, checkAuth } = useUserStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(180,95,6,0.3)_0%,rgba(120,63,4,0.2)_45%,rgba(0,0,0,0.1)_100%)]" />
        </div>
      </div>
      <Navbar />
      <Routes>
        <Route path="*" element={!user ? <Navigate to="/login" /> : <Home />} />
        <Route
          path="/login"
          element={
            !user ? (
              <Login />
            ) : user.role === "admin" ? (
              <AdminDashboard />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/register"
          element={!user ? <Register /> : <Navigate to="/" />}
        />
        <Route path="/contact-us" element={!user ? <Login /> : <ContactUS />} />
        <Route path="/election" element={!user ? <Login /> : <Election />} />
        <Route
          path="/secret-dashboard"
          element={
            user && user.role === "admin" ? (
              <AdminDashboard />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="/election/:position" element={<PositionPage />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
