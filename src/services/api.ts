import axios from 'axios';

// const url = process.env.API_URL_BACKEND
const url = 'https://template-nodejs-nest-postgresql.onrender.com'

export const api = axios.create({
  baseURL: url,
});
