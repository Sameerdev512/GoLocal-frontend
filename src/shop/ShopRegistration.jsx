import React from 'react'   
import { Form, useForm } from 'react-hook-form'

const ShopRegistration = () => {
   const {
     register,
     handleSubmit,
     formState: { errors },
   } = useForm();

    const onSubmit = (data) =>{
        console.log(data)
    }
  return (
    <div className="container mt-4">
      <h2 className="text-center">Shop Registration</h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="container p-4 border rounded shadow-sm"
        style={{ width: "50vw", marginTop: "5vh", marginBottom: "20vh" }}
      >
        {/* Shop Name */}
        <div className="mb-3">
          <label className="form-label">Shop Name</label>
          <input
            type="text"
            className="form-control"
            {...register("shopName", { required: "Shop name is required" })}
          />
          {errors.shopName && (
            <small className="text-danger">{errors.shopName.message}</small>
          )}
        </div>

        {/* Owner Name */}
        <div className="mb-3">
          <label className="form-label">Owner Name</label>
          <input
            type="text"
            className="form-control"
            {...register("ownerName", { required: "Owner name is required" })}
          />
          {errors.ownerName && (
            <small className="text-danger">{errors.ownerName.message}</small>
          )}
        </div>

        {/* Address */}
        <div className="mb-3">
          <label className="form-label">Address</label>
          <textarea
            className="form-control"
            {...register("address", { required: "Address is required" })}
          />
          {errors.address && (
            <small className="text-danger">{errors.address.message}</small>
          )}
        </div>

        {/* Country */}
        <div className="mb-3">
          <label className="form-label">Country</label>
          <input
            className="form-control"
            {...register("country", { required: "Country is required" })}
          />
          {errors.country && (
            <small className="text-danger">{errors.country.message}</small>
          )}
        </div>

        {/* State */}
        <div className="mb-3">
          <label className="form-label">State</label>
          <input
            className="form-control"
            {...register("state", { required: "State is required" })}
          />
          {errors.state && (
            <small className="text-danger">{errors.state.message}</small>
          )}
        </div>

        {/* City */}
        <div className="mb-3">
          <label className="form-label">City</label>
          <input
            className="form-control"
            {...register("city", { required: "City is required" })}
          />
          {errors.city && (
            <small className="text-danger">{errors.city.message}</small>
          )}
        </div>

        {/* Contact */}
        <div className="mb-3">
          <label className="form-label">Contact Number</label>
          <input
            type="tel"
            className="form-control"
            {...register("contact", {
              required: "Contact number is required",
              pattern: {
                value: /^[0-9]{10}$/,
                message: "Enter a valid 10-digit number",
              },
            })}
          />
          {errors.contact && (
            <small className="text-danger">{errors.contact.message}</small>
          )}
        </div>

        {/* Shop Type */}
        <div className="mb-3">
          <label className="form-label">Shop Type</label>
          <select
            className="form-control"
            {...register("shopType", { required: "Select a shop type" })}
          >
            <option value="">Select Type</option>
            <option value="Clothing">Clothing</option>
            <option value="Electronics">Electronics</option>
            <option value="Grocery">Grocery</option>
            <option value="Other">Other</option>
          </select>
          {errors.shopType && (
            <small className="text-danger">{errors.shopType.message}</small>
          )}
        </div>

        {/* GSTIN number */}
        <div className="mb-3">
          <label className="form-label">GSTIN Number</label>
          <input
            className="form-control"
            {...register("gstin", { required: "GSTIN is required" })}
          />
          {errors.gstin && (
            <small className="text-danger">{errors.gstin.message}</small>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="btn btn-primary w-100"
          style={{ marginTop: "2vh" }}
        >
          Register Shop
        </button>
      </form>
    </div>
  );
}

export default ShopRegistration
