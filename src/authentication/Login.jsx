import { useContext } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import AuthContext from "../Utility/AuthContext";
import Navbar from "../componants/Navbar";
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { FaEnvelope, FaLock, FaGoogle, FaFacebook } from 'react-icons/fa';
import '../assets/scss/auth.scss';

const Login = ({ message }) => {
  const { setRole, setLogin } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: data.email,
          password: data.password,
        }),
      });

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      const result = await response.json();
      
      localStorage.setItem("token", result.token);
      localStorage.setItem("role", result.role);
      
      setRole(result.role);
      setLogin(true);

      switch (result.role) {
        case "USER":
          navigate("/home");
          break;
        case "ADMIN":
          navigate("/admin/dashboard");
          break;
        case "SELLER":
          navigate("/home");
          break;
      }

    } catch (e) {
      alert(e.message);
      console.log(e.message);
    }
  };

  return (
    <>
    <Navbar/>
    <div className="auth-page">
      <Container fluid>
        <Row className="vh-100">
          {/* Left Side - Login Form */}
          <Col md={6} className="auth-form-side d-flex align-items-center justify-content-center">
            <Card className="auth-card border-0">
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <h2 className="fw-bold">Welcome Back!</h2>
                  <p className="text-muted">Please login to your account</p>
                </div>

                {message && (
                  <Alert variant="info" className="mb-4">
                    {message}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit(onSubmit)}>
                  <Form.Group className="mb-4">
                    <div className="input-group">
                      <span className="input-group-text">
                        <FaEnvelope />
                      </span>
                      <Form.Control
                        type="email"
                        placeholder="Email address"
                        {...register("email", {
                          required: "Email is required",
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Invalid email address"
                          }
                        })}
                      />
                    </div>
                    {errors.email && (
                      <small className="text-danger">{errors.email.message}</small>
                    )}
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <div className="input-group">
                      <span className="input-group-text">
                        <FaLock />
                      </span>
                      <Form.Control
                        type="password"
                        placeholder="Password"
                        {...register("password", {
                          required: "Password is required",
                          minLength: {
                            value: 6,
                            message: "Password must be at least 6 characters"
                          }
                        })}
                      />
                    </div>
                    {errors.password && (
                      <small className="text-danger">{errors.password.message}</small>
                    )}
                  </Form.Group>

                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <Form.Check
                      type="checkbox"
                      label="Remember me"
                    />
                    <Link to="/forgot-password" className="text-primary text-decoration-none">
                      Forgot Password?
                    </Link>
                  </div>

                  <Button 
                    variant="primary" 
                    type="submit" 
                    className="w-100 mb-4"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Logging in...' : 'Login'}
                  </Button>

                  <div className="text-center mb-4">
                    <p className="text-muted">Or login with</p>
                    <div className="social-login">
                      <Button variant="outline-primary" className="me-2">
                        <FaGoogle /> Google
                      </Button>
                      <Button variant="outline-primary">
                        <FaFacebook /> Facebook
                      </Button>
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="mb-0">
                      Don't have an account?{' '}
                      <Link to="/auth/register" className="text-primary text-decoration-none">
                        Sign Up
                      </Link>
                    </p>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>

          {/* Right Side - Image and Text */}
          <Col md={6} className="auth-image-side d-none d-md-flex align-items-center justify-content-center text-white">
            <div className="text-center p-5">
              <h1 className="display-4 fw-bold mb-4">GoLocal</h1>
              <p className="lead mb-4">
                Connect with local businesses and discover amazing products in your neighborhood
              </p>
              <img 
                src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Shopping%20Bags.png" 
                alt="Login" 
                className="img-fluid mb-4 auth-illustration"
                style={{ maxWidth: '300px' }}
              />
            </div>
          </Col>
        </Row>
      </Container>
    </div>
    </>
  );
};

export default Login;
