import { useState } from "react";
import { Container, Row, Col, Card, Button, Table } from "react-bootstrap";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Link } from "react-router-dom";
import Navbar from "../../componants/Navbar";

// Register chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const SellerDashboard = () => {
  const [orders] = useState([
    { id: 1, customer: "John Doe", status: "Pending", amount: "$150" },
    { id: 2, customer: "Jane Smith", status: "Completed", amount: "$250" },
  ]);

  const earningsData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    datasets: [
      {
        label: "Earnings ($)",
        data: [500, 700, 900, 1100, 1300],
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
    ],
  };

  return (
    <>
    <Navbar/>
      <Container className="mt-4">
        <h2 className="mb-4 text-center">Seller Dashboard</h2>

        {/* Dashboard Summary Cards */}
        <Row className="mb-4">
          <Col md={3}>
          
            <Card className="text-center">
              <Card.Body>
                <Card.Title>Manage Shop</Card.Title>
                <Link to="/seller/myShop">
                <Button variant="primary">Edit Shop</Button>
                </Link>
              </Card.Body>
            </Card>
              
          </Col>
          <Col md={3}>
            <Card className="text-center">
              <Card.Body>
                <Card.Title>Products</Card.Title>
                <Link to="/seller/manageProducts">
                  <Button variant="primary">Manage Products</Button>
                </Link>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center">
              <Card.Body>
                <Card.Title>Orders</Card.Title>
                <p>{orders.length} Pending Orders</p>
                <Button variant="primary">View Orders</Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center">
              <Card.Body>
                <Card.Title>Earnings</Card.Title>
                <p>Total: $1300</p>
                <Button variant="primary">View Details</Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Orders Table */}
        <Card className="mb-4">
          <Card.Header>
            <h5>Recent Orders</h5>
          </Card.Header>
          <Card.Body>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Customer</th>
                  <th>Status</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => (
                  <tr key={order.id}>
                    <td>{index + 1}</td>
                    <td>{order.customer}</td>
                    <td>{order.status}</td>
                    <td>{order.amount}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>

        {/* Earnings Chart */}
        <Card className="mb-4">
          <Card.Header>
            <h5>Earnings Overview</h5>
          </Card.Header>
          <Card.Body>
            <Bar data={earningsData} />
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};

export default SellerDashboard;
