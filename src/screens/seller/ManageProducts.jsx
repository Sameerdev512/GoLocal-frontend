import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Badge, Dropdown } from "react-bootstrap";
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
import { FaPlus, FaSearch, FaFilter, FaEdit, FaEye, FaTrash, FaBoxOpen, FaTag, FaChartBar } from "react-icons/fa";
import './styles/ManageProducts.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const categories = ["All", ...new Set(products.map((product) => product.category))];

  const chartData = {
    labels: products.map((product) => product.name),
    datasets: [
      {
        label: "Stock Available",
        data: products.map((product) => product.stock),
        backgroundColor: "rgba(59, 130, 246, 0.6)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Product Inventory Levels',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Stock Quantity'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Products'
        }
      }
    }
  };

  const loadSellerProducts = async () => {
    setIsLoading(true);
    try {
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
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSellerProducts();
  }, []);

  // Filter products by category and search term
  const filteredProducts = products
    .filter(product => selectedCategory === "All" || product.category === selectedCategory)
    .filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Function to get status badge
  const getStatusBadge = (status, stock) => {
    if (stock === 0) {
      return <Badge bg="danger">Out of Stock</Badge>;
    }
    if (stock < 5) {
      return <Badge bg="warning" text="dark">Low Stock</Badge>;
    }
    return <Badge bg="success">In Stock</Badge>;
  };

  // Function to handle product deletion
  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await fetch(
          `http://localhost:8080/api/seller/deleteProduct/${productId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.ok) {
          // Refresh product list
          loadSellerProducts();
          alert("Product deleted successfully");
        } else {
          alert("Failed to delete product");
        }
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("An error occurred while deleting the product");
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="manage-products-page">
        <Container>
          <div className="page-header">
            <div className="header-content">
              <h1>
                <FaBoxOpen className="header-icon" /> Manage Products
              </h1>
              <p>View, edit and manage your product inventory</p>
            </div>
            <Link to="/seller/manageProducts/addProduct">
              <Button variant="primary" className="add-product-btn">
                <FaPlus className="me-2" /> Add New Product
              </Button>
            </Link>
          </div>

          {/* Search and Filter Bar */}
          <div className="search-filter-bar">
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="filter-box">
              <FaFilter className="filter-icon" />
              <span>Filter by:</span>
              <div className="category-filters">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={
                      selectedCategory === category
                        ? "primary"
                        : "outline-secondary"
                    }
                    className="category-btn"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Products Grid */}
          {isLoading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Loading products...</p>
            </div>
          ) : (
            <>
              {filteredProducts.length > 0 ? (
                <div className="products-grid">
                  {filteredProducts.map((product) => (
                    <Card key={product.id} className="product-card">
                      <div className="product-image-container">
                        <Card.Img
                          className="product-image"
                          src={
                            product.imageUrl ||
                            "https://via.placeholder.com/300x200?text=No+Image"
                          }
                          onError={(e) => {
                            e.target.src =
                              "https://via.placeholder.com/300x200?text=No+Image";
                          }}
                        />
                        <div className="product-status">
                          {getStatusBadge(product.status, product.stock)}
                        </div>
                      </div>
                      <Card.Body>
                        <Card.Title className="product-title">
                          {product.name}
                        </Card.Title>
                        <div className="product-category">
                          <FaTag className="category-icon" />
                          <span>{product.category || "Uncategorized"}</span>
                        </div>
                        <div className="product-info">
                          <div className="price">₹{product.price}</div>
                          <div className="stock">Stock: {product.stock}</div>
                        </div>
                        <Card.Text className="product-description">
                          <strong>Desc : </strong>
                          {product.description}
                          <br></br>
                          <strong>Id : </strong>
                          {product.id}
                        </Card.Text>

                        <div className="product-actions">
                          <Link to={`/viewProduct/${product.id}`}>
                            <Button
                              variant="outline-primary"
                              className="action-btn view-btn"
                            >
                              <FaEye /> View
                            </Button>
                          </Link>
                        </div>
                      </Card.Body>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="no-products">
                  <FaSearch size={40} />
                  <h3>No Products Found</h3>
                  <p>
                    {searchTerm
                      ? "No products match your search criteria. Try different keywords or clear your search."
                      : selectedCategory !== "All"
                      ? `No products found in the "${selectedCategory}" category.`
                      : "You haven't added any products yet. Click 'Add New Product' to get started."}
                  </p>
                  {(searchTerm || selectedCategory !== "All") && (
                    <Button
                      variant="outline-primary"
                      onClick={() => {
                        setSearchTerm("");
                        setSelectedCategory("All");
                      }}
                    >
                      Clear Filters
                    </Button>
                  )}
                </div>
              )}
            </>
          )}

          {/* Inventory Chart */}
          {products.length > 0 && (
            <div className="inventory-chart-section">
              <div className="section-header">
                <FaChartBar className="section-icon" />
                <h2>Inventory Overview</h2>
              </div>
              <div className="chart-container">
                <Bar data={chartData} options={chartOptions} />
              </div>
            </div>
          )}
        </Container>
      </div>
    </>
  );
};

export default ManageProducts;
