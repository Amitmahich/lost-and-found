// import {
//   Outlet,
//   Route,
//   BrowserRouter as Router,
//   Routes,
// } from "react-router-dom";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// // ----------------- Public Pages -----------------
// import LandingPage from "./components/LandingPage";
// import ForgotPassword from "./pages/ForgotPassword";
// import SignIn from "./pages/SignIn";
// import SignUp from "./pages/SignUp";

// // ----------------- User Dashboard Pages -----------------
// import DashboardNavbar from "./components/DashboardNavbar";
// import Dashboard from "./pages/Dashboard";
// import ItemDetail from "./pages/ItemDetail";
// import MyListings from "./pages/MyListings";
// import Notifications from "./pages/Notifications";
// import PostItem from "./pages/PostItem";
// import Responses from "./pages/Responses";

// // ----------------- Admin Pages -----------------
// import AdminNavbar from "./components/admin/AdminNavbar";
// import AdminDashboard from "./pages/admin/AdminDashboard";
// import AllItems from "./pages/admin/AllItems";
// import AllUsers from "./pages/admin/AllUsers";
// import BlockedUsers from "./pages/admin/BlockedUsers";
// import ReportsNotifications from "./pages/admin/ReportsNotifications";
// import Settings from "./pages/admin/Settings";

// // ----------------- Auth Guards -----------------
// import PrivateRoute from "./components/PrivateRoute";
// import AdminRoute from "./components/admin/AdminPrivateRoute";

// // ----------------- Layouts -----------------
// function DashboardLayout() {
//   return (
//     <>
//       <DashboardNavbar />
//       <div style={{ padding: "20px" }}>
//         <Outlet />
//       </div>
//     </>
//   );
// }

// function AdminLayout() {
//   return (
//     <>
//       <AdminNavbar />
//       <div style={{ padding: "20px" }}>
//         <Outlet />
//       </div>
//     </>
//   );
// }

// function App() {
//   return (
//     <>
//       <Router>
//         <Routes>
//           {/* ----------------- Public Routes ----------------- */}
//           <Route path="/" element={<LandingPage />} />
//           <Route path="/signin" element={<SignIn />} />
//           <Route path="/signup" element={<SignUp />} />
//           <Route path="/forgot-password" element={<ForgotPassword />} />

//           {/* ----------------- Protected User Dashboard Routes ----------------- */}
//           <Route
//             path="/dashboard"
//             element={
//               <PrivateRoute>
//                 <DashboardLayout />
//               </PrivateRoute>
//             }
//           >
//             <Route index element={<Dashboard />} />
//             <Route path="post-item" element={<PostItem />} />
//             <Route path="item/:id" element={<ItemDetail />} />
//             <Route path="responses" element={<Responses />} />
//             <Route path="my-listings" element={<MyListings />} />
//             <Route path="notifications" element={<Notifications />} />
//           </Route>

//           {/* ----------------- Protected Admin Dashboard Routes ----------------- */}
//           <Route
//             path="/admin"
//             element={
//               <AdminRoute>
//                 <AdminLayout />
//               </AdminRoute>
//             }
//           >
//             <Route index element={<AdminDashboard />} />
//             <Route path="items" element={<AllItems />} />
//             <Route path="users" element={<AllUsers />} />
//             <Route path="reports" element={<ReportsNotifications />} />
//             <Route path="blocked" element={<BlockedUsers />} />
//             <Route path="settings" element={<Settings />} />
//           </Route>

//           {/* ----------------- Catch-all Route ----------------- */}
//           <Route path="*" element={<LandingPage />} />
//         </Routes>
//       </Router>

//       {/* Toast Notifications */}
//       <ToastContainer position="top-right" autoClose={3000} />
//     </>
//   );
// }

// export default App;

// import {
//   Outlet,
//   Route,
//   BrowserRouter as Router,
//   Routes,
// } from "react-router-dom";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// // Public Pages
// import LandingPage from "./components/LandingPage";
// import ForgotPassword from "./pages/ForgotPassword";
// import SignIn from "./pages/SignIn";
// import SignUp from "./pages/SignUp";

// // User Dashboard Pages
// import DashboardNavbar from "./components/DashboardNavbar";
// import Dashboard from "./pages/Dashboard";
// import ItemDetail from "./pages/ItemDetail";
// import MyListings from "./pages/MyListings";
// import Notifications from "./pages/Notifications";
// import PostItem from "./pages/PostItem";
// import Responses from "./pages/Responses";

