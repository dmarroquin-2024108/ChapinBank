import 'dotenv/config';
import axios from 'axios';

export const authServiceClient = axios.create({
  baseURL: process.env.AUTH_SERVICE_URL,
  timeout: 5000,
});
