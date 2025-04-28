  import React, { useState, useEffect } from 'react';
  import { useParams } from 'react-router-dom';
  import { Container, Row, Col, Card, Button } from 'react-bootstrap';
  import Navbar from '../componants/Navbar';
  import '../assets/scss/shopview.scss';
  import { Link } from 'react-router-dom';
  import { toast, Bounce } from "react-toastify";

  const ShopView = () => {
    const { shopId } = useParams();
    const [activeCategory, setActiveCategory] = useState('All');
    const [shop, setShop] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadShopDetails = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/user/getShopDetails/${shopId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch shop details');
        }

        const result = await response.json();
        setShop(result);
      } catch (error) {
        console.error("Error fetching shop details:", error);
        toast.error("Failed to load shop details", {
          position: "top-right",
          autoClose: 3000,
          transition: Bounce,
        });
      }
    };

    const loadShopProducts = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/user/shopProducts/${shopId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch shop products');
        }
        const result = await response.json();
        setProducts(result);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching shop products:", error);
        toast.error("Failed to load shop products", {
          position: "top-right",
          autoClose: 3000,
          transition: Bounce,
        });
        setLoading(false);
      }
    };

    useEffect(() => {
      loadShopDetails();
      loadShopProducts();
    }, [shopId]);

    if (loading || !shop) {
      return <div>Loading...</div>;
    }

    // Get unique categories from actual products
    const categories = ['All', ...new Set(products.map(product => product.category))];

    // Filter products by category
    const filteredProducts = activeCategory === 'All' 
      ? products 
      : products.filter(product => product.category === activeCategory);

    const getDefaultImage = () => {
      return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZSBBdmFpbGFibGU8L3RleHQ+PC9zdmc+";
    };

    return (
      <>
        <Navbar />
        <div className="shop-view">
          {/* Shop Header with real shop data */}
          <div className="shop-header" style={{ 
            backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${shop.image || getDefaultImage()})` 
          }}>
            <Container>
              <Row className="align-items-center">
                <Col md={8}>
                  <h1>{shop.shopName}</h1>
                  <p className="description">{shop.description}</p>
                  <div className="shop-meta">
                    <span className="category">
                      <i className="bi bi-tag"></i> {shop.shopCategory}
                    </span>
                    <span className="location">
                      <i className="bi bi-geo-alt"></i> {shop.city}, {shop.state}
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
              {/* Shop Information Sidebar with real shop data */}
              <Col md={3}>
                <Card className="shop-info-card">
                  <Card.Body>
                    <h5>Shop Information</h5>
                    <div className="info-item">
                      <i className="bi bi-person"></i>
                      <div>
                        <strong>Owner</strong>
                        <p>{shop.ownerName}</p>
                      </div>
                    </div>
                    <div className="info-item">
                      <i className="bi bi-telephone"></i>
                      <div>
                        <strong>Contact</strong>
                        <p>{shop.contact}</p>
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
                        <p>{shop.city}, {shop.state}</p>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>

              {/* Products Section with actual data */}
              <Col md={9}>
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

                <Row className="products-grid">
                  {filteredProducts.map((product) => (
                    <Col key={product.id}  className="mb-4">
                      <Card className="product-card">
                        <div className="product-image">
                          <Card.Img 
                            variant="top" 
                            style={{objectFit:"contain"}}
                            src={product.imageUrl || getDefaultImage()} 
                            onError={(e) => {
                              e.target.src = getDefaultImage();
                            }}
                          />
                          {product.status === 'OUT_OF_STOCK' && (
                            <div className="out-of-stock">Out of Stock</div>
                          )}
                        </div>
                        <Card.Body>
                          <Card.Title>{product.name}</Card.Title>
                          <Card.Text className="price">₹{product.price}</Card.Text>
                          <Card.Text className="description">
                            {product.description}
                          </Card.Text>
                          <Link 
                            to={`/shop/${shopId}/product/${product.id}`}
                            className="w-100"
                          >
                            <Button 
                              variant="primary" 
                              className="w-100"
                            >
                              View Product
                            </Button>
                          </Link>
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





