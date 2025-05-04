import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge, Form } from 'react-bootstrap';
import { FaArrowLeft, FaEdit, FaSave, FaTimes, FaBox, FaExclamationTriangle, FaStore } from 'react-icons/fa';
import Navbar from '../../componants/Navbar';
import '../../assets/scss/myshop.scss';

const MyShop = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [shopInfo, setShopInfo] = useState({});
  const [editedInfo, setEditedInfo] = useState({});
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStockProducts: 0
  });
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleInputChange = (e) => {
    setEditedInfo({
      ...editedInfo,
      [e.target.name]: e.target.value
    });
  };

  const loadShopDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:8080/api/seller/getShopDetails`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch shop details");
      }

      const result = await response.json();
    console.log(result)
      setShopInfo(result);
      setEditedInfo(result);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching shop details:", error);
      setLoading(false);
    }
  };

  const loadSellerProducts = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/seller/findAllProducts`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const result = await response.json();
      console.log(result);
      setRecentProducts(result.slice(0, 4));
      
      // Calculate low stock products (items with stock < 10)
      const lowStockCount = result.filter(item => item.stock < 10).length;
      
      setStats({
        totalProducts: result.length,
        lowStockProducts: lowStockCount
      });
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/seller/updateShopDetails/${shopInfo.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(editedInfo),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update shop");
      }

      setShopInfo(editedInfo);
      setIsEditing(false);
      alert("Shop details updated successfully!");
    } catch (error) {
      console.error("Error updating shop:", error);
      alert("Failed to update shop details: " + error.message);
    }
  };

  useEffect(() => {
    loadShopDetails();
    loadSellerProducts();
  }, []);

  if (loading) {
    return (
      <div className="shop-dashboard">
        <Container>
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading shop details...</p>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="shop-dashboard">
        <Container>
          <div className="shop-top-nav">
            <div className="d-flex justify-content-between align-items-center">
              <Link to="/seller/dashboard" className="back-nav-button">
                <FaArrowLeft /> Back to Dashboard
              </Link>
            </div>
            <div className="shop-status mt-2">
              <Badge
                className={`status-badge ${
                  shopInfo.status === "APPROVED" ? "verified" : ""
                }`}
              >
                {shopInfo.status}
              </Badge>
              </div>
          <h2 className="shop-name">{shopInfo.shopName}</h2>
          </div>

          {/* Stats Section */}
          <div className="stats-section">
            <Row>
              <Col md={4} className="mb-4">
                <div className="stat-card compact">
                  <div className="stat-icon products">
                    <FaBox />
                  </div>
                  <div className="stat-content">
                    <h3 className="stat-value">{stats.totalProducts}</h3>
                    <p className="stat-label">Total Products</p>
                  </div>
                </div>
              </Col>
              <Col md={4} className="mb-4">
                <div className="stat-card compact">
                  <div className="stat-icon low-stock">
                    <FaExclamationTriangle />
                  </div>
                  <div className="stat-content">
                    <h3 className="stat-value">{stats.lowStockProducts}</h3>
                    <p className="stat-label">Low Stock Products</p>
                  </div>
                </div>
              </Col>
              <Col md={4} className="mb-4">
                <div className="stat-card compact">
                  <div className="stat-icon manage">
                    <FaStore />
                  </div>
                  <div className="stat-content">
                    <h3 className="stat-value">
                      <Link
                        to="/seller/manageProducts"
                        className="text-decoration-none text-dark"
                      >
                        Manage
                      </Link>
                    </h3>
                    <p className="stat-label">Inventory Management</p>
                  </div>
                </div>
              </Col>
            </Row>
          </div>

          {/* Shop Details Card */}
          <div className="shop-details-card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h3>Shop Details</h3>
              {!isEditing ? (
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  <FaEdit className="me-1" /> Edit Details
                </Button>
              ) : (
                <div className="d-flex gap-2">
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => {
                      setIsEditing(false);
                      setEditedInfo(shopInfo);
                    }}
                  >
                    <FaTimes className="me-1" /> Cancel
                  </Button>
                  <Button variant="primary" size="sm" onClick={handleUpdate}>
                    <FaSave className="me-1" /> Save Changes
                  </Button>
                </div>
              )}
            </div>
            <div className="card-body">
              <Row>
                <Col md={6}>
                  <div className="form-group">
                    <label>Shop Name</label>
                    {isEditing ? (
                      <Form.Control
                        type="text"
                        name="shopName"
                        value={editedInfo.shopName || ""}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <Form.Control
                        type="text"
                        value={shopInfo.shopName || ""}
                        disabled
                      />
                    )}
                  </div>
                </Col>
                <Col md={6}>
                  <div className="form-group">
                    <label>Owner Name</label>
                    {isEditing ? (
                      <Form.Control
                        type="text"
                        name="ownerName"
                        value={editedInfo.ownerName || ""}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <Form.Control
                        type="text"
                        value={shopInfo.ownerName || ""}
                        disabled
                      />
                    )}
                  </div>
                </Col>
                <Col md={6}>
                  <div className="form-group">
                    <label>Email</label>
                    <Form.Control
                      type="email"
                      value={shopInfo.email || ""}
                      disabled
                    />
                  </div>
                </Col>
                <Col md={6}>
                  <div className="form-group">
                    <label>Contact Number</label>
                    {isEditing ? (
                      <Form.Control
                        type="text"
                        name="contact"
                        value={editedInfo.contact || ""}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <Form.Control
                        type="text"
                        value={shopInfo.contact || ""}
                        disabled
                      />
                    )}
                  </div>
                </Col>
                <Col md={12}>
                  <div className="form-group">
                    <label>Address</label>
                    {isEditing ? (
                      <Form.Control
                        type="text"
                        name="address"
                        value={editedInfo.address || ""}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <Form.Control
                        type="text"
                        value={shopInfo.address || ""}
                        disabled
                      />
                    )}
                  </div>
                </Col>
                <Col md={4}>
                  <div className="form-group">
                    <label>Country</label>
                    {isEditing ? (
                      <Form.Control
                        type="text"
                        name="country"
                        value={editedInfo.country || ""}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <Form.Control
                        type="text"
                        value={shopInfo.country || ""}
                        disabled
                      />
                    )}
                  </div>
                </Col>
                <Col md={4}>
                  <div className="form-group">
                    <label>State</label>
                    {isEditing ? (
                      <Form.Control
                        type="text"
                        name="state"
                        value={editedInfo.state || ""}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <Form.Control
                        type="text"
                        value={shopInfo.state || ""}
                        disabled
                      />
                    )}
                  </div>
                </Col>
                <Col md={4}>
                  <div className="form-group">
                    <label>City</label>
                    {isEditing ? (
                      <Form.Control
                        type="text"
                        name="city"
                        value={editedInfo.city || ""}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <Form.Control
                        type="text"
                        value={shopInfo.city || ""}
                        disabled
                      />
                    )}
                  </div>
                </Col>
                <Col md={6}>
                  <div className="form-group">
                    <label>Shop Category</label>
                    {isEditing ? (
                      <Form.Control
                        type="text"
                        name="shopCategory"
                        value={editedInfo.shopCategory || ""}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <Form.Control
                        type="text"
                        value={shopInfo.shopCategory || ""}
                        disabled
                      />
                    )}
                  </div>
                </Col>
                <Col md={6}>
                  <div className="form-group">
                    <label>Status</label>
                    <Form.Control
                      type="text"
                      value={shopInfo.status || ""}
                      disabled
                    />
                  </div>
                </Col>
                <Col md={6}>
                  <div className="form-group">
                    <label>Opening Time</label>
                    {isEditing ? (
                      <Form.Control
                        type="time"
                        name="openingTime"
                        value={editedInfo.openingTime || "09:00"}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <Form.Control
                        type="text"
                        value={shopInfo.openingTime || "09:00"}
                        disabled
                      />
                    )}
                  </div>
                </Col>
                <Col md={6}>
                  <div className="form-group">
                    <label>Closing Time</label>
                    {isEditing ? (
                      <Form.Control
                        type="time"
                        name="closingTime"
                        value={editedInfo.closingTime || "18:00"}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <Form.Control
                        type="text"
                        value={shopInfo.closingTime || "18:00"}
                        disabled
                      />
                    )}
                  </div>
                </Col>
              </Row>
            </div>
          </div>

          {/* Recent Products Section */}
          {recentProducts.length > 0 && (
            <div className="shop-details-card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h3>Recent Products</h3>
                <Link
                  to="/seller/manageProducts"
                  className="btn btn-outline-primary btn-sm"
                >
                  View All Products
                </Link>
              </div>
              <div className="card-body">
                <Row>
                  {recentProducts.map((product) => (
                    <Col md={6} lg={3} key={product.id} className="mb-4">
                      <Card className="h-100 product-card">
                        <div className="product-img-container">
                          {product.imageUrl ? (
                            <Card.Img
                              variant="top"
                              src={product.imageUrl}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src =
                                  "https://via.placeholder.com/150?text=No+Image";
                              }}
                            />
                          ) : (
                            <div className="no-image-placeholder">
                              <span>No Image</span>
                            </div>
                          )}
                        </div>
                        <Card.Body>
                          <Card.Title className="product-name">
                            {product.name}
                          </Card.Title>
                          <div className="product-price">₹{product.price}</div>
                          <div className="product-stock">
                            Stock:{" "}
                            <span
                              className={
                                product.stock < 10
                                  ? "text-warning"
                                  : "text-success"
                              }
                            >
                              {product.stock}
                            </span>
                          </div>
                        </Card.Body>
                        <Card.Footer className="bg-white border-0">
                          <Link
                            to={`/seller/viewProduct/${product.id}`}
                            className="btn btn-outline-primary btn-sm w-100"
                          >
                            View Details
                          </Link>
                        </Card.Footer>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </div>
            </div>
          )}
        </Container>
      </div>
    </>
  );
};

export default MyShop;
