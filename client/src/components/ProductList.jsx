import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Box,
  Alert,
  Snackbar,
  CircularProgress
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Visibility as ViewIcon } from '@mui/icons-material';
import { productApi } from '../services/api';

const ProductList = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productApi.getAllProducts();
      setProducts(data);
    } catch (error) {
      setError(error.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (product = null) => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
      });
      setSelectedProduct(product);
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
      });
      setSelectedProduct(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
    });
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      if (selectedProduct) {
        await productApi.updateProduct(selectedProduct.id, formData);
      } else {
        await productApi.createProduct(formData);
      }
      await fetchProducts();
      handleCloseDialog();
    } catch (error) {
      setError(error.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await productApi.deleteProduct(id);
      await fetchProducts();
    } catch (error) {
      setError(error.message || 'Failed to delete product');
    } finally {
      setLoading(false);
    }
  };

  if (loading && products.length === 0) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1">
          Products
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          disabled={loading}
        >
          Add Product
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {loading && (
        <Box display="flex" justifyContent="center" mb={2}>
          <CircularProgress size={24} />
        </Box>
      )}

      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="h2">
                  {product.name}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  {product.description}
                </Typography>
                <Typography variant="body1">
                  Price: ${product.price}
                </Typography>
                <Box display="flex" justifyContent="flex-end" mt={2}>
                  <IconButton
                    color="info"
                    onClick={() => navigate(`/products/${product.id}`)}
                  >
                    <ViewIcon />
                  </IconButton>
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenDialog(product)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(product.id)}
                    disabled={loading}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {selectedProduct ? 'Edit Product' : 'Add Product'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Name"
            type="text"
            fullWidth
            value={formData.name}
            onChange={handleInputChange}
            disabled={loading}
          />
          <TextField
            margin="dense"
            name="description"
            label="Description"
            type="text"
            fullWidth
            multiline
            rows={3}
            value={formData.description}
            onChange={handleInputChange}
            disabled={loading}
          />
          <TextField
            margin="dense"
            name="price"
            label="Price"
            type="number"
            fullWidth
            value={formData.price}
            onChange={handleInputChange}
            disabled={loading}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={loading}>Cancel</Button>
          <Button onClick={handleSubmit} color="primary" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : selectedProduct ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert onClose={() => setError(null)} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProductList;