// // Admin Pages
// import AdminNavbar from "./components/admin/AdminNavbar";
// import AdminDashboard from "./pages/admin/AdminDashboard";
// import AdminReports from "./pages/admin/AdminReports"; // ✅ Correct import
// import AllItems from "./pages/admin/AllItems";
// import AllUsers from "./pages/admin/AllUsers";
// import BlockedUsers from "./pages/admin/BlockedUsers";

// // Auth Guards
// import PrivateRoute from "./components/PrivateRoute";
// import AdminRoute from "./components/admin/AdminPrivateRoute";

// // Layouts
// function DashboardLayout() {
//   return (
//     <>
//       <DashboardNavbar />
//       <div style={{ padding: "20px" }}>
//         <Outlet />
//       </div>
//     </>
//   );
// }

// function AdminLayout() {
//   return (
//     <>
//       <AdminNavbar />
//       <div style={{ padding: "20px" }}>
//         <Outlet />
//       </div>
//     </>
//   );
// }

// function App() {
//   return (
//     <>
//       <Router>
//         <Routes>
//           {/* Public Routes */}
//           <Route path="/" element={<LandingPage />} />
//           <Route path="/signin" element={<SignIn />} />
//           <Route path="/signup" element={<SignUp />} />
//           <Route path="/forgot-password" element={<ForgotPassword />} />

//           {/* User Dashboard */}
//           <Route
//             path="/dashboard"
//             element={
//               <PrivateRoute>
//                 <DashboardLayout />
//               </PrivateRoute>
//             }
//           >
//             <Route index element={<Dashboard />} />
//             <Route path="post-item" element={<PostItem />} />
//             <Route path="item/:id" element={<ItemDetail />} />
//             <Route path="responses" element={<Responses />} />
//             <Route path="my-listings" element={<MyListings />} />
//             <Route path="notifications" element={<Notifications />} />
//           </Route>

//           {/* Admin Dashboard */}
//           <Route
//             path="/admin"
//             element={
//               <AdminRoute>
//                 <AdminLayout />
//               </AdminRoute>
//             }
//           >
//             <Route index element={<AdminDashboard />} />
//             <Route path="items" element={<AllItems />} />
//             <Route path="users" element={<AllUsers />} />
//             <Route path="reports" element={<AdminReports />} /> {/* ✅ */}
//             <Route path="blocked" element={<BlockedUsers />} />
//           </Route>

//           {/* Catch-all */}
//           <Route path="*" element={<LandingPage />} />
//         </Routes>
//       </Router>

//       <ToastContainer position="top-right" autoClose={3000} />
//     </>
//   );
// }

// export default App;
import {
  Outlet,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ----------------- Public Pages -----------------
import LandingPage from "./components/LandingPage";
import ForgotPassword from "./pages/ForgotPassword";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";

// ----------------- User Dashboard Pages -----------------
import DashboardNavbar from "./components/DashboardNavbar";
import Dashboard from "./pages/Dashboard";
import ItemDetail from "./pages/ItemDetail";
import MyListings from "./pages/MyListings";
import Notifications from "./pages/Notifications";
import PostItem from "./pages/PostItem";
import Responses from "./pages/Responses";

// ----------------- Admin Pages -----------------
import AdminNavbar from "./components/admin/AdminNavbar";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminReports from "./pages/admin/AdminReports";
import AllItems from "./pages/admin/AllItems";
import AllUsers from "./pages/admin/AllUsers";
import BlockedUsers from "./pages/admin/BlockedUsers";

// ----------------- Auth Guards -----------------
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/admin/AdminPrivateRoute";

// ----------------- Layouts -----------------
function DashboardLayout() {
  return (
    <>
      <DashboardNavbar />
      <main style={{ padding: "20px" }}>
        <Outlet />
      </main>
    </>
  );
}

function AdminLayout() {
  return (
    <>
      <AdminNavbar />
      <main style={{ padding: "20px" }}>
        <Outlet />
      </main>
    </>
  );
}

// ----------------- App -----------------
function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* ---------- Public Routes ---------- */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* ---------- User Dashboard (Protected) ---------- */}
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

          {/* ---------- Admin Dashboard (Protected) ---------- */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="items" element={<AllItems />} />
            <Route path="users" element={<AllUsers />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="blocked" element={<BlockedUsers />} />
            {/* <Route path="settings" element={<Settings />} /> */}
          </Route>

          {/* ---------- Fallback ---------- */}
          <Route path="*" element={<LandingPage />} />
        </Routes>
      </Router>

      {/* Toast Notifications */}
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
