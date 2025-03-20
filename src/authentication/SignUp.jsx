import React from "react";
import Navbar from "../componants/Navbar";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const SignUp = () => {

    const navigate = useNavigate();
  const { register, handleSubmit,formState:{errors}} = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await fetch("http://localhost:8080/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // username: data.username,
          username: data.email,
          password: data.password, 
          role:"USER" //by default role will be user on first time registration
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to register");
      }

      //taking response message from backend
      const result = await response.text();

      if(result == "Username already taken." || result == "User Already Exists with Email!")
      {
        alert(result)
      }
      else{
      //pop-up for registration success
      console.log(result);
      alert(result)
      navigate("/auth/login")
    }
    

    } catch (e) {
        //Error message
      console.log(e.message);
    }
  };

  return (
    <div>
      <Navbar />
      <center>
        <h2>SignUp Now</h2>
      </center>
      <form
        style={{ width: "50vw", marginLeft: "30vw" }}
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="form-group">
          <label>Email address</label>
          <input
            type="email"
            className="form-control"
            aria-describedby="emailHelp"
            placeholder="Enter email"
            {...register("email")}
          />
        </div>

        <br />
        <div className="form-group">
          <label>Password</label>
          <input
            type="text"
            className="form-control"
            placeholder="Password"
            {...register("password"
            //, {
            //   required: "Password is required",
            //   pattern: {
            //     value:
            //       /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{9,20}$/,
            //     message:
            //       "password must contain lowercase,uppercase,number and special character",
            //   },
            //   minLength: {
            //     value: 9,
            //     message: "Password must be at least 9 characters",
            //   },
            // }
            )}
          />
          {errors.password && (
            <p style={{ color: "red" }}>{errors.password.message}</p>
          )}
        </div>
        <div className="form-check">
          <input type="checkbox" className="form-check-input" />
          <label className="form-check-label">Check me out</label>
        </div>
        <input type="Submit" className="btn btn-primary"></input>
      </form>
    </div>
  );
};

export default SignUp;
