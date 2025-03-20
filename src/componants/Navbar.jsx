import { Link } from 'react-router-dom'
import AuthContext from '../Utility/AuthContext';
import { useContext } from 'react';

const Navbar = () => {
  //taking user role and login status
  const {role} = useContext(AuthContext);
  // console.log(role)
  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/home">
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
                    <Link className="nav-link active" aria-current="page" to="/home">
                      Home
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/about">
                      About Us
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/contactus">
                      Contact Us
                    </Link>
                  </li>
                </ul>
                <Link to="/auth/login" style={{ marginRight: "20px" }}>
                  Login
                </Link>
                <Link to="/auth/register" style={{ marginRight: "20px" }}>
                  Register
                </Link>
                <form className="d-flex" role="search">
                  <input
                    className="form-control me-2"
                    type="search"
                    placeholder="Search"
                    aria-label="Search"
                  />
                  <button className="btn btn-outline-success" type="submit">
                    Search
                  </button>
                </form>
              </>
            )}

            {/* if role is user */}
            {role == "USER" && (
              <>
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                  <li className="nav-item">
                    <a className="nav-link active" aria-current="page" href="#">
                      Home
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="#">
                      Browse Shops
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="#">
                      Orders
                    </a>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/user/dashboard">
                      Dashboard
                    </Link>
                  </li>
                </ul>
                <ul
                  className="navbar-nav me-auto mb-2 mb-lg-0"
                  style={{ marginLeft: "60vw" }}
                >
                  <li className="nav-item">
                    <a className="nav-link" href="#">
                      Logout
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="#">
                      Profile
                    </a>
                  </li>
                </ul>
              </>
            )}

            {/* if role is seller */}
            {role == "SELLER" && (
              <>
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                  <li className="nav-item">
                    <Link className="nav-link active" aria-current="page" to="/seller/dashboard">
                      Home
                    </Link>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="#">
                      My Shop
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="#">
                      Add Products
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="#">
                      Orders
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="#">
                      Dashboard
                    </a>
                  </li>
                </ul>
                <ul
                  className="navbar-nav me-auto mb-2 mb-lg-0"
                  style={{ marginLeft: "60vw" }}
                >
                  <li className="nav-item">
                    <a className="nav-link" href="#">
                      Logout
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="#">
                      Profile
                    </a>
                  </li>
                </ul>
              </>
            )}

            {/* if role is seller */}
            {role == "ADMIN" && (
              <>
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                  <li className="nav-item">
                    <Link className="nav-link active" aria-current="page" to="/admin/dashboard">
                      Dashboard
                    </Link>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="#">
                      Manage Users
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="#">
                      Manage Shops
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="#">
                      Reports
                    </a>
                  </li>
                  
                </ul>
                <ul
                  className="navbar-nav me-auto mb-2 mb-lg-0"
                  style={{ marginLeft: "50vw" }}
                >
                  <li className="nav-item">
                    <a className="nav-link" href="#">
                      Logout
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="#">
                      Profile
                    </a>
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
