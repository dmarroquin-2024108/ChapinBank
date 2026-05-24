import axios from 'axios';
import { useAuthStore } from '../../features/auth/store/authStore';

const axiosAuth = axios.create({
  baseURL: import.meta.env.VITE_AUTH_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const axiosAccounts = axios.create({
  baseURL: import.meta.env.VITE_ACCOUNT_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const axiosProduct = axios.create({
  baseURL: import.meta.env.VITE_PRODUCT_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// INTERCEPTORES
axiosAuth.interceptors.request.use((config) => {
  config._axiosClient = 'auth';
  const token = useAuthStore.getState().token;
  const isRefreshEndpoint = config.url?.includes('/auth/refresh');

  if (token && !isRefreshEndpoint) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

axiosAccounts.interceptors.request.use((config) => {
  config._axiosClient = 'accounts';
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosProduct.interceptors.request.use((config) => {
  config._axiosClient = 'product';
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let _isRefreshing = false;
let failedQueue = [];

function _processQueue(_error, token = null) {
  failedQueue.forEach(({ resolve, reject }) => (_error ? reject(_error) : resolve(token)));
  failedQueue = [];
}

const handleRefreshToken = async function (_error) {
  if (!_error.response) return Promise.reject(_error); //Por si se cae el servidor
  const _original = _error.config;

  if (!_original || _original._retry) {
    // Ya se reintentó o no hay config
    return Promise.reject(_error);
  }

  const status = _error.response?.status;
  const errorCode = _error.response?.data?.error;
  const requestUrl = _original.url || '';
  const isRefreshEndpoint = requestUrl.includes('/auth/refresh');
  const shouldAttemptRefresh =
    !isRefreshEndpoint &&
    // La mayoría de casos es 401 (TokenExpiredError)
    status === 401;

  // Algunos servicios pueden responder 403 con `error: TOKEN_EXPIRED`
  const shouldAttemptRefreshFrom403 =
    !isRefreshEndpoint && status === 403 && errorCode === 'TOKEN_EXPIRED';

  const shouldRefresh = shouldAttemptRefresh || shouldAttemptRefreshFrom403;

  if (shouldRefresh) {
    const clientMap = {
      auth: axiosAuth,
      accounts: axiosAccounts,
      product: axiosProduct,
    };
    const retryClient = clientMap[_original._axiosClient] ?? axiosAuth;

    if (_isRefreshing) {
      // Si ya hay un refresh en curso, encola la petición
      return new Promise(function (resolve, reject) {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          _original.headers['Authorization'] = 'Bearer ' + token;
          return retryClient(_original);
        })
        .catch((err) => Promise.reject(err));
    }
    _original._retry = true;
    _isRefreshing = true;
    const refreshToken = useAuthStore.getState().refreshToken;

    if (!refreshToken) {
      _isRefreshing = false;
      useAuthStore.getState().logout();
      return Promise.reject(_error);
    }

    try {
      const response = await axiosAuth.post('/auth/refresh', { refreshToken });
      const { accessToken, refreshToken: newRefreshToken, expiresIn, userDetails } = response.data;

      const token = accessToken;
      const expiresAt = new Date(Date.now() + expiresIn * 1000).toISOString();

      useAuthStore.setState({
        token,
        refreshToken: newRefreshToken,
        expiresAt,
        user: userDetails || useAuthStore.getState().user,
        isAuthenticated: true,
      });

      _processQueue(null, token);
      _original.headers['Authorization'] = 'Bearer ' + token;
      return retryClient(_original);
    } catch (err) {
      _processQueue(err, null);
      useAuthStore.getState().logout();
      return Promise.reject(err);
    } finally {
      _isRefreshing = false;
    }
  }
  return Promise.reject(_error);
};

axiosAuth.interceptors.response.use((res) => res, handleRefreshToken);
axiosAccounts.interceptors.response.use((res) => res, handleRefreshToken);
axiosProduct.interceptors.response.use((res) => res, handleRefreshToken);

export { axiosAuth, axiosAccounts, axiosProduct };
export { handleRefreshToken };
