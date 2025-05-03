import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Form, InputGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaSearch, FaMapMarkerAlt, FaArrowRight, FaStar, FaFilter } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { toast, Bounce } from 'react-toastify';
import Navbar from '../componants/Navbar';
import '../assets/scss/browseshops.scss';

const BrowseShops = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [allShops, setAllShops] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState("name");
  const [viewMode, setViewMode] = useState("grid");

  // Get unique categories from actual shop data
  const categories = ["All", ...new Set(allShops.map((shop) => shop.shopCategory))];

  const filterShops = () => {
    let filtered = [...allShops];
    
    // Apply category filter
    if (selectedCategory !== "All") {
      filtered = filtered.filter(shop => shop.shopCategory === selectedCategory);
    }
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (shop) =>
          shop.shopName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          shop.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          shop.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          shop.state?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply sorting
    switch(sortBy) {
      case "name":
        filtered.sort((a, b) => a.shopName.localeCompare(b.shopName));
        break;
      case "rating":
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "newest":
        // Assuming there's a createdAt field, otherwise this won't work correctly
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      default:
        break;
    }
    
    return filtered;
  };

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
            src={shop.image || getDefaultImage()}
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
          <Card.Text className="shop-description">{shop.description}</Card.Text>
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

  const renderShopListItem = (shop) => (
    <motion.div 
      key={shop.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="shop-list-item"
    >
      <Row className="align-items-center">
        <Col md={2} className="shop-image-col">
          <img 
            src={shop.image || getDefaultImage()}
            alt={shop.shopName}
            onError={(e) => {
              e.target.src = getDefaultImage();
            }}
          />
        </Col>
        <Col md={7} className="shop-details-col">
          <h3>{shop.shopName}</h3>
          <div className="shop-rating">
            <div className="stars">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className={i < (shop.rating || 4) ? "star-filled" : "star-empty"} />
              ))}
            </div>
            <span className="rating-count">{shop.reviewCount || "New"}</span>
          </div>
          <p className="shop-description">{shop.description}</p>
          <div className="shop-location">
            <FaMapMarkerAlt />
            <span>{shop.city}, {shop.state}</span>
          </div>
          {shop.shopCategory && (
            <Badge className="category-badge-list">{shop.shopCategory}</Badge>
          )}
        </Col>
        <Col md={3} className="shop-action-col text-end">
          <Link to={localStorage.getItem("role") ? `/shop/${shop.id}` : `/auth/login`}>
            <Button variant="primary" className="visit-btn">
              Visit Shop <FaArrowRight />
            </Button>
          </Link>
        </Col>
      </Row>
    </motion.div>
  );

  useEffect(() => {
    loadShops();
  }, []); 

  return (
    <div className="browse-shops-page">
      <Navbar />
      
      {/* Page Header */}
      <div className="page-header">
        <Container>
          <h1>Browse Local Shops</h1>
          <p>Discover and connect with local businesses in your area</p>
        </Container>
      </div>
      
      {/* Search and Filter Section */}
      <section className="search-filter-section">
        <Container>
          <Row>
            <Col lg={8}>
              <InputGroup className="search-input-group">
                <InputGroup.Text>
                  <FaSearch />
                </InputGroup.Text>
                <Form.Control
                  placeholder="Search by shop name, location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button variant="primary">Search</Button>
              </InputGroup>
            </Col>
            <Col lg={4}>
              <div className="view-sort-controls">
                <Form.Select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="sort-select"
                >
                  <option value="name">Sort by Name</option>
                  <option value="rating">Sort by Rating</option>
                  <option value="newest">Sort by Newest</option>
                </Form.Select>
                <div className="view-toggle">
                  <Button 
                    variant={viewMode === "grid" ? "primary" : "outline-primary"}
                    onClick={() => setViewMode("grid")}
                    className="view-btn"
                  >
                    Grid
                  </Button>
                  <Button 
                    variant={viewMode === "list" ? "primary" : "outline-primary"}
                    onClick={() => setViewMode("list")}
                    className="view-btn"
                  >
                    List
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      
      {/* Main Content */}
      <section className="shops-content-section">
        <Container>
          <Row>
            {/* Sidebar Filters */}
            <Col lg={3} className="filters-sidebar">
              <div className="filter-card">
                <div className="filter-header">
                  <FaFilter />
                  <h3>Filter Shops</h3>
                </div>
                
                <div className="filter-group">
                  <h4>Categories</h4>
                  {categories.map((category) => (
                    <Form.Check
                      key={category}
                      type="radio"
                      id={`category-${category}`}
                      label={category}
                      name="category"
                      checked={selectedCategory === category}
                      onChange={() => setSelectedCategory(category)}
                      className="filter-option"
                    />
                  ))}
                </div>
                
                <Button 
                  variant="outline-secondary" 
                  className="reset-filters-btn"
                  onClick={() => {
                    setSelectedCategory("All");
                    setSearchTerm("");
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            </Col>
            
            {/* Shops Listing */}
            <Col lg={9}>
              {isLoading ? (
                <div className="loading-container">
                  <div className="spinner"></div>
                  <p>Loading shops...</p>
                </div>
              ) : (
                <>
                  <div className="results-header">
                    <h2>
                      {filterShops().length} {filterShops().length === 1 ? 'Shop' : 'Shops'} Found
                    </h2>
                    {selectedCategory !== "All" && (
                      <Badge className="filter-badge">
                        Category: {selectedCategory}
                      </Badge>
                    )}
                    {searchTerm && (
                      <Badge className="filter-badge">
                        Search: "{searchTerm}"
                      </Badge>
                    )}
                  </div>
                  
                  {filterShops().length > 0 ? (
                    viewMode === "grid" ? (
                      <div className="shops-grid">
                        {filterShops().map(renderShopCard)}
                      </div>
                    ) : (
                      <div className="shops-list">
                        {filterShops().map(renderShopListItem)}
                      </div>
                    )
                  ) : (
                    <div className="no-results">
                      <p>No shops found matching your criteria. Try changing your filters or search term.</p>
                      <Button 
                        variant="outline-primary"
                        onClick={() => {
                          setSelectedCategory("All");
                          setSearchTerm("");
                        }}
                      >
                        Clear Filters
                      </Button>
                    </div>
                  )}
                </>
              )}
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default BrowseShops;