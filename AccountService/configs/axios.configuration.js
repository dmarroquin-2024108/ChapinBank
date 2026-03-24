import 'dotenv/config';
import axios from 'axios';
console.log('ACCOUNT_SERVICE_URL:', process.env.ACCOUNT_SERVICE_URL);

export const accountServiceClient = axios.create({
    baseURL: process.env.ACCOUNT_SERVICE_URL,
    timeout: 5000
});