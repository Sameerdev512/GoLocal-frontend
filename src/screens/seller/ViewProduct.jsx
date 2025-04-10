import React, { useEffect, useState } from "react";
import Navbar from "../../componants/Navbar";
import { useParams, useNavigate } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "../../assets/scss/global.scss";

const ViewProduct = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedProduct, setUpdatedProduct] = useState({});

  const showProductDetails = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/products/${productId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const result = await response.json();
      setProduct(result);
      setUpdatedProduct(result);
      console.log("Product details:", result); // To see the status in console
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  const handleInputChange = (e) => {
    setUpdatedProduct({
      ...updatedProduct,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async () => {
    console.log("Updated product:", updatedProduct);

    // Create FormData inside the function
    const formData = new FormData();
    formData.append("description", updatedProduct.description);
    formData.append("price", updatedProduct.price);
    formData.append("stock", updatedProduct.stock);
    formData.append("category", updatedProduct.category);
    formData.append("status", updatedProduct.status); // Now correctly appending just the status string

    try {
      const response = await fetch(
        `http://localhost:8080/api/seller/updateproduct/${productId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        alert("Product updated successfully!");
        setIsEditing(false);
        showProductDetails();
      }
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const handleDelete = async () => {
    const confirm = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirm) return;

    try {
      const response = await fetch(
        `http://localhost:8080/api/seller/products/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        alert("Product deleted successfully!");
        navigate("/manageProducts");
      }
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleAddImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch(
        `http://localhost:8080/api/products/${productId}/images`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        alert("Image added successfully!");
        showProductDetails(); // Refresh the product details
      } else {
        alert("Failed to add image");
      }
    } catch (error) {
      console.error("Error adding image:", error);
      alert("Error adding image");
    }
  };

//   const handleStatusChange = async (newStatus) => {
//     try {
//       const response = await fetch(
//         `http://localhost:8080/api/seller/updateproduct/${productId}/status`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//           body: JSON.stringify({ status: newStatus }),
//         }
//       );

//       if (response.ok) {
//         setUpdatedProduct({ ...updatedProduct, status: newStatus });
//         alert("Product status updated successfully!");
//         showProductDetails();
//       }
//     } catch (error) {
//       console.error("Status update failed:", error);
//       alert("Failed to update status");
//     }
//   };

  useEffect(() => {
    showProductDetails();
  }, []);

  if (!product) return <div className="loading">Loading...</div>;

  return (
    <div>
      <Navbar />
      <div className="view-product-container">
        <div className="product-header">
          <div className="header-left">
            <h2>{product.name}</h2>
          </div>
          <div className="product-actions">
            {!isEditing ? (
              <button
                className="btn btn-edit"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </button>
            ) : (
              <button className="btn btn-save" onClick={handleUpdate}>
                Save Changes
              </button>
            )}
            <button className="btn btn-delete" onClick={handleDelete}>
              Delete
            </button>
          </div>
        </div>

        <div className="product-content">
          <div className="product-images">
            {/* Main Product Image */}
            {product.imageUrl && (
              <div className="main-image">
                <img src={product.imageUrl} alt={product.name} />
              </div>
            )}

            {/* Additional Photos Carousel */}
            {product.photos && product.photos.length > 0 && (
              <div className="photos-carousel">
                <h3>Additional Photos</h3>
                <Carousel showThumbs={true} showStatus={false} infiniteLoop>
                  {product.photos.map((photo, idx) => (
                    <div key={idx}>
                      <img
                        src={photo}
                        alt={`${product.name} - Photo ${idx + 1}`}
                      />
                    </div>
                  ))}
                </Carousel>
              </div>
            )}

            {/* Add Image Button - Only shows in edit mode */}
            {isEditing && (
              <div className="add-image-section">
                <label htmlFor="add-image" className="btn btn-add-image">
                  <span>Add New Image</span>
                  <input
                    type="file"
                    id="add-image"
                    accept="image/*"
                    onChange={handleAddImage}
                    style={{ display: "none" }}
                  />
                </label>
                <p className="image-hint">
                  Supported formats: JPG, PNG, WebP (Max: 5MB)
                </p>
              </div>
            )}
          </div>

          <div className="product-details">
            <div className="details-section">
              <h3>Basic Information</h3>
              <div className="detail-group">
                <div className="detail-item">
                  <label>Price</label>
                  <input
                    name="price"
                    value={updatedProduct.price || ""}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={isEditing ? "editable" : ""}
                  />
                </div>
                <div className="detail-item">
                  <label>Stock</label>
                  <input
                    name="stock"
                    value={updatedProduct.stock || ""}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={isEditing ? "editable" : ""}
                  />
                </div>
                <div className="detail-item">
                  <label>Category</label>
                  <input
                    name="category"
                    value={updatedProduct.category || ""}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={isEditing ? "editable" : ""}
                  />
                </div>
                <div className="detail-item">
                  <label>Availability Status</label>
                  <select
                    name="status"
                    value={updatedProduct.status || "UNAVAILABLE"}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={isEditing ? "editable" : ""}
                  >
                    <option value="AVAILABLE">Available</option>
                    <option value="UNAVAILABLE">Unavailable</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="details-section">
              <h3>Description</h3>
              <textarea
                name="description"
                value={updatedProduct.description || ""}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={isEditing ? "editable" : ""}
                rows="3"
                cols={70}
              />
            </div>

            <div className="details-section">
              <h3>Additional Information</h3>
              <div className="detail-group">
                <div className="detail-item">
                  <label>Created At</label>
                  <input
                    value={new Date(product.createdAt).toLocaleDateString()}
                    disabled
                  />
                </div>
                <div className="detail-item">
                  <label>Last Updated</label>
                  <input
                    value={new Date(product.updatedAt).toLocaleDateString()}
                    disabled
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProduct;
