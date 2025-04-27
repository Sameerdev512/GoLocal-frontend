import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { FaArrowLeft, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import Navbar from '../../componants/Navbar';
import '../../assets/scss/myshop.scss';

const MyShop = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  // const dummyShopInfo = {
  //   shopName: 'Khatri Steel Furniture',
  //   ownerName: 'Sameer Khatri',
  //   email: 'sameer@gmail.com',
  //   contact: '9111111111',
  //   address: '59/3 shiv bagh colony',
  //   country: 'India',
  //   state: 'Maharashtra',
  //   city: 'Indore',
  //   shopCategory: 'Furniture',
  //   status: 'APPROVED',
  // };

  // const dummyStats = {
  //   totalProducts: 150,
  //   lowStockProducts: 5,
  // };

  const dummyRecentProducts = [
    {
      id: 1,
      name: "Steel Chair",
      price: 2500,
      stock: 20,
      imageUrl: "https://via.placeholder.com/200"
    },
    {
      id: 2,
      name: "Office Desk",
      price: 7500,
      stock: 10,
      imageUrl: "https://via.placeholder.com/200"
    },
    {
      id: 3,
      name: "Filing Cabinet",
      price: 4500,
      stock: 15,
      imageUrl: "https://via.placeholder.com/200"
    },
    {
      id: 4,
      name: "Steel Table",
      price: 3500,
      stock: 8,
      imageUrl: "https://via.placeholder.com/200"
    }
  ];

  const [shopInfo, setShopInfo] = useState([]);
  const [editedInfo, setEditedInfo] = useState(shopInfo);
  const [stats, setStats] = useState({});
  const [recentProducts, setRecentProducts] = useState(dummyRecentProducts);

  const handleInputChange = (e) => {
    setEditedInfo({
      ...editedInfo,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdate = async() => {
    console.log(editedInfo)
    try{
      const response = await fetch(`http://localhost:8080/api/seller/updateShopDetails/${shopInfo.id}`,{
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(editedInfo),
      });

      const result = await response.json();
    console.log(result)
      setShopInfo(result);
      setEditedInfo(result);

    }catch(error){
      console.error("Error fetching shop details:", error);
    }
    setShopInfo(editedInfo);
    setIsEditing(false);
    alert('Shop information updated successfully!');
  };

  const loadShopDetails = async() =>{
    try{
      const response = await fetch(`http://localhost:8080/api/seller/getShopDetails`,{
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const result = await response.json();
    console.log(result)
      setShopInfo(result);
      setEditedInfo(result);

    }catch(error){
      console.error("Error fetching shop details:", error);
    }
  }

  //Tp show the recent products
  const loadSellerProducts = async () => {
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

    const result = await response.json();
    // setProducts(result);
    console.log(result);
    setRecentProducts(result.slice(0,4));
    setStats({
      totalProducts:result.length,
      lowStockProducts:result.reduce((item) => item.stock < 10 ? item + 1 : 0, 0)
    })
  };

  useEffect(() => {
   loadShopDetails();
   loadSellerProducts();
  }, []);

  return (
    <>
      <Navbar />
      <div className="shop-dashboard">
        <Container>
          <button className="back-button" onClick={() => navigate(-1)}>
            <FaArrowLeft /> Back to Dashboard
          </button>
          <div className="shop-header d-flex justify-content-between align-items-center mb-4">
            <h2>{shopInfo.shopName}</h2>
          </div>
          {/* Statistics Cards */}
          <Row className="mb-4 my-5">
            <Col md={4}>
              <Card className="text-center h-100">
                <Card.Body>
                  <h3 className="display-4">{stats.totalProducts}</h3>
                  <Card.Text>Total Products</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="text-center h-100 bg-warning bg-opacity-10">
                <Card.Body>
                  <h3 className="display-4">{stats.lowStockProducts}</h3>
                  <Card.Text>Low Stock Products</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="text-center h-100">
                <Card.Body className="d-flex flex-column justify-content-center">
                  <Link to="/seller/manageProducts">
                    <Button variant="primary" size="lg" className="w-100">
                      Go to Manage Products
                    </Button>
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Edit Detials button */}
          <div className="shop-header d-flex justify-content-between align-items-center mb-2 mt-5">
            <div className="d-flex gap-3 align-items-right">
              {!isEditing ? (
                <Button
                  variant="outline-primary"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Details
                </Button>
              ) : (
                <div className="d-flex gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setIsEditing(false);
                      setEditedInfo(shopInfo); // Reset changes on cancel
                    }}
                  >
                    Cancel
                  </Button>
                  <Button variant="primary" onClick={handleUpdate}>
                    Save Changes
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Shop Information Card */}
          <Card className="shop-details-card mb-4">
            <Card.Body>
              <Row>
                <Col md={6}>
                  {/* Non-editable fields */}
                  <div className="mb-3">
                    <label className="form-label">Shop Name</label>
                    <input
                      type="text"
                      value={shopInfo.shopName}
                      disabled
                      className="form-control"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Owner Name</label>
                    <input
                      type="text"
                      value={shopInfo.ownerName}
                      disabled
                      className="form-control"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      value={shopInfo.email}
                      disabled
                      className="form-control"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Shop Category</label>
                    <input
                      type="text"
                      value={shopInfo.shopCategory}
                      disabled
                      className="form-control"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Opening Time</label>
                    <input
                      type="text"
                      name="openingTime"
                      value={editedInfo.openingTime}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="form-control"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Closing Time</label>
                    <input
                      type="text"
                      name="closingTime"
                      value={editedInfo.closingTime}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="form-control"
                    />
                  </div>
                </Col>
                <Col md={6}>
                  {/* Editable fields */}
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      name="description"
                      value={editedInfo.description}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="form-control"
                      rows="2"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Contact Number</label>
                    <input
                      type="tel"
                      name="contact"
                      value={editedInfo.contact}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="form-control"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Address</label>
                    <textarea
                      name="address"
                      value={editedInfo.address}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="form-control"
                      rows="2"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Country</label>
                    <input
                      type="text"
                      name="country"
                      value={editedInfo.country}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="form-control"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">State</label>
                    <input
                      type="text"
                      name="state"
                      value={editedInfo.state}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="form-control"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">City</label>
                    <input
                      type="text"
                      name="city"
                      value={editedInfo.city}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="form-control"
                    />
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Recent Products */}
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center mt-4">
              <h3 className="mb-0">Recent Products</h3>
              <Link to="/seller/manageProducts">View All</Link>
            </Card.Header>
            <Card.Body>
              <Row>
                {recentProducts.map((product) => (
                  <Col md={3} key={product.id} className="mb-3">
                    <Card>
                      <Card.Img
                        variant="top"
                        src={product.imageUrl}
                        style={{ height: "200px", objectFit: "contain" }}
                      />
                      <Card.Body>
                        <Card.Title>{product.name}</Card.Title>
                        <Card.Text>
                          Price: ₹{product.price}
                          <br />
                          Stock: {product.stock}
                        </Card.Text>
                        <Link to={`/viewProduct/${product.id}`}>
                          <Button variant="outline-primary" size="sm">
                            View Details
                          </Button>
                        </Link>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>
        </Container>
      </div>
    </>
  );
};

export default MyShop;
