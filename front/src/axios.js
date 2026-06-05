import axios from 'axios';

// Base URL for the backend API (development)
const api = axios.create({
  baseURL: 'http://localhost:5555',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getCredits = () =>
  api.get('/credits').then((res) => res.data);

export const createCredit = (data) =>
  api.post('/credits', data).then((res) => res.data);

export const updateCredit = (id, data) =>
  api.put(`/credits/${id}`, data).then((res) => res.data);

export const deleteCredit = (id) =>
  api.delete(`/credits/${id}`).then((res) => res.data);
