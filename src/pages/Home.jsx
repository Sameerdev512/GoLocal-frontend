import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import Navbar from "../componants/Navbar";
import { Link } from "react-router-dom";
import { Bounce, toast } from "react-toastify";
import '../assets/scss/home.scss';
import { FaFilter } from 'react-icons/fa';
// import defaultShopImage from '../assets/images/default-shop.png';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [allShops, setAllShops] = useState([]);

  // Get nearby shops based on city from the shop's address
  const nearbyShops = allShops.filter((shop) =>
    ["indore"].some((city) =>
      shop.city?.toLowerCase().includes(city.toLowerCase())
    )
  );

  // Get unique categories from actual shop data
  const categories = ["All", ...new Set(allShops.map((shop) => shop.shopCategory))];

  const filterShops = (shops) =>
    shops
      .filter(
        (shop) =>
          selectedCategory === "All" || shop.shopCategory === selectedCategory
      )
      .filter(
        (shop) =>
          shop.shopName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          shop.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          shop.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          shop.state?.toLowerCase().includes(searchTerm.toLowerCase())
      );

  const loadShops = async() => {
    try {
      const response = await fetch(`http://localhost:8080/api/user/getAllShops`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
         
        },
      });

      const result = await response.json();
      console.log("Shops loaded:", result); // Check the data structure
      setAllShops(result);
    } catch(error) {
      console.error("Error fetching shop details:", error);
      toast.error("Failed to load shops", {
        position: "top-right",
        autoClose: 3000,
        transition: Bounce,
      });
    }
  };

  const getDefaultImage = () => {
    // Using a data URI as fallback to avoid network requests
    return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZSBBdmFpbGFibGU8L3RleHQ+PC9zdmc+";
  };

  const renderShopCard = (shop) => (
    <Col key={shop.id} md={4} className="mb-4">
      <Card className="shop-card h-100">
        <Card.Img 
          variant="top" 
          src={shop.image || getDefaultImage()}
          alt={shop.shopName}
          onError={(e) => {
            e.target.src = getDefaultImage();
          }}
          style={{ height: '200px', objectFit: 'cover' }}
        />
        <Card.Body>
          <Card.Title>{shop.shopName}</Card.Title>
          <div className="shop-details">
           <p>{shop.description}</p>
            <p><strong>Location:</strong>  {shop.city}, {shop.state}</p>
          </div>
          <Link to={`/shop/${shop.id}`}>
            <Button variant="primary" className="mt-3 w-100">
              Visit Shop
            </Button>
          </Link>
        </Card.Body>
      </Card>
    </Col>
  );

  useEffect(() => {
    loadShops();
  }, []); 

  return (
    <div>
      <Navbar />

      {/* Hero Section */}
      <section
        className="hero-section text-center text-white d-flex align-items-center justify-content-center"
        style={{
          background: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://source.unsplash.com/1600x600/?shopping,market') center/cover`,
          height: "60vh",
        }}
      >
        <div className="hero-overlay p-5 rounded">
          <h1>Find & Shop Local Businesses Near You</h1>
          <p className="lead">
            Support local retailers by shopping online or visiting their stores.
          </p>
          <div className="search-container w-75 mx-auto">
            <Form.Control
              type="text"
              className="form-control-lg"
              placeholder="Search shops by name, category, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="mt-4">
            <Link to="/user/shopregistration">
              <Button variant="success" size="lg">
                Register Your Shop
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <Container className="mt-5">
        <div className="filter-header">
          <div className="filter-icon">
            <FaFilter />
          </div>
          <h3>Filter Options</h3>
        </div>
        <div className="category-filter mb-4 text-center">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "primary" : "outline-primary"}
              className="me-2 mb-2"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </Container>

      {/* Nearby Shops */}
      {localStorage.getItem("role")&&
      <Container className="my-4">
        <h2 className="text-center mb-4">🧭 Shops Near You</h2>
        <Row>
          {filterShops(nearbyShops).map(renderShopCard)}
        </Row>
      </Container>
}

      {/* All Shops */}
      <Container className="my-4">
        <h2 className="text-center mb-4">🏪 All Shops</h2>
        <Row>
          {filterShops(allShops).map(renderShopCard)}
        </Row>
      </Container>
    </div>
  );
};

export default Home;
