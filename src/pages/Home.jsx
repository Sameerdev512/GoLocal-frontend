import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import Navbar from "../componants/Navbar";
import { Link } from "react-router-dom";

const Home = () => {
  const shops = [
    {
      id: 1,
      name: "ABC Fashion Store",
      category: "Clothing",
      image:
        "https://plus.unsplash.com/premium_photo-1664202525979-80d1da46b34b?w=5000&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Y2xvdGglMjBzaG9wfGVufDB8fDB8fHww",
    },
    {
      id: 2,
      name: "Tech Hub",
      category: "Electronics",
      image:
        "https://media.istockphoto.com/id/877238796/photo/modern-male-customer-choosing-laptop-in-the-computer-shop.jpg?s=1024x1024&w=is&k=20&c=b7Udt4GbW00ubCsCOnCf3p9ggQ9EozEBLBlYHv9sZfg=",
    },
    {
      id: 3,
      name: "Fresh Mart",
      category: "Grocery",
      image:
        "https://th.bing.com/th/id/OIP.DXpaUZSzQRS1nOU4bvSktQHaE7?w=240&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7 ",
    },
  ];

  return (
    <div>
      {/* Navbar */}
      <Navbar/>
      {/* Hero Section */}
      <section
        className="hero-section text-center text-white d-flex align-items-center justify-content-center"
        style={{
          background: `url('https://source.unsplash.com/1600x600/?shopping,market') center/cover`,
          height: "60vh",
        }}
      >
        <div className="hero-overlay p-5 bg-dark bg-opacity-50 rounded">
          <h1>Find & Shop Local Businesses Near You</h1>
          <p className="lead">
            Support local retailers by shopping online or visiting their stores.
          </p>
          <input
            type="text"
            className="form-control w-50 mx-auto my-3"
            placeholder="Search for shops or products..."
          />
          <Button variant="primary" className="me-2">
            Explore Shops
          </Button>
          <Link to="/user/shopregistration"><Button variant="success">Register Your Shop</Button></Link>
        </div>
      </section>

      {/* Shops Section */}
      <Container className="my-5">
        <h2 className="text-center mb-4">Featured Shops</h2>
        <Row>
          {shops.map((shop) => (
            <Col key={shop.id} md={4} className="mb-4">
              <Card className="shop-card">
                <Card.Img variant="top" src={shop.image} alt={shop.name} />
                <Card.Body>
                  <Card.Title>{shop.name}</Card.Title>
                  <Card.Text>Category: {shop.category}</Card.Text>
                  <Button variant="primary">View Shop</Button>
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
