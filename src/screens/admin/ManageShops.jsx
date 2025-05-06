import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Form, InputGroup, Modal, Badge } from 'react-bootstrap';
import Navbar from '../../componants/Navbar';
import { FaSearch, FaEdit, FaCheck, FaTimes, FaFilter, FaStore, FaEye } from 'react-icons/fa';
import { API_BASE_URL } from '../../Utility/config';
import './styles/ManageShops.css';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';

const ManageShops = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialFilter = queryParams.get('filter');

  const [shops, setShops] = useState([]);
  const [filteredShops, setFilteredShops] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState(initialFilter === 'pending' ? 'Pending' : 'All');
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal states
  const [showViewModal, setShowViewModal] = useState(false);
  const [currentShop, setCurrentShop] = useState(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    fetchShops();
  }, []);

  useEffect(() => {
    filterShops();
  }, [shops, searchTerm, selectedCategory, selectedStatus]);

  const fetchShops = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/get-all-shops`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch shops');
      }
      
      const data = await response.json();
      console.log('Shops data:', data);
      
      setShops(data);
      setFilteredShops(data);
    } catch (error) {
      console.error('Error fetching shops:', error);
      toast.error('Failed to load shops');
    } finally {
      setIsLoading(false);
    }
  };

  const filterShops = () => {
    let result = [...shops];
    
    // Filter by search term
    if (searchTerm) {
      result = result.filter(shop => 
        shop.shopName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        shop.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shop.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by category
    if (selectedCategory !== 'All') {
      result = result.filter(shop => shop.shopCategory === selectedCategory);
    }
    
    // Filter by status
    if (selectedStatus !== 'All') {
      result = result.filter(shop => shop.status === selectedStatus);
    }
    
    setFilteredShops(result);
  };

  const handleViewShop = (shop) => {
    setCurrentShop(shop);
    setShowViewModal(true);
  };

  const handleApproveShop = (shop) => {
    setCurrentShop(shop);
    setShowApproveModal(true);
  };

  const handleRejectShop = (shop) => {
    setCurrentShop(shop);
    setRejectionReason('');
    setShowRejectModal(true);
  };

  const confirmApproveShop = async () => {
    try {
      // In a real app, you would call your API to approve the shop
      // For now, we'll just update the state
      
      // Simulating API call
      // await fetch(`${API_BASE_URL}/api/admin/shops/${currentShop.id}/approve`, {
      //   method: 'PUT',
      //   headers: {
      //     Authorization: `Bearer ${localStorage.getItem('token')}`
      //   }
      // });
      
      // Update state
      const updatedShops = shops.map(shop => 
        shop.id === currentShop.id ? {...shop, status: 'Approved'} : shop
      );
      setShops(updatedShops);
      
      toast.success('Shop approved successfully');
      setShowApproveModal(false);
    } catch (error) {
      console.error('Error approving shop:', error);
      toast.error('Failed to approve shop');
    }
  };

  const confirmRejectShop = async () => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }
    
    try {
      // In a real app, you would call your API to reject the shop
      // For now, we'll just update the state
      
      // Simulating API call
      // await fetch(`${API_BASE_URL}/api/admin/shops/${currentShop.id}/reject`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     Authorization: `Bearer ${localStorage.getItem('token')}`
      //   },
      //   body: JSON.stringify({ reason: rejectionReason })
      // });
      
      // Update state
      const updatedShops = shops.map(shop => 
        shop.id === currentShop.id ? {...shop, status: 'Rejected', rejectionReason} : shop
      );
      setShops(updatedShops);
      
      toast.success('Shop rejected');
      setShowRejectModal(false);
    } catch (error) {
      console.error('Error rejecting shop:', error);
      toast.error('Failed to reject shop');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved':
        return <Badge bg="success">Approved</Badge>;
      case 'Pending':
        return <Badge bg="warning">Pending</Badge>;
      case 'Rejected':
        return <Badge bg="danger">Rejected</Badge>;
      default:
        return <Badge bg="info">{status}</Badge>;
    }
  };

  return (
    <>
      <Navbar />
      <div className="manage-shops-page">
        <Container>
          <div className="page-header">
            <div>
              <h1>Manage Shops</h1>
              <p>View and manage all shops on the platform</p>
            </div>
          </div>

          {/* Filters */}
          <Card className="filters-card">
            <Card.Body>
              <Row>
                <Col md={6}>
                  <InputGroup className="mb-3 mb-md-0">
                    <InputGroup.Text>
                      <FaSearch />
                    </InputGroup.Text>
                    <Form.Control
                      placeholder="Search by shop name or owner"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </InputGroup>
                </Col>
                <Col md={3}>
                  <InputGroup>
                    <InputGroup.Text>
                      <FaFilter />
                    </InputGroup.Text>
                    <Form.Select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      <option value="All">All Categories</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Clothing">Clothing</option>
                      <option value="Food & Beverage">Food & Beverage</option>
                      <option value="Crafts">Crafts</option>
                      <option value="Health & Beauty">Health & Beauty</option>
                      <option value="Other">Other</option>
                    </Form.Select>
                  </InputGroup>
                </Col>
                <Col md={3}>
                  <InputGroup>
                    <InputGroup.Text>
                      <FaFilter />
                    </InputGroup.Text>
                    <Form.Select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                    >
                      <option value="All">All Status</option>
                      <option value="Approved">Approved</option>
                      <option value="Pending">Pending</option>
                      <option value="Rejected">Rejected</option>
                    </Form.Select>
                  </InputGroup>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Shops Table */}
          <Card className="shops-table-card">
            <Card.Body>
              {isLoading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-3">Loading shops...</p>
                </div>
              ) : (
                <>
                  {filteredShops.length === 0 ? (
                    <div className="text-center py-5">
                      <p>No shops found matching your filters.</p>
                      <Button 
                        variant="outline-primary" 
                        onClick={() => {
                          setSearchTerm('');
                          setSelectedCategory('All');
                          setSelectedStatus('All');
                        }}
                      >
                        Clear Filters
                      </Button>
                    </div>
                  ) : (
                    <Table responsive hover>
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Shop Name</th>
                          <th>Owner</th>
                          <th>Category</th>
                          <th>Status</th>
                          <th>Registration Date</th>
                          <th>Products</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredShops.map(shop => (
                          <tr key={shop.id}>
                            <td>{shop.id}</td>
                            <td>{shop.shopName}</td>
                            <td>{shop.ownerName}</td>
                            <td>{shop.shopCategory}</td>
                            <td>Nan</td>
                            <td> { shop.createdAt.substring(0,10)}</td>
                            <td>Nan</td>
                            <td>
                              <div className="action-buttons">
                                <Button 
                                  variant="outline-info" 
                                  size="sm"
                                  onClick={() => handleViewShop(shop)}
                                >
                                  <FaEye />
                                </Button>
                                {shop.status === 'Pending' && (
                                  <>
                                    <Button 
                                      variant="outline-success" 
                                      size="sm"
                                      onClick={() => handleApproveShop(shop)}
                                    >
                                      <FaCheck />
                                    </Button>
                                    <Button 
                                      variant="outline-danger" 
                                      size="sm"
                                      onClick={() => handleRejectShop(shop)}
                                    >
                                      <FaTimes />
                                    </Button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  )}
                </>
              )}
            </Card.Body>
          </Card>
        </Container>
      </div>

      {/* View Shop Modal */}
      <Modal show={showViewModal} onHide={() => setShowViewModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Shop Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentShop && (
            <div className="shop-details">
              <Row>
                <Col md={6}>
                  <h4>{currentShop.shopName}</h4>
                  <p className="text-muted">{currentShop.shopCategory}</p>
                  
                  <h5 className="mt-4">Contact Information</h5>
                  <p><strong>Owner:</strong> {currentShop.ownerName}</p>
                  <p><strong>Email:</strong> {currentShop.email}</p>
                  <p><strong>Phone:</strong> {currentShop.contact}</p>
                  <p><strong>Address:</strong> {currentShop.address}</p>
                  
                  <h5 className="mt-4">Shop Status</h5>
                  <p><strong>Status:</strong> {getStatusBadge(currentShop.status)}</p>
                  <p><strong>Registration Date:</strong> {currentShop.registrationDate.substring(0,10)}</p>
                  {currentShop.status === 'Rejected' && (
                    <p><strong>Rejection Reason:</strong> {currentShop.rejectionReason}</p>
                  )}
                </Col>
                <Col md={6}>
                  <h5>Shop Description</h5>
                  <p>{currentShop.description}</p>
                  
                  <h5 className="mt-4">Statistics</h5>
                  <p><strong>Products:</strong> {currentShop.productsCount}</p>
                  {currentShop.status === 'Approved' && (
                    <p><strong>Rating:</strong> {currentShop.rating} / 5</p>
                  )}
                </Col>
              </Row>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowViewModal(false)}>
            Close
          </Button>
          {currentShop && currentShop.status === 'Pending' && (
            <>
              <Button variant="success" onClick={() => {
                setShowViewModal(false);
                handleApproveShop(currentShop);
              }}>
                Approve Shop
              </Button>
              <Button variant="danger" onClick={() => {
                setShowViewModal(false);
                handleRejectShop(currentShop);
              }}>
                Reject Shop
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>

      {/* Approve Shop Modal */}
      <Modal show={showApproveModal} onHide={() => setShowApproveModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Approval</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentShop && (
            <p>
              Are you sure you want to approve the shop <strong>{currentShop.shopName}</strong>? 
              This will allow the shop to start selling products on the platform.
            </p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowApproveModal(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={confirmApproveShop}>
            Approve Shop
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Reject Shop Modal */}
      <Modal show={showRejectModal} onHide={() => setShowRejectModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Reject Shop</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentShop && (
            <>
              <p>
                Are you sure you want to reject the shop <strong>{currentShop.shopName}</strong>?
                This will prevent the shop from selling products on the platform.
              </p>
              <Form.Group className="mt-3">
                <Form.Label>Reason for Rejection</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Please provide a reason for rejection"
                  required
                />
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRejectModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmRejectShop}>
            Reject Shop
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ManageShops;


