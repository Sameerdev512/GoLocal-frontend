import { Link, useNavigate, useLocation } from 'react-router-dom'
import AuthContext from '../Utility/AuthContext';
import '../assets/scss/navbar.scss';
import { FaUser, FaQuestionCircle, FaSignOutAlt } from 'react-icons/fa';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem("role");

  const isActive = (path) => {
    return location.pathname === path ? "nav-link active" : "nav-link";
  };

  const handleLogout = () => {
    if(confirm("Would you like to logout")) {
      localStorage.clear();
      navigate("/")
    }
  };

  return (
    <>
      <nav className="navbar navbar-dark bg-dark navbar-expand-lg">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            GoLocal
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            {role == null && (
              <>
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                  <li className="nav-item">
                    <Link className={isActive("/")} to="/">
                      Home
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className={isActive("/about")} to="/about">
                      About Us
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className={isActive("/contactus")} to="/contactus">
                      Contact Us
                    </Link>
                  </li>
                </ul>
                <Link to="/auth/login" style={{ marginRight: "20px" }}>
                  Login
                </Link>
                <Link to="/auth/register" style={{ marginRight: "20px" }}>
                  <span>Register</span>
                </Link>
              </>
            )}

            {/* if role is user */}
            {role == "USER" && (
              <>
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                  <li className="nav-item">
                    <Link className={isActive("/")} to="/">
                      Home
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className={isActive("/browse-shops")} to="/browse-shops">
                      Browse Shops
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className={isActive("/orders")} to="/orders">
                      Orders
                    </Link>
                  </li>
                </ul>
                <ul className="navbar-nav me-auto mb-2 mb-lg-0" style={{ marginLeft: "60vw" }}>
                  <li className="nav-item dropdown profile-dropdown">
                    <div className="nav-link dropdown-toggle" id="profileDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                      <FaUser className="profile-icon" />
                    </div>
                    <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="profileDropdown">
                      <li>
                        <Link className="dropdown-item" to="/profile">
                          <FaUser className="me-2" /> My Profile
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/my-enquiries">
                          <FaQuestionCircle className="me-2" /> My Enquiries
                        </Link>
                      </li>
                      <li><hr className="dropdown-divider" /></li>
                      <li>
                        <button className="dropdown-item" onClick={handleLogout}>
                          <FaSignOutAlt className="me-2" /> Logout
                        </button>
                      </li>
                    </ul>
                  </li>
                </ul>
              </>
            )}

            {/* if role is seller */}
            {role == "SELLER" && (
              <>
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                  <li className="nav-item">
                    <Link className={isActive("/seller/dashboard")} to="/seller/dashboard">
                      Dashboard
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className={isActive("/seller/myShop")} to="/seller/myShop">
                      My Shop
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className={isActive("/about")} to="/about">
                      About Us
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className={isActive("/contactus")} to="/contactus">
                      Contact Us
                    </Link>
                    </li>
                </ul>
                <ul className="navbar-nav me-auto mb-2 mb-lg-0" style={{ marginLeft: "60vw" }}>
                  <li className="nav-item dropdown profile-dropdown">
                    <div className="nav-link dropdown-toggle" id="profileDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                      <FaUser className="profile-icon" />
                    </div>
                    <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="profileDropdown">
                      <li>
                        <Link className="dropdown-item" to="/profile">
                          <FaUser className="me-2" /> My Profile
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/my-enquiries">
                          <FaQuestionCircle className="me-2" /> My Enquiries
                        </Link>
                      </li>
                      <li><hr className="dropdown-divider" /></li>
                      <li>
                        <button className="dropdown-item" onClick={handleLogout}>
                          <FaSignOutAlt className="me-2" /> Logout
                        </button>
                      </li>
                    </ul>
                  </li>
                </ul>
              </>
            )}

            {/* if role is admin */}
            {role == "ADMIN" && (
              <>
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                  <li className="nav-item">
                    <Link className={isActive("/admin/dashboard")} to="/admin/dashboard">
                      Dashboard
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className={isActive("/admin/manage-users")} to="/admin/manage-users">
                      Manage Users
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className={isActive("/admin/manage-shops")} to="/admin/manage-shops">
                      Manage Shops
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className={isActive("/admin/reports")} to="/admin/reports">
                      Reports
                    </Link>
                  </li>
                </ul>
                <ul className="navbar-nav me-auto mb-2 mb-lg-0" style={{ marginLeft: "50vw" }}>
                  <li className="nav-item dropdown profile-dropdown">
                    <div className="nav-link dropdown-toggle" id="profileDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                      <FaUser className="profile-icon" />
                    </div>
                    <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="profileDropdown">
                      <li>
                        <Link className="dropdown-item" to="/profile">
                          <FaUser className="me-2" /> My Profile
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/my-enquiries">
                          <FaQuestionCircle className="me-2" /> My Enquiries
                        </Link>
                      </li>
                      <li><hr className="dropdown-divider" /></li>
                      <li>
                        <button className="dropdown-item" onClick={handleLogout}>
                          <FaSignOutAlt className="me-2" /> Logout
                        </button>
                      </li>
                    </ul>
                  </li>
                </ul>
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar
