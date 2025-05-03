import { useState ,useEffect} from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
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
import Navbar from "../../componants/Navbar";
import { Link } from "react-router-dom";
import '../../assets/scss/manageProducts.scss';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const initialProducts = [
  ];

const ManageProducts = () => {
  const [products, setProducts] = useState(initialProducts);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", ...new Set(products.map((product) => product.category))];
  console.log("category array:", categories);

  const chartData = {
    labels: products.map((product) => product.name),
    datasets: [
      {
        label: "Stock Available",
        data: products.map((product) => product.stock),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
    ],
  };

  const loadSellerProducts = async () => {
    const response = await fetch(
      `http://localhost:8080/api/seller/findAllProducts`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    const result = await response.json();
    setProducts(result);
    console.log(result);
  };

  useEffect(() => {
    loadSellerProducts();
  }, []);

  const filteredProducts = selectedCategory === "All" 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  return (
    <>
      <Navbar />
      <Container className="mt-4">
        <div className="d-flex justify-content-between align-items-center mb-5 ">
          <h2>Manage Products</h2>
          <Link to="/seller/manageProducts/addProduct">
            <Button variant="primary">Add New Product</Button>
          </Link>
        </div>

        {/* Category Filter Bar */}
        <div className="category-filter mb-4 my-5">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "success" : "outline-secondary"}
              className="category-btn me-2"
              onClick={() => setSelectedCategory(category)}
            >
              {category ? category : "null"}
            </Button>
          ))}
        </div>

        <div className="products-grid">
          {filteredProducts.length > 0 ?(filteredProducts.map((product) => (
            <div key={product.id} className="mb-4">
              <Card className="product-card h-100">
                <Card.Body>
                  <Card.Img
                    style={{
                      width: "270px",
                      height: "250px",
                      marginBottom: "30px",
                      border: "1px solid black",
                    }}
                    src={product.imageUrl}
                  />
                  <Card.Title>{product.name}</Card.Title>
                  <Card.Text>Price: ₹{product.price}</Card.Text>
                  <Card.Text>Description: {product.description}</Card.Text>
                  <Card.Text>Stock: {product.stock}</Card.Text>
                  <Card.Text>Status: {product.status}</Card.Text>
                  <Link to={`/viewProduct/${product.id}`}>
                    <Button
                      style={{ marginRight: "10px" }}
                      variant="secondary"
                      size="sm"
                    >
                      View
                    </Button>
                  </Link>
                </Card.Body>
              </Card>
            </div>
          ))):<center>No products found</center>}
        </div>

        <div className="mt-5">
          <h5 className="text-center mb-3">Inventory Overview</h5>
          <Bar data={chartData} />
        </div>
      </Container>
    </>
  );
};

export default ManageProducts;
