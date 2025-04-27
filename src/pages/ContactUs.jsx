import React, { useState } from 'react';
import Navbar from '../componants/Navbar';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import '../assets/scss/contact.scss';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      alert('Message sent successfully!');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      alert('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: <FaPhone />,
      title: 'Phone',
      content: '+1 (555) 123-4567',
      link: 'tel:+15551234567'
    },
    {
      icon: <FaEnvelope />,
      title: 'Email',
      content: 'support@golocal.com',
      link: 'mailto:support@golocal.com'
    },
    {
      icon: <FaMapMarkerAlt />,
      title: 'Address',
      content: '123 Business Street, City, State 12345',
      link: 'https://maps.google.com'
    },
    {
      icon: <FaClock />,
      title: 'Business Hours',
      content: 'Mon - Fri: 9:00 AM - 6:00 PM',
      link: null
    }
  ];

  return (
    <>
      <Navbar />
      <div className="contact-page">
        {/* Hero Section */}
        <div className="contact-hero">
          <Container>
            <h1>Contact Us</h1>
            <p>We're here to help and answer any questions you might have</p>
          </Container>
        </div>

        <Container className="contact-content">
          {/* Contact Info Cards */}
          <Row className="contact-info-section">
            {contactInfo.map((info, index) => (
              <Col key={index} md={3} sm={6} className="mb-4">
                <Card className="contact-info-card">
                  <Card.Body>
                    <div className="icon-wrapper">
                      {info.icon}
                    </div>
                    <h3>{info.title}</h3>
                    {info.link ? (
                      <a href={info.link} target={info.title === 'Address' ? "_blank" : "_self"} rel="noopener noreferrer">
                        {info.content}
                      </a>
                    ) : (
                      <p>{info.content}</p>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Contact Form Section */}
          <Row className="contact-form-section">
            <Col md={6}>
              <div className="form-content">
                <h2>Send us a Message</h2>
                <p>Fill out the form below and we'll get back to you as soon as possible.</p>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Enter your name"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="Enter your email"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Subject</Form.Label>
                    <Form.Control
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      placeholder="Enter subject"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Message</Form.Label>
                    <Form.Control
                      as="textarea"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={4}
                      placeholder="Enter your message"
                    />
                  </Form.Group>

                  <Button 
                    variant="primary" 
                    type="submit" 
                    className="submit-btn"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </Form>
              </div>
            </Col>
            <Col md={6}>
              <div className="map-wrapper">
                <iframe
                  title="Location Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387193.30596073366!2d-74.25986548248684!3d40.69714941932609!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2sin!4v1647609088799!5m2!1sen!2sin"
                  width="100%"
                  height="450"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                ></iframe>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default ContactUs
