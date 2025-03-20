import { BrowserRouter, Routes, Route } from "react-router-dom";
import About from "../pages/About";
import ContactUs from "../pages/ContactUs";
import Login from "../authentication/Login";
import SignUp from "../authentication/SignUp";
import SellerDashboard from "../screens/seller/SellerDashboard";
import AdminDashboard from "../screens/admin/AdminDashboard";
import UserDashboard from "../screens/user/UserDashboard";
import AuthContext, { AuthProvider } from "./AuthContext";
import Home from "../pages/Home";
import { useContext } from "react";
import ShopRegistration from "../shop/shopRegistration";

const AppRouter = () => {
  return (
    <AuthProvider>
      <AuthConsumer />
    </AuthProvider>
  );
};

const AuthConsumer = () => {
  const {role } = useContext(AuthContext); // Now inside AuthProvider
  console.log(role);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/user/Dashboard" element={role =="USER" && <UserDashboard />} />
        <Route path="/user/shopregistration" element={role =="USER" ? <ShopRegistration/> :<Login message="Login Required"/>} />
        <Route path="/about" element={<About />} />
        <Route path="/contactus" element={<ContactUs />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<SignUp />} />
        <Route path="/seller/dashboard" element={role=="SELLER" && <SellerDashboard />} />
        <Route path="/admin/dashboard" element={role=="ADMIN" && <AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
