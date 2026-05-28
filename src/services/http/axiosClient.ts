import { create as createAxios, type AxiosInstance } from 'axios';
import { config } from '@/constants/config';
import { normalizeError } from './errorNormalizer';

const axiosClient: AxiosInstance = createAxios({
  baseURL: config.apiUrl,
  timeout: 15_000,
  headers: {
    Accept: 'application/json',
  },
});

// ─── Request interceptor ──────────────────────────────────────────────────────

axiosClient.interceptors.request.use((req) => {
  // Always inject the Device ID
  req.headers['X-Device-Id'] = config.deviceId;

  // If the body is a native FormData object, let the XHR layer set the
  // Content-Type boundary automatically (unused since createPayment builds
  // the multipart body as a string — kept as a safeguard for future endpoints)
  if (req.data instanceof FormData) {
    delete req.headers['Content-Type'];
  }

  return req;
});

// ─── Response interceptor ────────────────────────────────────────────────────

axiosClient.interceptors.response.use(
  (res) => res,
  (error) => {
    const normalized = normalizeError(error);
    return Promise.reject(normalized);
  }
);

export default axiosClient;
