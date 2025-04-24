import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import Navbar from "../componants/Navbar";
import { Link } from "react-router-dom";
import { Bounce, toast } from "react-toastify";

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const allShops = [
    {
      id: 1,
      name: "ABC Fashion Store",
      category: "Clothing",
      rating: 4.5,
      reviews: 128,
      location: "Mumbai, Maharashtra",
      image:
        "https://plus.unsplash.com/premium_photo-1664202525979-80d1da46b34b?w=5000&auto=format&fit=crop&q=60",
      featured: true,
      description:
        "Premium fashion boutique offering latest trends in clothing and accessories",
    },
    {
      id: 2,
      name: "Tech Hub",
      category: "Electronics",
      rating: 4.2,
      reviews: 89,
      location: "Bangalore, Karnataka",
      image:
        "https://media.istockphoto.com/id/877238796/photo/modern-male-customer-choosing-laptop-in-the-computer-shop.jpg?s=1024x1024&w=is&k=20&c=b7Udt4GbW00ubCsCOnCf3p9ggQ9EozEBLBlYHv9sZfg=",
      featured: true,
      description: "Your one-stop shop for all electronic needs",
    },
    {
      id: 3,
      name: "Fresh Mart",
      category: "Grocery",
      rating: 4.7,
      reviews: 156,
      location: "Delhi, NCR",
      image: "https://images.unsplash.com/photo-1578916171728-46686eac8d58",
      featured: false,
      description: "Fresh fruits, vegetables, and daily essentials",
    },
    {
      id: 4,
      name: "Furniture World",
      category: "Furniture",
      rating: 4.3,
      reviews: 67,
      location: "Pune, Maharashtra",
      image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc",
      featured: true,
      description: "Modern and traditional furniture for your home",
    },
    {
      id: 5,
      name: "Beauty Zone",
      category: "Cosmetics",
      rating: 4.6,
      reviews: 94,
      location: "Chennai, Tamil Nadu",
      image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b",
      featured: false,
      description: "Premium beauty and skincare products",
    },
    {
      id: 6,
      name: "Sports Hub",
      category: "Sports",
      rating: 4.4,
      reviews: 73,
      location: "Hyderabad, Telangana",
      image: "https://images.unsplash.com/photo-1596568359553-a56de6970068",
      featured: false,
      description: "Sports equipment and athletic wear",
    },
  ];

  // Mock filter: consider shops in Mumbai, Navi Mumbai, or Pune as 'nearby'
  const nearbyShops = allShops.filter((shop) =>
    ["Mumbai", "Pune", "Navi Mumbai"].some((city) =>
      shop.location.toLowerCase().includes(city.toLowerCase())
    )
  );

  const categories = ["All", ...new Set(allShops.map((shop) => shop.category))];

  const filterShops = (shops) =>
    shops
      .filter(
        (shop) =>
          selectedCategory === "All" || shop.category === selectedCategory
      )
      .filter(
        (shop) =>
          shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          shop.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          shop.location.toLowerCase().includes(searchTerm.toLowerCase())
      );

      useEffect(()=>{
        toast.success("welcome")
      })

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
        <div className="category-filter mb-4 text-center">
          {categories.map((category) => (
            <Button
              key={category}
              variant={
                selectedCategory === category ? "primary" : "outline-primary"
              }
              className="me-2 mb-2"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </Container>

      {/* Nearby Shops */}
      <Container className="my-4">
        <h2 className="text-center mb-4">🧭 Shops Near You</h2>
        <Row>
          {filterShops(nearbyShops).map((shop) => (
            <Col key={shop.id} md={4} className="mb-4">
              <Card className="shop-card h-100">
                <Card.Img variant="top" src={shop.image} alt={shop.name} />
                <Card.Body>
                  <Card.Title>{shop.name}</Card.Title>
                  <Card.Text>{shop.description}</Card.Text>
                  <div className="text-muted">{shop.location}</div>
                  <Link to={`/shop/${shop.id}`}>
                    <Button variant="primary" className="mt-3 w-100">
                      Visit Shop
                    </Button>
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* All Shops */}
      <Container className="my-4">
        <h2 className="text-center mb-4">🏪 All Shops</h2>
        <Row>
          {filterShops(allShops).map((shop) => (
            <Col key={shop.id} md={4} className="mb-4">
              <Card className="shop-card h-100">
                <Card.Img variant="top" src={shop.image} alt={shop.name} />
                <Card.Body>
                  <Card.Title>{shop.name}</Card.Title>
                  <Card.Text>{shop.description}</Card.Text>
                  <div className="text-muted">{shop.location}</div>
                  <Link to={`/shop/${shop.id}`}>
                    <Button variant="primary" className="mt-3 w-100">
                      Visit Shop
                    </Button>
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default Home;
