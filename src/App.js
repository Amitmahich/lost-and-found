import {
  Outlet,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LandingPage from "./components/LandingPage";
import ForgotPassword from "./pages/ForgotPassword";
import Notifications from "./pages/Notifications";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";

import DashboardNavbar from "./components/DashboardNavbar";
import Dashboard from "./pages/Dashboard";
import ItemDetail from "./pages/ItemDetail";
import MyListings from "./pages/MyListings";
import PostItem from "./pages/PostItem";
import Responses from "./pages/Responses";

import PrivateRoute from "./components/PrivateRoute"; // ✅ Add this

function DashboardLayout() {
  return (
    <>
      <DashboardNavbar />
      <div style={{ padding: "20px" }}>
        <Outlet />
      </div>
    </>
  );
}

function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Protected Dashboard Routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="post-item" element={<PostItem />} />
            <Route path="item/:id" element={<ItemDetail />} />
            <Route path="responses" element={<Responses />} />
            <Route path="my-listings" element={<MyListings />} />
            <Route path="notifications" element={<Notifications />} />
          </Route>
        </Routes>
      </Router>

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
