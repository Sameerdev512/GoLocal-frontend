import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge, Tabs, Tab } from 'react-bootstrap';
import Navbar from '../componants/Navbar';
import '../assets/scss/shopview.scss';

const ShopView = () => {
  const { shopId } = useParams();
  const [activeCategory, setActiveCategory] = useState('All');
  
  // Dummy shop data - replace with API call
  const shopData = {
    id: 1,
    name: "ABC Fashion Store",
    category: "Clothing",
    rating: 4.5,
    reviews: 128,
    location: "Mumbai, Maharashtra",
    image: "https://plus.unsplash.com/premium_photo-1664202525979-80d1da46b34b",
    description: "Premium fashion boutique offering latest trends",
    contactNumber: "+91 9876543210",
    email: "contact@abcfashion.com",
    openingHours: "10:00 AM - 9:00 PM",
    address: "123, Fashion Street, Mumbai",
    products: [
      {
        id: 1,
        name: "Summer Dress",
        category: "Women's Clothing",
        price: 1299,
        image: "https://images.unsplash.com/photo-1596568359553-a56de6970068",
        description: "Beautiful floral summer dress",
        inStock: true,
      },
      {
        id: 2,
        name: "Denim Jeans",
        category: "Men's Clothing",
        price: 1999,
        image: "https://images.unsplash.com/photo-1596568359553-a56de6970068",
        description: "Classic blue denim jeans",
        inStock: true,
      },

      {
        id: 5,
        name: "Denim Jeans",
        category: "Kids",
        price: 1999,
        image: "https://images.unsplash.com/photo-1596568359553-a56de6970068",
        description: "Classic blue denim jeans",
        inStock: true,
      },
      // Add more products...
    ],
  };

  const [shop, setShop] = useState(shopData);
  const [loading, setLoading] = useState(false);

  // Get unique categories from products
  const categories = ['All', ...new Set(shop.products.map(product => product.category))];

  // Filter products by category
  const filteredProducts = activeCategory === 'All' 
    ? shop.products 
    : shop.products.filter(product => product.category === activeCategory);

  return (
    <>
      <Navbar />
      <div className="shop-view">
        {/* Shop Header */}
        <div className="shop-header" style={{ 
          backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${shop.image})` 
        }}>
          <Container>
            <Row className="align-items-center">
              <Col md={8}>
                <h1>{shop.name}</h1>
                <p className="description">{shop.description}</p>
                <div className="shop-meta">
                  <span className="rating">
                    <i className="bi bi-star-fill"></i> {shop.rating} ({shop.reviews} reviews)
                  </span>
                  <span className="category">
                    <i className="bi bi-tag"></i> {shop.category}
                  </span>
                  <span className="location">
                    <i className="bi bi-geo-alt"></i> {shop.location}
                  </span>
                </div>
              </Col>
              <Col md={4} className="text-md-end">
                <Button variant="outline-light" className="contact-btn">
                  <i className="bi bi-telephone"></i> Contact Shop
                </Button>
              </Col>
            </Row>
          </Container>
        </div>

        {/* Shop Details and Products */}
        <Container className="shop-content">
          <Row>
            {/* Shop Information Sidebar */}
            <Col md={3}>
              <Card className="shop-info-card">
                <Card.Body>
                  <h5>Shop Information</h5>
                  <div className="info-item">
                    <i className="bi bi-clock"></i>
                    <div>
                      <strong>Opening Hours</strong>
                      <p>{shop.openingHours}</p>
                    </div>
                  </div>
                  <div className="info-item">
                    <i className="bi bi-telephone"></i>
                    <div>
                      <strong>Contact</strong>
                      <p>{shop.contactNumber}</p>
                    </div>
                  </div>
                  <div className="info-item">
                    <i className="bi bi-envelope"></i>
                    <div>
                      <strong>Email</strong>
                      <p>{shop.email}</p>
                    </div>
                  </div>
                  <div className="info-item">
                    <i className="bi bi-geo-alt"></i>
                    <div>
                      <strong>Address</strong>
                      <p>{shop.address}</p>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            {/* Products Section */}
            <Col md={9}>
              {/* Category Filter */}
              <div className="category-filter">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={activeCategory === category ? "primary" : "outline-primary"}
                    onClick={() => setActiveCategory(category)}
                    className="me-2 mb-2"
                  >
                    {category}
                  </Button>
                ))}
              </div>

              {/* Products Grid */}
              <Row className="products-grid">
                {filteredProducts.map((product) => (
                  <Col key={product.id}  className="mb-4">
                    <Card className="product-card">
                      <div className="product-image">
                        <Card.Img variant="top" src={product.image} />
                        {!product.inStock && (
                          <div className="out-of-stock">Out of Stock</div>
                        )}
                      </div>
                      <Card.Body>
                        <Card.Title>{product.name}</Card.Title>
                        <Card.Text className="price">₹{product.price}</Card.Text>
                        <Card.Text className="description">
                          {product.description}
                        </Card.Text>
                        <Button 
                          variant="primary" 
                          className="w-100"
                          disabled={!product.inStock}
                        >
                          {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default ShopView;