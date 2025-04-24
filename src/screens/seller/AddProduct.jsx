import React from "react";
import { useForm } from "react-hook-form";
import { Button, Form} from "react-bootstrap";
import Navbar from "../../componants/Navbar";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  const navigate= useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();



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

    //alert the message whether added or not
    alert(result.message);
    // Reset form after submission
    if (result.message == "Product added successfully.") {
      // reset();
      navigate("/seller/manageProducts")
    }
  };

  return (
    <>
      <Navbar />
      <div className="container " style={{ marginTop: "5vh" }}>
        <center>
          <h2>Add New Product</h2>
        </center>
        <Form
          className="container"
          onSubmit={handleSubmit(onSubmit)}
          style={{ width: "50vw", marginTop: "4vh" }}
        >
          {/* File Upload */}
          <div className="mb-3">
            <label>Product Image</label>
            <Form.Control
              type="file"
              {...register("imageUrl", { required: "Image is required" })}
            />
            {errors.imageUrl && (
              <p className="text-danger">{errors.imageUrl.message}</p>
            )}
          </div>

          {/* Product Name */}
          <div className="mb-3">
            <label>Product Name</label>
            <Form.Control
              type="text"
              {...register("name", { required: "Product name is required" })}
            />
            {errors.name && (
              <p className="text-danger">{errors.name.message}</p>
            )}
          </div>

          {/* Product category */}
          <div className="mb-3">
            <label className="form-label">Category</label>
            <select
              className="form-control"
              {...register("category", { required: "Select a category" })}
            >
              <option value="">Select Type</option>
              <option value="Clothing">Clothing</option>
              <option value="Electronics">Electronics</option>
              <option value="Grocery">Grocery</option>
              <option value="Other">Other</option>
            </select>
            {errors.category && (
              <small className="text-danger">{errors.category.message}</small>
            )}
          </div>

          {/* Price */}
          <div className="mb-3">
            <label>Price ($)</label>
            <Form.Control
              type="number"
              step="0.01"
              {...register("price", { required: "Price is required", min: 1 })}
            />
            {errors.price && (
              <p className="text-danger">{errors.price.message}</p>
            )}
          </div>

          {/* Stock */}
          <div className="mb-3">
            <label>Stock</label>
            <Form.Control
              type="number"
              {...register("stock", { required: "Stock is required", min: 0 })}
            />
            {errors.stock && (
              <p className="text-danger">{errors.stock.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="mb-3">
            <label>Description</label>
            <Form.Control
              type="text"
              {...register("description", {
                required: "Description is required",
              })}
            />
            {errors.description && (
              <p className="text-danger">{errors.description.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button variant="primary" type="submit">
            Add Product
          </Button>
        </Form>
      </div>
    </>
  );
};

export default AddProduct;
