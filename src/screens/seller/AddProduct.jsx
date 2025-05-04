import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Form, Container, Row, Col, Card } from "react-bootstrap";
import Navbar from "../../componants/Navbar";
import { useNavigate } from "react-router-dom";
import { FaUpload, FaTag, FaBoxOpen, FaInfoCircle, FaDollarSign, FaImage } from "react-icons/fa";
import "./styles/AddProduct.css"; // Using direct CSS instead of SCSS

const AddProduct = () => {
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
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

  // Add product function
  const onSubmit = async(data) => {
    const token = localStorage.getItem("token");
    console.log("Product added:", data);

    // Create FormData object
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", data.price);
    formData.append("stock", data.stock);
    formData.append("category", data.category);
    formData.append("imageUrl", data.imageUrl[0]);

    //sending data to backend
    try {
      const response = await fetch(
        "http://localhost:8080/api/seller/addproduct",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      //response from the backend
      const result = await response.json();
      console.log(result);

      if (result.success) {
        // Show success message
        alert(result.message);
        navigate("/seller/manageProducts");
      } else {
        // Show error message
        alert(result.message || "Failed to add product");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      alert("An error occurred while adding the product");
    }
  };

  return (
    <>
      <Navbar />
      <div className="add-product-page">
        <Container>
          <div className="page-header">
            <h1><FaBoxOpen className="icon" /> Add New Product</h1>
            <p>Add a new product to your shop inventory</p>
          </div>
          
          <Card className="product-form-card">
            <Card.Body>
              <Form onSubmit={handleSubmit(onSubmit)}>
                <Row>
                  {/* Left Column - Image Upload */}
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
                            <FaImage size={40} />
                            <p>Product Image</p>
                          </div>
                        )}
                      </div>
                      
                      <Form.Group controlId="imageUrl" className="mt-3">
                        <Form.Label className="upload-btn">
                          <FaUpload className="me-2" /> Choose Product Image
                          <Form.Control 
                            type="file" 
                            hidden
                            accept="image/*"
                            {...register("imageUrl", { 
                              required: "Product image is required",
                              onChange: handleImageChange
                            })}
                          />
                        </Form.Label>
                        {errors.imageUrl && (
                          <div className="text-danger mt-2 small">{errors.imageUrl.message}</div>
                        )}
                        <div className="image-hint">
                          <FaInfoCircle className="me-1" /> 
                          Upload a clear image of your product (JPG, PNG)
                        </div>
                      </Form.Group>
                    </div>
                  </Col>
                  
                  {/* Right Column - Product Details */}
                  <Col lg={8} md={12}>
                    <div className="product-details-section">
                      <h4 className="section-title">
                        <FaTag className="section-icon" /> Product Information
                      </h4>
                      
                      <Row>
                        {/* Product Name */}
                        <Col md={12}>
                          <Form.Group className="mb-3">
                            <Form.Label>Product Name</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="Enter product name"
                              {...register("name", { 
                                required: "Product name is required" 
                              })}
                              isInvalid={!!errors.name}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.name?.message}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                        
                        {/* Category */}
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Category</Form.Label>
                            <Form.Select
                              {...register("category", { 
                                required: "Category is required" 
                              })}
                              isInvalid={!!errors.category}
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
                              {errors.category?.message}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                        
                        {/* Price */}
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Price ($)</Form.Label>
                            <div className="price-input-wrapper">
                              <div className="currency-symbol">
                                <FaDollarSign />
                              </div>
                              <Form.Control
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                className="price-input"
                                {...register("price", { 
                                  required: "Price is required", 
                                  min: {
                                    value: 0.01,
                                    message: "Price must be greater than 0"
                                  }
                                })}
                                isInvalid={!!errors.price}
                              />
                            </div>
                            <Form.Control.Feedback type="invalid">
                              {errors.price?.message}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                        
                        {/* Stock */}
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Stock Quantity</Form.Label>
                            <Form.Control
                              type="number"
                              placeholder="Enter available quantity"
                              {...register("stock", { 
                                required: "Stock quantity is required", 
                                min: {
                                  value: 0,
                                  message: "Stock cannot be negative"
                                }
                              })}
                              isInvalid={!!errors.stock}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.stock?.message}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                        
                        {/* Description */}
                        <Col md={12}>
                          <Form.Group className="mb-3">
                            <Form.Label>Product Description</Form.Label>
                            <Form.Control
                              as="textarea"
                              rows={4}
                              placeholder="Describe your product in detail..."
                              {...register("description", {
                                required: "Description is required",
                                minLength: {
                                  value: 20,
                                  message: "Description should be at least 20 characters"
                                }
                              })}
                              isInvalid={!!errors.description}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.description?.message}
                            </Form.Control.Feedback>
                            <div className="form-text">
                              A good description helps customers understand your product better.
                            </div>
                          </Form.Group>
                        </Col>
                      </Row>
                    </div>
                  </Col>
                </Row>
                
                <div className="form-actions">
                  <Button 
                    variant="outline-secondary" 
                    onClick={() => navigate("/seller/manageProducts")}
                    className="cancel-btn"
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="primary" 
                    type="submit"
                    className="submit-btn"
                  >
                    <FaBoxOpen className="me-2" /> Add Product
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Container>
      </div>
    </>
  );
};

export default AddProduct;
