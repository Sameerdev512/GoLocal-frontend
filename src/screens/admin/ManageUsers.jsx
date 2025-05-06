import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Form, InputGroup, Modal, Badge } from 'react-bootstrap';
import Navbar from '../../componants/Navbar';
import { FaSearch, FaEdit, FaTrash, FaFilter, FaUserPlus, FaEye, FaUserEdit } from 'react-icons/fa';
import { API_BASE_URL } from '../../Utility/config';
import './styles/ManageUsers.css';
import { toast } from 'react-toastify';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal states
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    status: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, selectedRole, selectedStatus]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      // In a real app, you would fetch this data from your API
      // For now, we'll use mock data
      
      // Simulating API call
      // const response = await fetch(`${API_BASE_URL}/api/admin/users`, {
      //   headers: {
      //     Authorization: `Bearer ${localStorage.getItem('token')}`
      //   }
      // });
      // const data = await response.json();
      
      // Mock data for demonstration
      const mockUsers = [
        { 
          id: 1, 
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          role: 'Customer',
          status: 'Active',
          registrationDate: '2023-01-15',
          lastLogin: '2023-10-15',
          address: '123 Main St, New York, NY',
          phone: '555-123-4567',
          ordersCount: 12,
          totalSpent: 1250.75
        },
        { 
          id: 2, 
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane@example.com',
          role: 'Seller',
          status: 'Active',
          registrationDate: '2023-02-20',
          lastLogin: '2023-10-14',
          address: '456 Oak Ave, Los Angeles, CA',
          phone: '555-987-6543',
          shopName: 'Fashion Forward',
          productsCount: 45
        },
        { 
          id: 3, 
          firstName: 'Bob',
          lastName: 'Johnson',
          email: 'bob@example.com',
          role: 'Customer',
          status: 'Inactive',
          registrationDate: '2023-03-10',
          lastLogin: '2023-09-01',
          address: '789 Pine St, Chicago, IL',
          phone: '555-456-7890',
          ordersCount: 3,
          totalSpent: 175.25
        },
        { 
          id: 4, 
          firstName: 'Alice',
          lastName: 'Brown',
          email: 'alice@example.com',
          role: 'Admin',
          status: 'Active',
          registrationDate: '2023-01-05',
          lastLogin: '2023-10-15',
          address: '321 Elm St, Seattle, WA',
          phone: '555-789-0123'
        },
        { 
          id: 5, 
          firstName: 'Charlie',
          lastName: 'Wilson',
          email: 'charlie@example.com',
          role: 'Seller',
          status: 'Suspended',
          registrationDate: '2023-04-12',
          lastLogin: '2023-08-20',
          address: '654 Maple Dr, Austin, TX',
          phone: '555-234-5678',
          shopName: 'Tech Haven',
          productsCount: 28,
          suspensionReason: 'Multiple policy violations'
        },
      ];
      
      setUsers(mockUsers);
      setFilteredUsers(mockUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  const filterUsers = () => {
    let result = [...users];
    
    // Filter by search term
    if (searchTerm) {
      result = result.filter(user => 
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by role
    if (selectedRole !== 'All') {
      result = result.filter(user => user.role === selectedRole);
    }
    
    // Filter by status
    if (selectedStatus !== 'All') {
      result = result.filter(user => user.status === selectedStatus);
    }
    
    setFilteredUsers(result);
  };

  const handleViewUser = (user) => {
    setCurrentUser(user);
    setShowViewModal(true);
  };

  const handleEditUser = (user) => {
    setCurrentUser(user);
    setEditForm({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      status: user.status
    });
    setShowEditModal(true);
  };

  const handleDeleteUser = (user) => {
    setCurrentUser(user);
    setShowDeleteModal(true);
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const submitEditForm = async (e) => {
    e.preventDefault();
    
    try {
      // In a real app, you would call your API to update the user
      // For now, we'll just update the state
      
      // Simulating API call
      // await fetch(`${API_BASE_URL}/api/admin/users/${currentUser.id}`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     Authorization: `Bearer ${localStorage.getItem('token')}`
      //   },
      //   body: JSON.stringify(editForm)
      // });
      
      // Update state
      const updatedUsers = users.map(user => 
        user.id === currentUser.id ? {...user, ...editForm} : user
      );
      setUsers(updatedUsers);
      
      toast.success('User updated successfully');
      setShowEditModal(false);
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user');
    }
  };

  const confirmDeleteUser = async () => {
    try {
      // In a real app, you would call your API to delete the user
      // For now, we'll just update the state
      
      // Simulating API call
      // await fetch(`${API_BASE_URL}/api/admin/users/${currentUser.id}`, {
      //   method: 'DELETE',
      //   headers: {
      //     Authorization: `Bearer ${localStorage.getItem('token')}`
      //   }
      // });
      
      // Update state
      const updatedUsers = users.filter(user => user.id !== currentUser.id);
      setUsers(updatedUsers);
      
      toast.success('User deleted successfully');
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active':
        return <Badge bg="success">Active</Badge>;
      case 'Inactive':
        return <Badge bg="secondary">Inactive</Badge>;
      case 'Suspended':
        return <Badge bg="danger">Suspended</Badge>;
      default:
        return <Badge bg="info">{status}</Badge>;
    }
  };

  return (
    <>
      <Navbar />
      <div className="manage-users-page">
        <Container>
          <div className="page-header">
            <div>
              <h1>Manage Users</h1>
              <p>View and manage all users on the platform</p>
            </div>
            <Button variant="primary" className="add-user-btn">
              <FaUserPlus className="me-2" /> Add New User
            </Button>
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
                      placeholder="Search by name or email"
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
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                    >
                      <option value="All">All Roles</option>
                      <option value="Admin">Admin</option>
                      <option value="Seller">Seller</option>
                      <option value="Customer">Customer</option>
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
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Suspended">Suspended</option>
                    </Form.Select>
                  </InputGroup>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Users Table */}
          <Card className="users-table-card">
            <Card.Body>
              {isLoading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-3">Loading users...</p>
                </div>
              ) : (
                <>
                  {filteredUsers.length === 0 ? (
                    <div className="text-center py-5">
                      <p>No users found matching your filters.</p>
                      <Button 
                        variant="outline-primary" 
                        onClick={() => {
                          setSearchTerm('');
                          setSelectedRole('All');
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
                          <th>Name</th>
                          <th>Email</th>
                          <th>Role</th>
                          <th>Status</th>
                          <th>Registration Date</th>
                          <th>Last Login</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map(user => (
                          <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{`${user.firstName} ${user.lastName}`}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td>{getStatusBadge(user.status)}</td>
                            <td>{user.registrationDate}</td>
                            <td>{user.lastLogin}</td>
                            <td>
                              <div className="action-buttons">
                                <Button 
                                  variant="outline-info" 
                                  size="sm"
                                  onClick={() => handleViewUser(user)}
                                >
                                  <FaEye />
                                </Button>
                                <Button 
                                  variant="outline-primary" 
                                  size="sm"
                                  onClick={() => handleEditUser(user)}
                                >
                                  <FaEdit />
                                </Button>
                                <Button 
                                  variant="outline-danger" 
                                  size="sm"
                                  onClick={() => handleDeleteUser(user)}
                                >
                                  <FaTrash />
                                </Button>
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

      {/* View User Modal */}
      <Modal show={showViewModal} onHide={() => setShowViewModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>User Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentUser && (
            <div className="user-details">
              <Row>
                <Col md={6}>
                  <h4>{`${currentUser.firstName} ${currentUser.lastName}`}</h4>
                  <p className="text-muted">{currentUser.role}</p>
                  
                  <h5 className="mt-4">Contact Information</h5>
                  <p><strong>Email:</strong> {currentUser.email}</p>
                  <p><strong>Phone:</strong> {currentUser.phone}</p>
                  <p><strong>Address:</strong> {currentUser.address}</p>
                  
                  <h5 className="mt-4">Account Status</h5>
                  <p><strong>Status:</strong> {getStatusBadge(currentUser.status)}</p>
                  <p><strong>Registration Date:</strong> {currentUser.registrationDate}</p>
                  <p><strong>Last Login:</strong> {currentUser.lastLogin}</p>
                  {currentUser.status === 'Suspended' && (
                    <p><strong>Suspension Reason:</strong> {currentUser.suspensionReason}</p>
                  )}
                </Col>
                <Col md={6}>
                  {currentUser.role === 'Customer' && (
                    <>
                      <h5>Customer Information</h5>
                      <p><strong>Orders:</strong> {currentUser.ordersCount}</p>
                      <p><strong>Total Spent:</strong> ${currentUser.totalSpent}</p>
                    </>
                  )}
                  
                  {currentUser.role === 'Seller' && (
                    <>
                      <h5>Seller Information</h5>
                      <p><strong>Shop Name:</strong> {currentUser.shopName}</p>
                      <p><strong>Products:</strong> {currentUser.productsCount}</p>
                    </>
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
          {currentUser && (
            <Button variant="primary" onClick={() => {
              setShowViewModal(false);
              handleEditUser(currentUser);
            }}>
              <FaUserEdit className="me-2" /> Edit User
            </Button>
          )}
        </Modal.Footer>
      </Modal>

      {/* Edit User Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentUser && (
            <Form onSubmit={submitEditForm}>
              <Form.Group className="mb-3">
                <Form.Label>First Name</Form.Label>
                <Form.Control 
                  type="text" 
                  name="firstName"
                  value={editForm.firstName}
                  onChange={handleEditFormChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Last Name</Form.Label>
                <Form.Control 
                  type="text" 
                  name="lastName"
                  value={editForm.lastName}
                  onChange={handleEditFormChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control 
                  type="email" 
                  name="email"
                  value={editForm.email}
                  onChange={handleEditFormChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Role</Form.Label>
                <Form.Select
                  name="role"
                  value={editForm.role}
                  onChange={handleEditFormChange}
                >
                  <option value="Admin">Admin</option>
                  <option value="Seller">Seller</option>
                  <option value="Customer">Customer</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Select
                  name="status"
                  value={editForm.status}
                  onChange={handleEditFormChange}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Suspended">Suspended</option>
                </Form.Select>
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" form="editForm">
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete User Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentUser && (
            <p>
              Are you sure you want to delete the user <strong>{`${currentUser.firstName} ${currentUser.lastName}`}</strong>? 
              This action cannot be undone.
            </p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDeleteUser}>
            Delete User
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ManageUsers;

