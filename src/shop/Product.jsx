import React from "react";
import { useForm } from "react-hook-form";

const ProductRegistration = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log("Product Data:", data);
    // Send product data to backend API here
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center">Product Registration</h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-4 border rounded shadow-sm"
      >
        {/* Product Name */}
        <div className="mb-3">
          <label className="form-label">Product Name</label>
          <input
            type="text"
            className="form-control"
            {...register("productName", {
              required: "Product name is required",
            })}
          />
          {errors.productName && (
            <small className="text-danger">{errors.productName.message}</small>
          )}
        </div>

        {/* Category */}
        <div className="mb-3">
          <label className="form-label">Category</label>
          <select
            className="form-control"
            {...register("category", { required: "Category is required" })}
          >
            <option value="">Select Category</option>
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
          <label className="form-label">Price (₹)</label>
          <input
            type="number"
            className="form-control"
            {...register("price", { required: "Price is required", min: 1 })}
          />
          {errors.price && (
            <small className="text-danger">{errors.price.message}</small>
          )}
        </div>

        {/* Stock */}
        <div className="mb-3">
          <label className="form-label">Stock Quantity</label>
          <input
            type="number"
            className="form-control"
            {...register("stock", {
              required: "Stock quantity is required",
              min: 1,
            })}
          />
          {errors.stock && (
            <small className="text-danger">{errors.stock.message}</small>
          )}
        </div>

        {/* Description */}
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            {...register("description", {
              required: "Description is required",
            })}
          />
          {errors.description && (
            <small className="text-danger">{errors.description.message}</small>
          )}
        </div>

        {/* Image Upload */}
        <div className="mb-3">
          <label className="form-label">Upload Product Image</label>
          <input
            type="file"
            className="form-control"
            {...register("image", { required: "Product image is required" })}
          />
          {errors.image && (
            <small className="text-danger">{errors.image.message}</small>
          )}
        </div>

        {/* Submit Button */}
        <button type="submit" className="btn btn-primary w-100">
          Register Product
        </button>
      </form>
    </div>
  );
};

export default ProductRegistration;
