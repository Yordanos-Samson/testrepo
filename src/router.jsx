import { createBrowserRouter } from "react-router-dom"
import App from "./App"
import Signup from "./components/Signup"
import Signin from "./components/Signin"
import DoctorDashboard from "./components/DoctorDashboard"
import AdminDashboard from "./components/AdminDashboard"
import PrivateRoute from "./components/PrivateRoute"

export const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/signup", element: <Signup /> },
  { path: "/signin", element: <Signin /> },
  {
    path: "/doctor-dashboard",
    element: (
      <PrivateRoute allowedRoles={["doctor"]}>
        <DoctorDashboard />
      </PrivateRoute>
    ),
  },
  {
    path: "/admin-dashboard",
    element: (
      <PrivateRoute allowedRoles={["admin"]}>
        <AdminDashboard />
      </PrivateRoute>
    ),
  },
])

