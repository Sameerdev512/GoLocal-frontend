import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import Navbar from '../../componants/Navbar';
import { FaUsers, FaStore, FaShoppingBag, FaChartLine, FaExclamationTriangle } from 'react-icons/fa';
import { API_BASE_URL } from '../../Utility/config';
import './styles/AdminDashboard.css';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalShops: 0,
    pendingApprovals: 0,
    totalProducts: 0,
    recentReports: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch dashboard stats
    const fetchDashboardStats = async () => {
      setIsLoading(true);
      try {
        // In a real app, you would fetch this data from your API
        // For now, we'll use mock data

        // get all users and shops
        const response = await fetch(
          `${API_BASE_URL}/api/admin/get-all-users`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await response.json();
        const totalUsers = data.length;

        const totalShops = data.reduce((acc, item) => {
          if (item.role === "SELLER") {
            acc++;
          }
          return acc;
        }, 0);

        // get all products
        const response2 = await fetch(
          `${API_BASE_URL}/api/admin/get-all-products`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data2 = await response2.json();
        const totalProducts = data2.length;

        // Mock data for demonstration
        const mockData = {
          totalUsers: totalUsers,
          totalShops: totalShops,
          pendingApprovals: 12,
          totalProducts: totalProducts,
          recentReports: [
            {
              id: 1,
              type: "User Report",
              subject: "Inappropriate behavior",
              status: "Pending",
              date: "2023-10-15",
            },
            {
              id: 2,
              type: "Shop Report",
              subject: "Misleading information",
              status: "Resolved",
              date: "2023-10-14",
            },
            {
              id: 3,
              type: "Product Report",
              subject: "Counterfeit item",
              status: "Under Review",
              date: "2023-10-13",
            },
            {
              id: 4,
              type: "User Report",
              subject: "Spam messages",
              status: "Pending",
              date: "2023-10-12",
            },
          ],
        };

        setStats(mockData);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  // User growth chart data
  const userGrowthData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'New Users',
        data: [30, 45, 57, 80, 95, 112],
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Shop categories chart data
  const shopCategoriesData = {
    labels: ['Retail', 'Food & Beverage', 'Services', 'Crafts', 'Electronics', 'Other'],
    datasets: [
      {
        data: [25, 20, 15, 18, 12, 10],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <>
      <Navbar />
      <div className="admin-dashboard">
        <Container>
          <div className="dashboard-header">
            <h1>Admin Dashboard</h1>
            <p>Overview of platform statistics and management tools</p>
          </div>

          {/* Stats Cards */}
          <Row className="stats-cards">
            <Col md={3}>
              <Card className="stat-card">
                <Card.Body>
                  <div className="stat-icon users-icon">
                    <FaUsers />
                  </div>
                  <div className="stat-details">
                    <h3>{stats.totalUsers}</h3>
                    <p>Total Users</p>
                  </div>
                  <Link to="/admin/manage-users">
                    <Button variant="outline-primary" size="sm">Manage Users</Button>
                  </Link>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="stat-card">
                <Card.Body>
                  <div className="stat-icon shops-icon">
                    <FaStore />
                  </div>
                  <div className="stat-details">
                    <h3>{stats.totalShops}</h3>
                    <p>Total Shops</p>
                  </div>
                  <Link to="/admin/manage-shops">
                    <Button variant="outline-primary" size="sm">Manage Shops</Button>
                  </Link>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="stat-card">
                <Card.Body>
                  <div className="stat-icon approvals-icon">
                    <FaExclamationTriangle />
                  </div>
                  <div className="stat-details">
                    <h3>{stats.pendingApprovals}</h3>
                    <p>Pending Approvals</p>
                  </div>
                  <Link to="/admin/manage-shops?filter=pending">
                    <Button variant="outline-warning" size="sm">Review</Button>
                  </Link>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="stat-card">
                <Card.Body>
                  <div className="stat-icon products-icon">
                    <FaShoppingBag />
                  </div>
                  <div className="stat-details">
                    <h3>{stats.totalProducts}</h3>
                    <p>Total Products</p>
                  </div>
                  <Link to="/admin/reports">
                    <Button variant="outline-primary" size="sm">View Reports</Button>
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Charts Row */}
          <Row className="dashboard-charts">
            <Col md={8}>
              <Card className="chart-card">
                <Card.Header>
                  <h5><FaChartLine /> User Growth</h5>
                </Card.Header>
                <Card.Body>
                  <Bar 
                    data={userGrowthData} 
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          position: 'top',
                        },
                        title: {
                          display: true,
                          text: 'Monthly User Registration'
                        }
                      }
                    }}
                  />
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="chart-card">
                <Card.Header>
                  <h5><FaStore /> Shop Categories</h5>
                </Card.Header>
                <Card.Body>
                  <Pie 
                    data={shopCategoriesData}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          position: 'right',
                        },
                      }
                    }}
                  />
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Recent Reports Table */}
          <Card className="reports-card">
            <Card.Header>
              <h5>Recent Reports</h5>
            </Card.Header>
            <Card.Body>
              <Table responsive striped hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Type</th>
                    <th>Subject</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentReports.map((report, index) => (
                    <tr key={report.id}>
                      <td>{index + 1}</td>
                      <td>{report.type}</td>
                      <td>{report.subject}</td>
                      <td>
                        <span className={`status-badge status-${report.status.toLowerCase().replace(' ', '-')}`}>
                          {report.status}
                        </span>
                      </td>
                      <td>{report.date}</td>
                      <td>
                        <Button variant="outline-primary" size="sm">View</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <div className="text-center mt-3">
                <Link to="/admin/reports">
                  <Button variant="primary">View All Reports</Button>
                </Link>
              </div>
            </Card.Body>
          </Card>

          {/* Quick Actions */}
          <Card className="quick-actions-card">
            <Card.Header>
              <h5>Quick Actions</h5>
            </Card.Header>
            <Card.Body>
              <div className="quick-actions">
                <Link to="/admin/manage-users">
                  <Button variant="outline-primary">Manage Users</Button>
                </Link>
                <Link to="/admin/manage-shops">
                  <Button variant="outline-primary">Manage Shops</Button>
                </Link>
                <Link to="/admin/reports">
                  <Button variant="outline-primary">View Reports</Button>
                </Link>
                <Link to="/admin/settings">
                  <Button variant="outline-secondary">System Settings</Button>
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Container>
      </div>
    </>
  );
};

export default AdminDashboard
