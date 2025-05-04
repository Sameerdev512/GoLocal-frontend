import React, { useEffect, useState, useRef } from "react";
import { Container, Row, Col, Card, Button, Form, Badge } from "react-bootstrap";
import Navbar from "../componants/Navbar";
import { Link } from "react-router-dom";
import { Bounce, toast } from "react-toastify";
import '../assets/scss/home.scss';
import { FaFilter, FaSearch, FaStore, FaMapMarkerAlt, FaArrowRight, FaStar, FaShoppingBag, FaHandshake, FaUsers } from 'react-icons/fa';
import { motion } from "framer-motion";

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [allShops, setAllShops] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("all");
  const [showAllShops, setShowAllShops] = useState(false);
  const shopsSectionRef = useRef(null);

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
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/api/user/getAllShops`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      console.log(result)
      setAllShops(result);
    } catch(error) {
      console.error("Error fetching shop details:", error);
      toast.error("Failed to load shops", {
        position: "top-right",
        autoClose: 3000,
        transition: Bounce,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getDefaultImage = () => {
    return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZSBBdmFpbGFibGU8L3RleHQ+PC9zdmc+";
  };

  const scrollToShops = () => {
    setShowAllShops(true);
    setTimeout(() => {
      shopsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const renderShopCard = (shop) => (
    <motion.div 
      key={shop.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="shop-card-wrapper"
    >
      <Card className="shop-card">
        <div className="card-image-wrapper">
          <Card.Img 
            variant="top" 
            src={shop.imageUrl || getDefaultImage()}
            alt={shop.shopName}
            onError={(e) => {
              e.target.src = getDefaultImage();
            }}
          />
          {shop.shopCategory && (
            <Badge className="category-badge">{shop.shopCategory}</Badge>
          )}
        </div>
        <Card.Body>
          <Card.Title>{shop.shopName}</Card.Title>
          <div className="shop-rating">
            <div className="stars">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className={i < (shop.rating || 4) ? "star-filled" : "star-empty"} />
              ))}
            </div>
            <span className="rating-count">{shop.reviewCount || "New"}</span>
          </div>
          <Card.Text className="shop-description">{shop.description ? shop.description.split(' ').slice(0, 10).join(' ') : "No description available"}</Card.Text>
          <div className="shop-location">
            <FaMapMarkerAlt />
            <span>{shop.city}, {shop.state}</span>
          </div>
          <Link to={localStorage.getItem("role") ? `/shop/${shop.id}` : `/auth/login`}>
            <Button variant="primary" className="visit-btn">
              Visit Shop <FaArrowRight />
            </Button>
          </Link>
        </Card.Body>
      </Card>
    </motion.div>
  );

  useEffect(() => {
    loadShops();
  }, []); 

  return (
    <div className="home-page">
      <Navbar />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="hero-title"
          >
            Discover <span className="highlight">Local Treasures</span> Near You
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hero-subtitle"
          >
            Connect with local businesses, explore unique products, and support
            your community
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="search-container"
          >
            <div className="search-input-wrapper">
              <FaSearch className="search-icon" />
              <Form.Control
                type="text"
                className="search-input"
                placeholder="Search shops by name, category, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button
              variant="primary"
              className="search-button"
              onClick={scrollToShops}
            >
              Find Shops
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="hero-actions"
          >
            <Link to="/user/shopregistration">
              <Button variant="success" className="register-btn">
                Register Your Shop
              </Button>
            </Link>
            <Button
              variant="outline-light"
              className="explore-btn"
              onClick={scrollToShops}
            >
              Browse All Shops
            </Button>
          </motion.div>
        </div>

        <div className="hero-overlay"></div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <Container>
          <Row className="stats-row">
            <Col md={4}>
              <div className="stat-card">
                <div className="stat-icon">
                  <FaStore />
                </div>
                <div className="stat-content">
                  <h3 className="stat-number">{allShops.length}+</h3>
                  <p className="stat-label">Local Shops</p>
                </div>
              </div>
            </Col>
            <Col md={4}>
              <div className="stat-card">
                <div className="stat-icon">
                  <FaShoppingBag />
                </div>
                <div className="stat-content">
                  <h3 className="stat-number">1000+</h3>
                  <p className="stat-label">Products Available</p>
                </div>
              </div>
            </Col>
            <Col md={4}>
              <div className="stat-card">
                <div className="stat-icon">
                  <FaUsers />
                </div>
                <div className="stat-content">
                  <h3 className="stat-number">500+</h3>
                  <p className="stat-label">Happy Customers</p>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Shops Section */}
      {(showAllShops || activeSection !== "") && (
        <section className="shops-section" ref={shopsSectionRef}>
          <Container>
            {/* Filter Tabs */}
            <div className="filter-tabs">
              <Button
                variant={
                  activeSection === "all" ? "primary" : "outline-primary"
                }
                className="filter-tab"
                onClick={() => setActiveSection("all")}
              >
                All Shops
              </Button>
              {localStorage.getItem("role") && (
                <Button
                  variant={
                    activeSection === "nearby" ? "primary" : "outline-primary"
                  }
                  className="filter-tab"
                  onClick={() => setActiveSection("nearby")}
                >
                  Nearby Shops
                </Button>
              )}
            </div>

            {/* Category Filter */}
            <div className="category-filter">
              <div className="filter-header">
                <div className="filter-icon">
                  <FaFilter />
                </div>
                <h3>Filter by Category</h3>
              </div>
              <div className="category-buttons">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={
                      selectedCategory === category
                        ? "primary"
                        : "outline-primary"
                    }
                    className="category-btn"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            {/* Shops Grid */}
            {isLoading ? (
              <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading shops...</p>
              </div>
            ) : (
              <>
                {activeSection === "nearby" && localStorage.getItem("role") && (
                  <>
                    <div className="section-header">
                      <h2>
                        <span className="emoji">🧭</span> Shops Near You
                      </h2>
                      <div className="section-divider"></div>
                    </div>

                    {filterShops(nearbyShops).length > 0 ? (
                      <div className="shops-grid">
                        {filterShops(nearbyShops).map(renderShopCard)}
                      </div>
                    ) : (
                      <div className="no-results">
                        <p>
                          No nearby shops found. Try changing your filter or
                          search term.
                        </p>
                      </div>
                    )}
                  </>
                )}

                {activeSection === "all" && (
                  <>
                    <div className="section-header">
                      <h2>
                        <span className="emoji">🏪</span> All Shops
                      </h2>
                      <div className="section-divider"></div>
                    </div>

                    {filterShops(allShops).length > 0 ? (
                      <div className="shops-grid">
                        {filterShops(allShops).map(renderShopCard)}
                      </div>
                    ) : (
                      <div className="no-results">
                        <p>
                          No shops found. Try changing your filter or search
                          term.
                        </p>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </Container>
        </section>
      )}

      {/* Features Section */}
      <section className="features-section">
        <Container>
          <h2 className="section-title text-center">Why Choose GoLocal?</h2>
          <Row className="features-row">
            <Col md={4}>
              <div className="feature-card">
                <div className="feature-icon local-icon">
                  <FaHandshake />
                </div>
                <h3>Support Local Economy</h3>
                <p>
                  Every purchase helps strengthen your community and supports
                  local entrepreneurs
                </p>
              </div>
            </Col>
            <Col md={4}>
              <div className="feature-card">
                <div className="feature-icon discover-icon">
                  <FaSearch />
                </div>
                <h3>Discover Unique Products</h3>
                <p>
                  Find one-of-a-kind items and services you won't see in big
                  retail chains
                </p>
              </div>
            </Col>
            <Col md={4}>
              <div className="feature-card">
                <div className="feature-icon connect-icon">
                  <FaMapMarkerAlt />
                </div>
                <h3>Shop Conveniently</h3>
                <p>
                  Browse local shops online and connect directly with business
                  owners
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <Container>
          <h2 className="section-title text-center">What People Are Saying</h2>
          <Row className="testimonials-row">
            <Col md={4}>
              <div className="testimonial-card">
                <div className="quote-mark">"</div>
                <p className="testimonial-text">
                  GoLocal helped me discover amazing shops in my neighborhood
                  that I never knew existed. Now I'm a regular customer at
                  several local businesses!
                </p>
                <div className="testimonial-author">
                  <div className="author-avatar">
                    <img
                      src="https://randomuser.me/api/portraits/women/44.jpg"
                      alt="Customer"
                    />
                  </div>
                  <div className="author-info">
                    <h4>Priya Sharma</h4>
                    <p>Happy Customer</p>
                  </div>
                </div>
              </div>
            </Col>
            <Col md={4}>
              <div className="testimonial-card">
                <div className="quote-mark">"</div>
                <p className="testimonial-text">
                  As a small business owner, this platform has been a
                  game-changer. I've connected with so many new customers who
                  might never have found my shop otherwise.
                </p>
                <div className="testimonial-author">
                  <div className="author-avatar">
                    <img
                      src="https://randomuser.me/api/portraits/men/32.jpg"
                      alt="Shop Owner"
                    />
                  </div>
                  <div className="author-info">
                    <h4>Rajesh Patel</h4>
                    <p>Shop Owner</p>
                  </div>
                </div>
              </div>
            </Col>
            <Col md={4}>
              <div className="testimonial-card">
                <div className="quote-mark">"</div>
                <p className="testimonial-text">
                  The platform is so easy to use! I love being able to browse
                  local shops from home and then visit in person. It's the
                  perfect blend of online convenience and local shopping.
                </p>
                <div className="testimonial-author">
                  <div className="author-avatar">
                    <img
                      src="https://randomuser.me/api/portraits/women/68.jpg"
                      alt="Customer"
                    />
                  </div>
                  <div className="author-info">
                    <h4>Anita Desai</h4>
                    <p>Regular User</p>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <Container>
          <div className="cta-content">
            <h2>Ready to grow your business?</h2>
            <p>Join our platform and reach more customers in your area</p>
            <Link to="/user/shopregistration">
              <Button variant="light" size="lg">
                Register Your Shop Today
              </Button>
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default Home;
