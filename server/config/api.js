// src/config/api.js
const API_BASE_URL = 'http://localhost:8080/api';

export const API_ENDPOINTS = {
  products: {
    all: `${API_BASE_URL}/products/all`,
    lim: `${API_BASE_URL}/products/lim`,
    add: `${API_BASE_URL}/products/add`,
    getById: (id) => `${API_BASE_URL}/products/${id}`,
  }
};

export default API_BASE_URL;