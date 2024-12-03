import Loader from "@/utils/Loader/Loader";
import { Suspense, lazy } from "react";
import { RouteObject } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
// import SpinnerContainer from "../constants/SpinnerContainer";
// import ProtectedRoute from "./ProtectedRoute";

const Lodable = (Component: any) => (props: JSX.IntrinsicAttributes) =>
  (
    <Suspense fallback={<Loader />}>
      <Component {...props} />
    </Suspense>
  );

const HomePage = Lodable(lazy(() => import("../pages/HomePage")));

const Login = Lodable(lazy(() => import("../auth/Login")));
const Register = Lodable(lazy(() => import("../auth/Register")));

const AdminDashboard = Lodable(
  lazy(() => import("../admin/dashboard/Dashboard"))
);
const ClientDashboard = Lodable(
  lazy(() => import("../pages/client/Dashboard"))
);

const Router: RouteObject[] = [
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute allowedRoles={["user"]}>
        <ClientDashboard />
      </ProtectedRoute>
    ),
  },
];
export default Router;
