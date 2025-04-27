import React from 'react';
import Navbar from '../componants/Navbar';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaHandshake, FaStore, FaUsers, FaShoppingBag } from 'react-icons/fa';
import '../assets/scss/about.scss';

const About = () => {
  const stats = [
    { icon: <FaStore />, number: "1000+", label: "Local Shops" },
    { icon: <FaUsers />, number: "50,000+", label: "Happy Customers" },
    { icon: <FaShoppingBag />, number: "10,000+", label: "Products" },
    { icon: <FaHandshake />, number: "500+", label: "Cities" }
  ];

  const teamMembers = [
    {
      name: "John Smith",
      role: "Founder & CEO",
      image: "https://randomuser.me/api/portraits/men/1.jpg",
      description: "Visionary leader with 15+ years in retail technology"
    },
    {
      name: "Sarah Johnson",
      role: "Head of Operations",
      image: "https://randomuser.me/api/portraits/women/1.jpg",
      description: "Expert in scaling local business operations"
    },
    {
      name: "Michael Chen",
      role: "Tech Lead",
      image: "https://randomuser.me/api/portraits/men/2.jpg",
      description: "Full-stack developer with passion for community"
    }
  ];

  return (
    <>
      <Navbar />
      <div className="about-page">
        {/* Hero Section */}
        <div className="about-hero">
          <Container>
            <h1>About GoLocal</h1>
            <p>Connecting Communities Through Local Commerce</p>
          </Container>
        </div>

        {/* Mission Section */}
        <Container className="section">
          <Row className="align-items-center">
            <Col md={6}>
              <div className="mission-content">
                <h2>Our Mission</h2>
                <p className="lead">
                  At GoLocal, we're passionate about empowering local businesses and strengthening community bonds through technology.
                </p>
                <p>
                  We believe that every neighborhood shop has a unique story to tell and exceptional products to offer. Our platform bridges the gap between local sellers and customers, making it easier than ever to discover and support businesses in your community.
                </p>
              </div>
            </Col>
            <Col md={6}>
              <img 
                src="https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                alt="Community"
                className="mission-image"
              />
            </Col>
          </Row>
        </Container>

        {/* Stats Section */}
        <div className="stats-section">
          <Container>
            <Row>
              {stats.map((stat, index) => (
                <Col key={index} md={3} sm={6}>
                  <div className="stat-item">
                    <div className="stat-icon">{stat.icon}</div>
                    <div className="stat-number">{stat.number}</div>
                    <div className="stat-label">{stat.label}</div>
                  </div>
                </Col>
              ))}
            </Row>
          </Container>
        </div>

        {/* Values Section */}
        <Container className="section">
          <h2 className="text-center mb-5">Our Values</h2>
          <Row>
            <Col md={4}>
              <div className="value-card">
                <h3>Community First</h3>
                <p>We prioritize the growth and success of local communities, ensuring that every decision we make benefits our users.</p>
              </div>
            </Col>
            <Col md={4}>
              <div className="value-card">
                <h3>Innovation</h3>
                <p>We continuously evolve our platform to provide cutting-edge solutions that make local commerce more accessible.</p>
              </div>
            </Col>
            <Col md={4}>
              <div className="value-card">
                <h3>Trust & Transparency</h3>
                <p>We build trust through transparent practices and maintain the highest standards of security for our users.</p>
              </div>
            </Col>
          </Row>
        </Container>

        {/* Team Section */}
        <Container className="section">
          <h2 className="text-center mb-5">Meet Our Team</h2>
          <Row>
            {teamMembers.map((member, index) => (
              <Col key={index} md={4}>
                <Card className="team-card">
                  <div className="team-image-wrapper">
                    <Card.Img variant="top" src={member.image} alt={member.name} />
                  </div>
                  <Card.Body>
                    <Card.Title>{member.name}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">{member.role}</Card.Subtitle>
                    <Card.Text>{member.description}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>

        {/* Join Us Section */}
        <div className="join-section">
          <Container>
            <h2>Join the GoLocal Movement</h2>
            <p>Be part of our mission to transform local commerce and strengthen communities.</p>
            <div className="cta-buttons">
              <a href="/auth/register" className="btn btn-primary btn-lg">Register Your Shop</a>
              <a href="/contactus" className="btn btn-outline-light btn-lg">Contact Us</a>
            </div>
          </Container>
        </div>
      </div>
    </>
  );
};

export default About;
