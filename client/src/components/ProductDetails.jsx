import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Grid,
  Box,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { productApi } from '../services/api';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [stock, setStock] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogAction, setDialogAction] = useState('');
  const [quantity, setQuantity] = useState('');

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const productData = await productApi.getProduct(id);
      const stockData = await productApi.getStockQuantity(id);
      setProduct(productData);
      setStock(stockData.quantity);
    } catch (error) {
      setError(error.message || 'Failed to fetch product details');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (action) => {
    setDialogAction(action);
    setQuantity('');
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setDialogAction('');
    setQuantity('');
  };

  const handleStockAction = async () => {
    try {
      setLoading(true);
      const numQuantity = parseInt(quantity);
      
      switch (dialogAction) {
        case 'checkin':
          await productApi.checkInStock(id, numQuantity);
          break;
        case 'checkout':
          await productApi.checkOutStock(id, numQuantity);
          break;
        case 'sell':
          await productApi.sellProduct(id, numQuantity);
          break;
        default:
          throw new Error('Invalid action');
      }
      
      await fetchProductDetails();
      handleCloseDialog();
    } catch (error) {
      setError(error.message || 'Failed to update stock');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !product) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box display="flex" alignItems="center" mb={4}>
        <IconButton onClick={() => navigate('/products')} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1">
          Product Details
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {product && (
        <Card>
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h5" component="h2">
                  {product.name}
                </Typography>
                <Typography color="textSecondary" paragraph>
                  {product.description}
                </Typography>
                <Typography variant="h6" color="primary">
                  Price: ${product.price}
                </Typography>
                <Typography variant="h6" color={stock > 0 ? 'success.main' : 'error.main'}>
                  Current Stock: {stock}
                </Typography>
              </Grid>
              
              <Grid item xs={12}>
                <Box display="flex" gap={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleOpenDialog('checkin')}
                    disabled={loading}
                  >
                    Check In Stock
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleOpenDialog('checkout')}
                    disabled={loading || stock === 0}
                  >
                    Check Out Stock
                  </Button>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => handleOpenDialog('sell')}
                    disabled={loading || stock === 0}
                  >
                    Sell Product
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {dialogAction === 'checkin' && 'Check In Stock'}
          {dialogAction === 'checkout' && 'Check Out Stock'}
          {dialogAction === 'sell' && 'Sell Product'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Quantity"
            type="number"
            fullWidth
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            disabled={loading}
            InputProps={{ inputProps: { min: 1 } }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleStockAction}
            color="primary"
            disabled={loading || !quantity || parseInt(quantity) < 1}
          >
            {loading ? <CircularProgress size={24} /> : 'Confirm'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProductDetails;
