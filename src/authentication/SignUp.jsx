import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { FaEnvelope, FaLock, FaGoogle, FaFacebook, FaUser } from 'react-icons/fa';
import '../assets/scss/auth.scss';
import Navbar from "../componants/Navbar";

const SignUp = () => {
  const navigate = useNavigate();
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting },
    watch 
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await fetch("http://localhost:8080/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: data.email,
          password: data.password,
          role: "USER"
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to register");
      }

      const result = await response.text();

      if (result === "Username already taken." || result === "User Already Exists with Email!") {
        alert(result);
      } else {
        alert(result);
        navigate("/auth/login");
      }
    } catch (e) {
      console.log(e.message);
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="auth-page">
        <Container fluid>
          <Row className="vh-100">
            {/* Left Side - Image and Text */}
            <Col
              md={6}
              className="auth-image-side d-none d-md-flex align-items-center justify-content-center text-white"
            >
              <div className="text-center p-5">
                <h1 className="display-4 fw-bold mb-4">Join GoLocal</h1>
                <p className="lead mb-4">
                  Create an account to discover and support local businesses in
                  your community
                </p>
                <img
                  src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Shopping%20Cart.png"
                  alt="Sign Up"
                  className="img-fluid mb-4 auth-illustration"
                  style={{ maxWidth: "300px" }}
                />
              </div>
            </Col>

            {/* Right Side - Sign Up Form */}
            <Col
              md={6}
              className="auth-form-side d-flex align-items-center justify-content-center my-5"
            >
              <Card className="auth-card border-0">
                <Card.Body className="p-5">
                  <div className="text-center mb-4">
                    <h2 className="fw-bold">Create Account</h2>
                    <p className="text-muted">Join our community today</p>
                  </div>

                  <Form onSubmit={handleSubmit(onSubmit)}>
                    {/* Full Name */}
                    <Form.Group className="mb-4">
                      <div className="input-group">
                        <span className="input-group-text">
                          <FaUser />
                        </span>
                        <Form.Control
                          type="text"
                          className="p-2"
                          placeholder="Full Name"
                          {...register("fullName", {
                            required: "Full name is required",
                            minLength: {
                              value: 2,
                              message: "Name must be at least 2 characters",
                            },
                          })}
                        />
                      </div>
                      {errors.fullName && (
                        <small className="text-danger">
                          {errors.fullName.message}
                        </small>
                      )}
                    </Form.Group>

                    {/* Email */}
                    <Form.Group className="mb-4">
                      <div className="input-group">
                        <span className="input-group-text">
                          <FaEnvelope />
                        </span>
                        <Form.Control
                          type="email"
                          className="p-2"
                          placeholder="Email address"
                          {...register("email", {
                            required: "Email is required",
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: "Invalid email address",
                            },
                          })}
                        />
                      </div>
                      {errors.email && (
                        <small className="text-danger">
                          {errors.email.message}
                        </small>
                      )}
                    </Form.Group>

                    {/* Password */}
                    <Form.Group className="mb-4">
                      <div className="input-group">
                        <span className="input-group-text">
                          <FaLock />
                        </span>
                        <Form.Control
                          type="password"
                          className="p-2"
                          placeholder="Password"
                          {...register("password", {
                            required: "Password is required",
                            pattern: {
                              value:
                                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{9,}$/,
                              message:
                                "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
                            },
                            minLength: {
                              value: 9,
                              message: "Password must be at least 9 characters",
                            },
                          })}
                        />
                      </div>
                      {errors.password && (
                        <small className="text-danger">
                          {errors.password.message}
                        </small>
                      )}
                    </Form.Group>

                    {/* Confirm Password */}
                    <Form.Group className="mb-4">
                      <div className="input-group">
                        <span className="input-group-text">
                          <FaLock />
                        </span>
                        <Form.Control
                          type="password"
                          className="p-2"
                          placeholder="Confirm Password"
                          {...register("confirmPassword", {
                            required: "Please confirm your password",
                            validate: (value) =>
                              value === watch("password") ||
                              "Passwords do not match",
                          })}
                        />
                      </div>
                      {errors.confirmPassword && (
                        <small className="text-danger">
                          {errors.confirmPassword.message}
                        </small>
                      )}
                    </Form.Group>

                    {/* Terms and Conditions */}
                    <Form.Group className="mb-4">
                      <Form.Check
                        type="checkbox"
                        {...register("terms", {
                          required: "You must accept the terms and conditions",
                        })}
                        label={
                          <span>
                            I agree to the{" "}
                            <Link to="/terms" className="text-primary">
                              Terms and Conditions
                            </Link>
                          </span>
                        }
                      />
                      {errors.terms && (
                        <small className="text-danger">
                          {errors.terms.message}
                        </small>
                      )}
                    </Form.Group>

                    <Button
                      variant="primary"
                      type="submit"
                      className="w-100 mb-4"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Creating Account..." : "Create Account"}
                    </Button>

                    <div className="text-center mb-4">
                      <p className="text-muted">Or sign up with</p>
                      <div className="social-login">
                        <Button variant="outline-primary" className="me-2">
                          <FaGoogle /> Google
                        </Button>
                        <Button variant="outline-primary" className="p-2">
                          <FaFacebook /> Facebook
                        </Button>
                      </div>
                    </div>

                    <div className="text-center">
                      <p className="mb-0">
                        Already have an account?{" "}
                        <Link
                          to="/auth/login"
                          className="text-primary text-decoration-none"
                        >
                          Login
                        </Link>
                      </p>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default SignUp;
