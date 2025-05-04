import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Spinner, Button } from 'react-bootstrap';
import { FaQuestionCircle, FaFilter, FaSearch } from 'react-icons/fa';
import Navbar from '../componants/Navbar';
import '../assets/scss/enquiries.scss';

const MyEnquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, replied, closed
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8080/api/user/get-users-enquiries`,
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
        enquiry.status && (
          enquiry.status.toLowerCase() === filter ||
          // Handle "responded" status when filter is set to "replied"
          (filter === 'replied' && enquiry.status.toLowerCase() === 'responded')
        )
      );
    }
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(enquiry => 
        (enquiry.productName && enquiry.productName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (enquiry.message && enquiry.message.toLowerCase().includes(searchTerm.toLowerCase()))
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
      case 'replied':
      case 'responded': // Add handling for "responded" status
        return <Badge bg="success">Replied</Badge>;
      
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

  return (
    <div className="enquiries-page">
      <Navbar />
      <Container className="mt-4">
        <div className="page-header">
          <div>
            <h2><FaQuestionCircle className="me-2" />My Enquiries</h2>
            <p>Track and manage your product enquiries</p>
          </div>
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
                      variant={filter === 'replied' ? 'success' : 'outline-success'} 
                      size="sm"
                      onClick={() => setFilter('replied')}
                      className="me-2 mb-2"
                    >
                      Replied
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
                    placeholder="Search by product name or message..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </Card.Body>
            </Card>
            
            {loading ? (
              <div className="text-center p-5">
                <Spinner animation="border" role="status" variant="primary" />
                <p className="mt-3">Loading your enquiries...</p>
              </div>
            ) : getFilteredEnquiries().length > 0 ? (
              <div className="enquiries-list">
                {getFilteredEnquiries().map((enquiry) => (
                  <Card key={enquiry.id || enquiry._id} className="enquiry-card mb-3">
                    <Card.Body>
                      <div className="enquiry-header">
                        <div>
                          <h5 className="enquiry-product">{enquiry.productName || 'Unknown Product'}</h5>
                          <p className="enquiry-date">
                            Sent on {formatDate(enquiry.createdAt)}
                          </p>
                        </div>
                        <div className="enquiry-status">
                          {getStatusBadge(enquiry.status)}
                        </div>
                      </div>
                      
                      <div className="enquiry-content">
                        <p className="enquiry-message">{enquiry.message || 'No message content'}</p>
                      </div>
                      
                      {/* Show reply section if there's a reply or if status is responded */}
                      {(enquiry.reply || 
                        (enquiry.status && 
                         (enquiry.status.toLowerCase() === 'replied' || 
                          enquiry.status.toLowerCase() === 'responded'))) && (
                        <div className="enquiry-reply">
                          <h6>Seller's Response:</h6>
                          <p>{enquiry.response || 'The seller has responded to your enquiry.'}</p>
                          {enquiry.updatedAt && (
                            <p className="reply-date">
                              Replied on {formatDate(enquiry.updatedAt)}
                            </p>
                          )}
                        </div>
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
                      : "You haven't made any product enquiries yet. Browse products and send an enquiry to get started."}
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

export default MyEnquiries;



