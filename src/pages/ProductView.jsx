import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Modal, Form, Carousel, Card } from 'react-bootstrap';
import Navbar from '../componants/Navbar';
import '../assets/scss/productview.scss';

const ProductView = () => {
  const { shopId, productId } = useParams();
  const navigate = useNavigate();
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enquiryForm, setEnquiryForm] = useState({
    name: '',
    email: '',
    contactNo: '',
    message: ''
  });

  const loadProductDetails = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/user/getProductDetails/${productId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const result = await response.json();
      setProduct(result);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching product:", error);
      setLoading(false);
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
      // Filter out the current product and set related products
      const filtered = result.filter(item => item.id !== parseInt(productId));
      setRelatedProducts(filtered);
    } catch (error) {
      console.error("Error fetching shop products:", error);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    loadProductDetails();
    loadShopProducts();
  }, [productId, shopId]);

  const handleProductClick = (productId) => {
    navigate(`/shop/${shopId}/product/${productId}`);
    window.scrollTo(0, 0);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  const handleEnquirySubmit = (e) => {
    e.preventDefault();
    console.log('Product ID:', productId);
    console.log('Enquiry Details:', enquiryForm);
    setShowEnquiryModal(false);
    setEnquiryForm({ name: '', email: '', contactNo: '', message: '' });
  };

  const handleWhatsAppShare = () => {
    const message = `Check out this ${product.name} - ₹${product.price}\n${window.location.href}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <>
      <Navbar />
      <Container className="product-view-container my-4">
        <Button
          variant="outline-primary"
          className="back-button mb-4"
          onClick={() => navigate(`/shop/${shopId}`)}
        >
          <i className="bi bi-arrow-left"></i> Back to Shop
        </Button>

        <Row className="main-content">
          <Col lg={6} className="mb-4">
            <div className="product-image-container">
              <Carousel interval={null}>
                {/* Temporarily duplicate the same image 4 times for demonstration */}
                {[...Array(4)].map((_, index) => (
                  <Carousel.Item key={index}>
                    <img
                      src={
                        product.imageUrl || "https://via.placeholder.com/400"
                      }
                      alt={`${product.name} - View ${index + 1}`}
                      className="main-image"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/400";
                      }}
                    />
                  </Carousel.Item>
                ))}
              </Carousel>
            </div>
          </Col>

          <Col lg={6}>
            <div className="product-details">
              <h1>{product.name}</h1>
              <div className="price">₹{product.price}</div>

              <div className="stock-status">
                {product.stock > 0 ? (
                  <span className="in-stock">
                    In Stock ({product.stock} available)
                  </span>
                ) : (
                  <span className="out-of-stock">Out of Stock</span>
                )}
              </div>

              <div className="description">
                <h4>Description</h4>
                <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quod omnis necessitatibus temporibus sint tenetur? Nobis veritatis fugit voluptas aperiam molestias magni sint impedit nesciunt. Adipisci nesciunt numquam quam, corrupti sint voluptate voluptas impedit nulla? Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quibusdam omnis amet incidunt hic ipsum, asperiores expedita veniam aut possimus nesciunt pariatur magni aliquid modi vero ratione vitae dolorum cupiditate nobis eaque, at eum excepturi. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repudiandae molestias reprehenderit pariatur omnis? Rem totam eos ullam quibusdam nam consectetur corrupti fuga sunt quisquam illum culpa nostrum asperiores labore, tenetur illo explicabo reprehenderit laborum! Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolore veritatis reprehenderit assumenda ratione aliquid odio eligendi commodi deserunt, tempore, nulla iste explicabo esse aperiam recusandae neque omnis delectus. Natus maxime animi officia voluptates Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit, aspernatur architecto. Deleniti facilis qui quas, minus iusto inventore debitis, dolore provident ea eaque, facere at ut placeat veniam quidem? Neque incidunt nam rerum eius.</p>
              </div>

              <div className="specifications mt-4">
                <h4>Additional Details</h4>
                <ul>
                  <li>
                    <strong>Category:</strong> {product.category}
                  </li>
                  <li>
                    <strong>Status:</strong> {product.status}
                  </li>
                  {product.specifications &&
                    product.specifications.map((spec, index) => (
                      <li key={index}>
                        <strong>{spec.split(":")[0]}</strong>:{" "}
                        {spec.split(":")[1]}
                      </li>
                    ))}
                </ul>
              </div>
            </div>
            <div className="actions mt-4 d-flex flex-row gap-2">
              <Button
                variant="success"
                className="w-100 mb-3"
                onClick={handleWhatsAppShare}
              >
                <i className="bi bi-whatsapp"></i> Share on WhatsApp
              </Button>
              <Button
                variant="primary"
                className="w-100 mb-3 p-2"
                onClick={() => setShowEnquiryModal(true)}
              >
                <i className="bi bi-chat-dots"></i> Enquire Now
              </Button>
            </div>
          </Col>
        </Row>

        {/* Add Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="related-products mt-5">
            <h3 className="mb-4">More Products from this Shop</h3>
            <Row>
              {relatedProducts.map((relatedProduct) => (
                <Col key={relatedProduct.id} md={3} className="mb-4">
                  <Card
                    className="product-card h-100"
                    onClick={() => handleProductClick(relatedProduct.id)}
                    style={{ cursor: "pointer" }}
                  >
                    <Card.Img
                      variant="top"
                      src={
                        relatedProduct.imageUrl ||
                        "https://via.placeholder.com/400"
                      }
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/400";
                      }}
                      style={{ height: "200px", objectFit: "contain" }}
                    />
                    <Card.Body>
                      <Card.Title className="h6">
                        {relatedProduct.name}
                      </Card.Title>
                      <Card.Text className="price mb-2">
                        ₹{relatedProduct.price}
                      </Card.Text>
                      <div className="stock-status">
                        {relatedProduct.stock > 0 ? (
                          <small className="text-success">In Stock</small>
                        ) : (
                          <small className="text-danger">Out of Stock</small>
                        )}
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        )}
      </Container>

      {/* Keep the Enquiry Modal as is */}
      <Modal show={showEnquiryModal} onHide={() => setShowEnquiryModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Product Enquiry</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEnquirySubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                required
                value={enquiryForm.name}
                onChange={(e) =>
                  setEnquiryForm({ ...enquiryForm, name: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                required
                value={enquiryForm.email}
                onChange={(e) =>
                  setEnquiryForm({ ...enquiryForm, email: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Contact Number</Form.Label>
              <Form.Control
                type="tel"
                required
                value={enquiryForm.contactNo}
                onChange={(e) =>
                  setEnquiryForm({
                    ...enquiryForm,
                    contactNo: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Message</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                required
                value={enquiryForm.message}
                onChange={(e) =>
                  setEnquiryForm({ ...enquiryForm, message: e.target.value })
                }
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100">
              Submit Enquiry
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ProductView;





