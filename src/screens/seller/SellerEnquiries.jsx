import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Spinner, Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaQuestionCircle, FaFilter, FaSearch, FaArrowLeft, FaReply } from 'react-icons/fa';
import Navbar from '../../componants/Navbar';
import '../../assets/scss/enquiries.scss';

const SellerEnquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, responded, closed
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest
  const [replyText, setReplyText] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8080/api/seller/get-all-shop-enquiries`,
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
      console.log("Fetched enquiries:", result);
      setEnquiries(result);
    } catch (error) {
      console.error("Error fetching enquiries:", error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredEnquiries = () => {
    let filtered = [...enquiries];
    
    // Apply status filter
    if (filter !== 'all') {
      filtered = filtered.filter(enquiry => 
        enquiry.status && enquiry.status.toLowerCase() === filter
      );
    }
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(enquiry => 
        (enquiry.productName && enquiry.productName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (enquiry.message && enquiry.message.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (enquiry.customerName && enquiry.customerName.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Apply sorting
    if (sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    } else {
      filtered.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
    }
    
    return filtered;
  };

  const getStatusBadge = (status) => {
    if (!status) return <Badge bg="secondary">Unknown</Badge>;
    
    switch(status.toLowerCase()) {
      case 'pending':
        return <Badge bg="warning">Pending</Badge>;
      case 'responded':
        return <Badge bg="success">Responded</Badge>;
      default:
        return <Badge bg="info">{status}</Badge>;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    
    try {
      return new Date(dateString).toLocaleDateString() + ' at ' + 
             new Date(dateString).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    } catch (e) {
      return 'Invalid date';
    }
  };

  const handleReply = (enquiryId) => {
    setReplyingTo(enquiryId);
    setReplyText('');
  };

  const submitReply = async (enquiryId) => {
    if (!replyText.trim()) return;
    
    setSubmitting(true);
    try {
      const response = await fetch(
        `http://localhost:8080/api/seller/respond-to-enquiry/${enquiryId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ response: replyText }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit reply");
      }

      const result = await response.json();
      alert(result.message);

      // Refresh enquiries list
      await fetchEnquiries();
      setReplyingTo(null);
      setReplyText('');
    } catch (error) {
      console.error("Error submitting reply:", error);
      alert("Failed to submit reply. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="enquiries-page seller-enquiries">
      <Navbar />
      <Container className="mt-4">
        <div className="page-header d-flex justify-content-between align-items-center">
          <div>
            <h2><FaQuestionCircle className="me-2" />Product Enquiries</h2>
            <p>Manage customer enquiries about your products</p>
          </div>
          <Link to="/seller/dashboard" className="btn btn-outline-primary">
            <FaArrowLeft className="me-2" />Back to Dashboard
          </Link>
        </div>

        <Row className="mt-4">
          <Col lg={3} className="mb-4">
            <Card className="filter-card">
              <Card.Body>
                <Card.Title><FaFilter className="me-2" />Filters</Card.Title>
                <div className="filter-section">
                  <h6>Status</h6>
                  <div className="filter-options">
                    <Button 
                      variant={filter === 'all' ? 'primary' : 'outline-primary'} 
                      size="sm"
                      onClick={() => setFilter('all')}
                      className="me-2 mb-2"
                    >
                      All
                    </Button>
                    <Button 
                      variant={filter === 'pending' ? 'warning' : 'outline-warning'} 
                      size="sm"
                      onClick={() => setFilter('pending')}
                      className="me-2 mb-2"
                    >
                      Pending
                    </Button>
                    <Button 
                      variant={filter === 'responded' ? 'success' : 'outline-success'} 
                      size="sm"
                      onClick={() => setFilter('responded')}
                      className="me-2 mb-2"
                    >
                      Responded
                    </Button>
                  </div>
                </div>
                
                <div className="filter-section">
                  <h6>Sort By</h6>
                  <div className="filter-options">
                    <Button 
                      variant={sortBy === 'newest' ? 'primary' : 'outline-primary'} 
                      size="sm"
                      onClick={() => setSortBy('newest')}
                      className="me-2 mb-2"
                    >
                      Newest First
                    </Button>
                    <Button 
                      variant={sortBy === 'oldest' ? 'primary' : 'outline-primary'} 
                      size="sm"
                      onClick={() => setSortBy('oldest')}
                      className="mb-2"
                    >
                      Oldest First
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col lg={9}>
            <Card className="mb-4">
              <Card.Body>
                <div className="search-container">
                  <FaSearch className="search-icon" />
                  <input 
                    type="text" 
                    className="search-input" 
                    placeholder="Search by product, customer or message..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </Card.Body>
            </Card>
            
            {loading ? (
              <div className="text-center p-5">
                <Spinner animation="border" role="status" variant="primary" />
                <p className="mt-3">Loading enquiries...</p>
              </div>
            ) : getFilteredEnquiries().length > 0 ? (
              <div className="enquiries-list">
                {getFilteredEnquiries().map((enquiry) => (
                  <Card key={enquiry.id || enquiry._id} className="enquiry-card mb-3">
                    <Card.Body>
                      <div className="enquiry-header">
                        <div>
                          <h5 className="enquiry-product">
                            <Link to={`/seller/viewProduct/${enquiry.productId}`}>
                              {enquiry.productName || 'Unknown Product'}
                            </Link>
                          </h5>
                          <p className="enquiry-customer">
                            From: {enquiry.userName || 'Anonymous Customer'}
                          </p>
                          <p className="enquiry-date">
                            Received on {formatDate(enquiry.createdAt)}
                          </p>
                        </div>
                        <div className="enquiry-status">
                          {getStatusBadge(enquiry.status)}
                        </div>
                      </div>
                      
                      <div className="enquiry-content">
                        <p className="enquiry-message">{enquiry.message || 'No message content'}</p>
                      </div>
                      
                      {enquiry.response && (
                        <div className="enquiry-reply">
                          <h6>Your Response:</h6>
                          <p>{enquiry.response}</p>
                          {enquiry.updatedAt && (
                            <p className="reply-date">
                              Replied on {formatDate(enquiry.updatedAt)}
                            </p>
                          )}
                        </div>
                      )}
                      
                      {replyingTo === (enquiry.id || enquiry._id) ? (
                        <div className="reply-form mt-3">
                          <Form.Group>
                            <Form.Label>Your Reply</Form.Label>
                            <Form.Control
                              as="textarea"
                              rows={3}
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder="Type your response here..."
                            />
                          </Form.Group>
                          <div className="mt-2 d-flex justify-content-end">
                            <Button 
                              variant="secondary" 
                              size="sm" 
                              className="me-2"
                              onClick={() => setReplyingTo(null)}
                              disabled={submitting}
                            >
                              Cancel
                            </Button>
                            <Button 
                              variant="primary" 
                              size="sm"
                              onClick={() => submitReply(enquiry.id || enquiry._id)}
                              disabled={!replyText.trim() || submitting}
                            >
                              {submitting ? 'Sending...' : 'Send Reply'}
                            </Button>
                          </div>
                        </div>
                      ) : (
                        enquiry.status && enquiry.status.toLowerCase() === 'pending' && (
                          <div className="mt-3 d-flex justify-content-end">
                            <Button 
                              variant="outline-primary" 
                              size="sm"
                              onClick={() => handleReply(enquiry.id || enquiry._id)}
                            >
                              <FaReply className="me-1" /> Reply
                            </Button>
                          </div>
                        )
                      )}
                    </Card.Body>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="no-enquiries">
                <div className="text-center p-5">
                  <FaQuestionCircle size={50} className="mb-3 text-muted" />
                  <h4>No Enquiries Found</h4>
                  <p>
                    {searchTerm || filter !== 'all' 
                      ? "No enquiries match your current filters. Try changing your search or filter criteria."
                      : "You haven't received any product enquiries yet."}
                  </p>
                  {(searchTerm || filter !== 'all') && (
                    <Button 
                      variant="outline-primary" 
                      onClick={() => {
                        setSearchTerm('');
                        setFilter('all');
                      }}
                    >
                      Clear Filters
                    </Button>
                  )}
                </div>
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default SellerEnquiries;