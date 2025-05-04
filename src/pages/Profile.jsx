import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Modal, ListGroup } from 'react-bootstrap';
import { FaUser, FaEnvelope, FaList, FaQuestionCircle } from 'react-icons/fa';
import Navbar from '../componants/Navbar';
import '../assets/scss/profile.scss';

const Profile = () => {
  const [showEnquiriesModal, setShowEnquiriesModal] = useState(false);
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if we should show enquiries modal based on localStorage flag
    if (localStorage.getItem('showEnquiries') === 'true') {
      fetchEnquiries();
      setShowEnquiriesModal(true);
      // Clear the flag after showing
      localStorage.removeItem('showEnquiries');
    }
  }, []);

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8080/api/user/my-enquiries`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch enquiries");
      }

      const result = await response.json();
      setEnquiries(result);
    } catch (error) {
      console.error("Error fetching enquiries:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <Navbar />
      <Container className="mt-4">
        <div className="profile-header">
          <h2>My Profile</h2>
        </div>

        <Row className="mt-4">
          <Col md={4}>
            <Card className="profile-card">
              <div className="profile-image">
                <FaUser size={60} />
              </div>
              <Card.Body>
                <Card.Title>John Doe</Card.Title>
                <Card.Text>
                  <FaEnvelope className="me-2" /> john.doe@example.com
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={8}>
            <Card>
              <Card.Body>
                <Card.Title>Account Information</Card.Title>
                <div className="profile-info">
                  <p><strong>Name:</strong> John Doe</p>
                  <p><strong>Email:</strong> john.doe@example.com</p>
                  <p><strong>Phone:</strong> +91 9876543210</p>
                  <p><strong>Address:</strong> 123 Main St, Mumbai, Maharashtra</p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Enquiries Modal */}
      <Modal 
        show={showEnquiriesModal} 
        onHide={() => setShowEnquiriesModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>My Enquiries</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loading ? (
            <div className="text-center p-4">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2">Loading your enquiries...</p>
            </div>
          ) : enquiries.length > 0 ? (
            <ListGroup>
              {enquiries.map((enquiry) => (
                <ListGroup.Item key={enquiry.id} className="enquiry-item">
                  <div className="enquiry-header">
                    <h5>{enquiry.productName}</h5>
                    <span className="enquiry-date">
                      {new Date(enquiry.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="enquiry-message">{enquiry.message}</p>
                  <div className="enquiry-status">
                    Status: <span className={`status-${enquiry.status.toLowerCase()}`}>
                      {enquiry.status}
                    </span>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          ) : (
            <div className="text-center p-4">
              <FaList size={40} className="mb-3 text-muted" />
              <h5>No Enquiries Found</h5>
              <p>You haven't made any product enquiries yet.</p>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Profile;
