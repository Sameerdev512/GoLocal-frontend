import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Modal, Form, Carousel } from 'react-bootstrap';
import Navbar from '../componants/Navbar';
import '../assets/scss/productview.scss';

const ProductView = () => {
  const { shopId, productId } = useParams();
  const navigate = useNavigate();
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [enquiryForm, setEnquiryForm] = useState({
    name: '',
    email: '',
    contactNo: '',
    message: ''
  });

  // Dummy product data
  const product = {
    id: productId,
    name: "Summer Dress",
    category: "Women's Clothing",
    price: 1299,
    images: [
      "https://images.unsplash.com/photo-1596568359553-a56de6970068",
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446",
      "https://images.unsplash.com/photo-1534945773093-1119ae5684ab",
    ],
    description:
      "Beautiful floral summer dress perfect for the season. Made with high-quality breathable fabric that ensures comfort throughout the day. Features a classic cut with modern styling elements.",
    inStock: true,
    specifications: [
      "material: Cotton Blend",
      "care: Machine washable",
      "material2: Cotton Blend",
      "care2: Machine washable",
      "style: Casual Wear",
    ],
  };

  // Dummy related products
  const relatedProducts = [
    {
      id: 1,
      name: "Floral Maxi Dress",
      price: 1499,
      image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446",
    },
    {
      id: 2,
      name: "Casual Sundress",
      price: 999,
      image: "https://images.unsplash.com/photo-1534945773093-1119ae5684ab",
    },
    {
      id: 3,
      name: "Beach Dress",
      price: 1199,
      image: "https://images.unsplash.com/photo-1596568359553-a56de6970068",
    },
  ];

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
                {product.images.map((image, index) => (
                  <Carousel.Item key={index}>
                    <img
                      src={image}
                      alt={`${product.name} - ${index + 1}`}
                      className="main-image"
                    />
                  </Carousel.Item>
                ))}
              </Carousel>
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

          <Col lg={6}>
            <div className="product-details">
              <h1>{product.name}</h1>
              <div className="price">₹{product.price}</div>

              <div className="stock-status">
                {product.inStock ? (
                  <span className="in-stock">In Stock</span>
                ) : (
                  <span className="out-of-stock">Out of Stock</span>
                )}
              </div>

              <div className="description">
                <h4>Description</h4>
                <p>{product.description}</p>
              </div>

              <div className="specifications mt-4">
                <h4>Specifications</h4>
<ul>
                {product.specifications.map((item)=>{
                  return (
                    <li>
                      <strong>{item.split(":")[0]}</strong>:{item.split(":")[1]}
                    </li>
                  );
                })}
                
                </ul>
              </div>
            </div>
          </Col>
        </Row>

        {/* Related Products Section */}
        <div className="related-products mt-5">
          <h3>Related Products</h3>
          <Row>
            {relatedProducts.map((relatedProduct) => (
              <Col key={relatedProduct.id} lg={4} md={6} className="mb-4">
                <div
                  className="related-product-card"
                  onClick={() =>
                    navigate(`/shop/${shopId}/product/${relatedProduct.id}`)
                  }
                >
                  <img src={relatedProduct.image} alt={relatedProduct.name} />
                  <div className="product-info">
                    <h5>{relatedProduct.name}</h5>
                    <p className="price">₹{relatedProduct.price}</p>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </div>

        {/* Enquiry Modal */}
        <Modal
          show={showEnquiryModal}
          onHide={() => setShowEnquiryModal(false)}
        >
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
      </Container>
    </>
  );
};

export default ProductView;

