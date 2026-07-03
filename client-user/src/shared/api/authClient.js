import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_BASE_URLS, ENDPOINTS } from '../constants/endpoints';

const REFRESH_TOKEN_KEY = 'refreshToken';

const createApiClient = (baseURL) => {
  const client = axios.create({
    baseURL,
    timeout: 5000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return client;
};

const authClient = createApiClient(API_BASE_URLS.AUTH);
const accountsClient = createApiClient(API_BASE_URLS.ACCOUNT);
const productClient = createApiClient(API_BASE_URLS.PRODUCT);

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => (error ? reject(error) : resolve(token)));
  failedQueue = [];
};

const getRefreshToken = async () => {
  try {
    return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error('Error getting refresh token from secure store:', error);
    return null;
  }
};

const setRefreshToken = async (token) => {
  try {
    if (token) {
      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
    } else {
      await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
    }
  } catch (error) {
    console.error('Error setting refresh token in secure store:', error);
  }
};

const handleRefreshToken = async (error, originalRequest, client) => {
  if (!error.response) {
    return Promise.reject(error);
  }

  if (!originalRequest || originalRequest._retry) {
    return Promise.reject(error);
  }

  const status = error.response?.status;
  const errorCode = error.response?.data?.error;
  const requestUrl = originalRequest.url || '';
  const isRefreshEndpoint = requestUrl.includes(ENDPOINTS.AUTH.REFRESH);

  const shouldAttemptRefresh = !isRefreshEndpoint && status === 401;
  const shouldAttemptRefreshFrom403 = !isRefreshEndpoint && status === 403 && errorCode === 'TOKEN_EXPIRED';
  const shouldRefresh = shouldAttemptRefresh || shouldAttemptRefreshFrom403;

  if (shouldRefresh) {
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers['Authorization'] = 'Bearer ' + token;
          return client(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    const refreshToken = await getRefreshToken();

    if (!refreshToken) {
      isRefreshing = false;
      await setRefreshToken(null);
      return Promise.reject(error);
    }

    try {
      const response = await authClient.post(ENDPOINTS.AUTH.REFRESH, { refreshToken });
      const { accessToken, refreshToken: newRefreshToken, expiresIn, userDetails } = response.data;

      await setRefreshToken(newRefreshToken);

      const token = accessToken;
      const expiresAt = new Date(Date.now() + expiresIn * 1000).toISOString();

      processQueue(null, token);
      originalRequest.headers['Authorization'] = 'Bearer ' + token;
      return client(originalRequest);
    } catch (err) {
      processQueue(err, null);
      await setRefreshToken(null);
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }

  return Promise.reject(error);
};

authClient.interceptors.request.use(async (config) => {
  config._axiosClient = 'auth';
  const token = await SecureStore.getItemAsync('accessToken');
  const isRefreshEndpoint = config.url?.includes(ENDPOINTS.AUTH.REFRESH);

  if (token && !isRefreshEndpoint) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

accountsClient.interceptors.request.use(async (config) => {
  config._axiosClient = 'accounts';
  const token = await SecureStore.getItemAsync('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

productClient.interceptors.request.use(async (config) => {
  config._axiosClient = 'product';
  const token = await SecureStore.getItemAsync('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

authClient.interceptors.response.use(
  (response) => response,
  async (error) => handleRefreshToken(error, error.config, authClient)
);

accountsClient.interceptors.response.use(
  (response) => response,
  async (error) => handleRefreshToken(error, error.config, accountsClient)
);

productClient.interceptors.response.use(
  (response) => response,
  async (error) => handleRefreshToken(error, error.config, productClient)
);

export { authClient, accountsClient, productClient, setRefreshToken, getRefreshToken };
