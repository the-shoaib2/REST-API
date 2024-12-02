import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'An error occurred';
    console.error('API Error:', message);
    return Promise.reject({ message });
  }
);

export const productApi = {
  getAllProducts: async () => {
    try {
      const response = await api.get('/products');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  getProduct: async (id) => {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  createProduct: async (product) => {
    try {
      console.log('Creating product with data:', product);
      const response = await api.post('/products', product);
      return response.data;
    } catch (error) {
      console.error('Product creation failed:', error.response?.data);
      throw error;
    }
  },
  
  updateProduct: async (id, product) => {
    try {
      const response = await api.put(`/products/${id}`, product);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  deleteProduct: async (id) => {
    try {
      await api.delete(`/products/${id}`);
      return true;
    } catch (error) {
      throw error;
    }
  },
  
  checkInStock: async (id, quantity) => {
    try {
      const response = await api.post(`/products/${id}/stock/checkin`, null, { 
        params: { quantity } 
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  checkOutStock: async (id, quantity) => {
    try {
      const response = await api.post(`/products/${id}/stock/checkout`, null, { 
        params: { quantity } 
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  sellProduct: async (id, quantity) => {
    try {
      const response = await api.post(`/products/${id}/sell`, null, { 
        params: { quantity } 
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  getStockQuantity: async (id) => {
    try {
      const response = await api.get(`/products/${id}/stock`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
