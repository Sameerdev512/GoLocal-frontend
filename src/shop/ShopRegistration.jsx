import React, { useState } from 'react'   
import { useForm } from 'react-hook-form'
import Navbar from '../componants/Navbar';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { FaStore, FaUser, FaMapMarkerAlt, FaPhone, FaImage, FaInfoCircle } from 'react-icons/fa';
import '../assets/scss/shopregistration.scss';
import { API_BASE_URL } from '../Utility/config';

const ShopRegistration = () => {
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async(data) => {
    console.log(data);
    
    // Create FormData to handle file upload
    const formData = new FormData();
    formData.append('shopName', data.shopName);
    formData.append('ownerName', data.ownerName);
    formData.append('address', data.address);
    formData.append('country', data.country);
    formData.append('state', data.state);
    formData.append('city', data.city);
    formData.append('contact', data.contact);
    formData.append('shopCategory', data.shopType);
    formData.append('description', data.description);
    formData.append('gstin', data.gstin);
    formData.append("imageUrl", data.shopImage[0]);

    try {
      const response = await fetch(`${API_BASE_URL}/api/user/registershop`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      const result = await response.text();
      alert(result);
      console.log(result);

      // If user registered the shop, update the role in localStorage
      if(result === "Shop registered successfully"){
        localStorage.setItem("role", "SELLER");
        navigate("/seller/dashboard");
      }
    } catch (error) {
      console.error("Error registering shop:", error);
      alert("Failed to register shop. Please try again.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="shop-registration-page">
        <Container>
          <div className="page-header text-center">
            <h1><FaStore className="icon" /> Shop Registration</h1>
            <p>Register your shop on GoLocal and start selling to customers in your area</p>
          </div>
          
          <Card className="registration-card">
            <Card.Body>
              <Form onSubmit={handleSubmit(onSubmit)}>
                <Row>
                  <Col lg={4} md={12} className="mb-4">
                    <div className="image-upload-section">
                      <div 
                        className="image-preview" 
                        style={{ 
                          backgroundImage: imagePreview ? `url(${imagePreview})` : 'none'
                        }}
                      >
                        {!imagePreview && (
                          <div className="placeholder">
                            <FaStore size={40} />
                            <p>Shop Image</p>
                          </div>
                        )}
                      </div>
                      
                      <Form.Group controlId="shopImage" className="mt-3">
                        <Form.Label className="upload-btn">
                          <FaImage className="me-2" /> Choose Shop Image
                          <Form.Control 
                            type="file" 
                            hidden
                            accept="image/*"
                            {...register("shopImage", { 
                              required: "Shop image is required",
                              onChange: handleImageChange
                            })}
                          />
                        </Form.Label>
                        {errors.shopImage && (
                          <div className="text-danger mt-2 small">{errors.shopImage.message}</div>
                        )}
                        <div className="image-hint">
                          <FaInfoCircle className="me-1" /> 
                          Upload a clear image of your shop (JPG, PNG)
                        </div>
                      </Form.Group>
                    </div>
                  </Col>
                  
                  <Col lg={8} md={12}>
                    <Row>
                      {/* Shop Details Section */}
                      <Col md={12}>
                        <h4 className="section-title">
                          <FaStore className="section-icon" /> Shop Details
                        </h4>
                      </Col>
                      
                      {/* Shop Name */}
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Shop Name</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter shop name"
                            {...register("shopName", { required: "Shop name is required" })}
                            isInvalid={!!errors.shopName}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.shopName?.message}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      
                      {/* Owner Name */}
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Owner Name</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter owner name"
                            {...register("ownerName", { required: "Owner name is required" })}
                            isInvalid={!!errors.ownerName}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.ownerName?.message}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      
                      {/* Shop Type */}
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Shop Category</Form.Label>
                          <Form.Select
                            {...register("shopType", { required: "Select a shop category" })}
                            isInvalid={!!errors.shopType}
                          >
                            <option value="">Select Category</option>
                            <option value="Clothing">Clothing</option>
                            <option value="Electronics">Electronics</option>
                            <option value="Grocery">Grocery</option>
                            <option value="Furniture">Furniture</option>
                            <option value="Beauty">Beauty & Personal Care</option>
                            <option value="Food">Food & Beverages</option>
                            <option value="Other">Other</option>
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            {errors.shopType?.message}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      
                      {/* GSTIN number */}
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>GSTIN Number</Form.Label>
                          <Form.Control
                            placeholder="Enter GSTIN number"
                            {...register("gstin", { required: "GSTIN is required" })}
                            isInvalid={!!errors.gstin}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.gstin?.message}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      
                      {/* Description */}
                      <Col md={12}>
                        <Form.Group className="mb-3">
                          <Form.Label>Shop Description</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Describe your shop and what you sell"
                            {...register("description", { required: "Description is required" })}
                            isInvalid={!!errors.description}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.description?.message}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      
                      {/* Contact Section */}
                      <Col md={12} className="mt-2">
                        <h4 className="section-title">
                          <FaMapMarkerAlt className="section-icon" /> Location & Contact
                        </h4>
                      </Col>
                      
                      {/* Address */}
                      <Col md={12}>
                        <Form.Group className="mb-3">
                          <Form.Label>Address</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={2}
                            placeholder="Enter complete shop address"
                            {...register("address", { required: "Address is required" })}
                            isInvalid={!!errors.address}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.address?.message}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      
                      {/* Country */}
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Country</Form.Label>
                          <Form.Control
                            placeholder="Enter country"
                            {...register("country", { required: "Country is required" })}
                            isInvalid={!!errors.country}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.country?.message}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      
                      {/* State */}
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>State</Form.Label>
                          <Form.Control
                            placeholder="Enter state"
                            {...register("state", { required: "State is required" })}
                            isInvalid={!!errors.state}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.state?.message}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      
                      {/* City */}
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>City</Form.Label>
                          <Form.Control
                            placeholder="Enter city"
                            {...register("city", { required: "City is required" })}
                            isInvalid={!!errors.city}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.city?.message}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      
                      {/* Contact */}
                      <Col md={12}>
                        <Form.Group className="mb-3">
                          <Form.Label>Contact Number</Form.Label>
                          <Form.Control
                            type="tel"
                            placeholder="Enter 10-digit contact number"
                            {...register("contact", {
                              required: "Contact number is required",
                              pattern: {
                                value: /^[0-9]{10}$/,
                                message: "Enter a valid 10-digit number",
                              },
                            })}
                            isInvalid={!!errors.contact}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.contact?.message}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                
                <div className="form-actions">
                  <Button variant="secondary" onClick={() => navigate(-1)}>
                    Cancel
                  </Button>
                  <Button variant="primary" type="submit">
                    Register Shop
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Container>
      </div>
    </>
  );
}

export default ShopRegistration
