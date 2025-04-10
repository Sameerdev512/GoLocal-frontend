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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const initialProducts = [
  { id: 1, name: "T-Shirt", category: "Clothing", price: 29, stock: 50 },
  { id: 2, name: "Jeans", category: "Clothing", price: 59, stock: 20 },
  { id: 3, name: "Smartphone", category: "Electronics", price: 499, stock: 10 },
  { id: 4, name: "Laptop", category: "Electronics", price: 999, stock: 5 },
  { id: 5, name: "Blender", category: "Home Appliances", price: 79, stock: 15 },
];

const ManageProducts = () => {
  const [products, setProducts] = useState(initialProducts);

  const handleDelete = (id) => {
    setProducts(products.filter((product) => product.id !== id));
  };

  const categories = [...new Set(products.map((product) => product.category))];
  console.log("category array:",categories);

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

  return (
    <>
      <Navbar />
      <Container className="mt-4">
        <h2 className="text-center mb-4">Manage Products</h2>

        {categories.map((category) => (
          <div key={category} className="mb-4">
            <h4 className="mb-3">{category ? category : "Others"}</h4>
            <Row>
              {products
                .filter((product) => product.category === category)
                .map((product) => (
                  <Col md={3} sm={6} xs={12} key={product.id} className="mb-4">
                    <Card className="shadow-sm">
                      <Card.Body>
                        <Card.Img
                          style={{
                            width: "270px",
                            height: "250px",
                            marginBottom: "30px",
                            border: "1px solid black",
                          }}
                          src={product.imageUrl}
                        ></Card.Img>
                        <Card.Title>{product.name}</Card.Title>
                        <Card.Text>Price: ₹{product.price}</Card.Text>
                        <Card.Text>
                          Description: {product.description}
                        </Card.Text>
                        <Card.Text>Stock: {product.stock}</Card.Text>
                        <Card.Text>Status: {product.status}</Card.Text>
                        <Link to={`/viewProduct/${product.id}`}>
                        <Button
                          style={{ marginRight: "10px" }}
                          variant="secondary"
                          size="sm"
                          // onClick={() => handleDelete(product.id)}
                        >
                            View
                        </Button>
                          </Link>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleDelete(product.id)}
                        >
                          Delete
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
            </Row>
          </div>
        ))}

        <div className="mt-5">
          <h5 className="text-center mb-3">Inventory Overview</h5>
          <Bar data={chartData} />
        </div>
      </Container>
    </>
  );
};

export default ManageProducts;
