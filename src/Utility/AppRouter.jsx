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
import ShopRegistration from "../shop/shopRegistration";
import ManageProducts from "../screens/seller/ManageProducts";
import AddProduct from "../screens/seller/AddProduct";
import MyShop from "../screens/seller/MyShop";
import Profile from "../pages/Profile";
import ViewProduct from "../screens/seller/ViewProduct";

const AppRouter = () => {
  return (
    <AuthProvider>
      <AuthConsumer />
    </AuthProvider>
  );
};

const AuthConsumer = () => {
  // const {role } = useContext(AuthContext); // Now inside AuthProvider
  const role = localStorage.getItem("role")
  console.log(role);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route
          path="/user/dashboard"
          element={role == "USER" && <UserDashboard />}
        />
        <Route
          path="/user/shopRegistration"
          element={
            role ? <ShopRegistration /> : <Login message="Login Required" />
          }
        />
        <Route path="/about" element={<About />} />
        <Route path="/contactus" element={<ContactUs />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<SignUp />} />
        <Route path="/profile" element={<Profile />} />
        <Route
          path="/viewProduct/:productId"
          element={role == "SELLER" && <ViewProduct />}
        />
        <Route path="/seller/dashboard" element={<SellerDashboard />} />
        <Route path="/seller/manageProducts" element={<ManageProducts />} />
        <Route
          path="/seller/manageProducts/addProduct"
          element={<AddProduct />}
        />
        <Route path="/seller/myShop" element={<MyShop />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
