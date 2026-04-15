import axios from 'axios';
import { API_CONFIG, API_ENDPOINTS, PRODUCTION_API_BASE_URL } from '../config/api.config';

/** On device/emulator, localhost is the device — never use it for API. */
const safeBaseURL = (url) => {
  if (!url || /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?(\/|$)/i.test(url)) {
    return PRODUCTION_API_BASE_URL;
  }
  return url;
};

/**
 * API Service - Handles all HTTP requests to the backend
 * Uses axios for HTTP communication with the Express.js backend
 */
class ApiService {
  constructor() {
    const baseURL = safeBaseURL(API_CONFIG.baseURL);
    // Create axios instance with default config
    this.client = axios.create({
      baseURL,
      timeout: API_CONFIG.timeout,
      headers: API_CONFIG.headers,
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Log requests in development
        if (__DEV__) {
          console.log('API Request:', config.method.toUpperCase(), config.url);
        }
        return config;
      },
      (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        // Log responses in development
        if (__DEV__) {
          console.log('API Response:', response.status, response.config.url);
        }
        return response;
      },
      (error) => {
        // Handle common errors
        if (error.response) {
          // Server responded with error status
          console.error('API Error:', error.response.status, error.response.data);
        } else if (error.request) {
          // Request made but no response
          console.error('Network Error: No response received');
        } else {
          // Error setting up request
          console.error('Request Setup Error:', error.message);
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Create a new submission with retry logic
   * @param {Object} data - Submission data
   * @param {string} data.category - Category (academic, administrative, extracurricular, general)
   * @param {string} data.title - Title (max 200 chars)
   * @param {string} data.content - Content (max 2000 chars)
   * @param {boolean} data.isAnonymous - Whether submission is anonymous
   * @param {Object|null} data.submitter - Submitter info (required if not anonymous)
   * @param {string|null} data.imageData - Base64 encoded image (optional)
   * @param {number} retries - Number of retry attempts (default: 2)
   * @returns {Promise<Object>} Response with tracking code and submission details
   */
  async createSubmission(data, retries = 2) {
    const baseURL = this.client.defaults.baseURL;
    const fullURL = `${baseURL.replace(/\/$/, '')}${API_ENDPOINTS.createSubmission}`;
    // #region agent log
    // #endregion
    try {
      const response = await this.client.post(API_ENDPOINTS.createSubmission, data);
      const payload = response.data?.data != null ? response.data.data : response.data;
      // #region agent log
      // #endregion
      return {
        success: true,
        data: payload,
      };
    } catch (error) {
      const errType = error.response ? 'response' : (error.request ? 'no_response' : 'setup');
      const errDetail = error.response ? { status: error.response.status } : (error.request ? {} : { message: error.message });
      // #region agent log
      const errData = error.response ? { status: error.response.status, bodyKeys: error.response.data ? Object.keys(error.response.data) : [], method: 'POST', url: fullURL } : { errType, ...errDetail };
      // #endregion
      // Return field-level validation errors so the UI can highlight specific fields
      if (error.response && error.response.status === 400) {
        const errorData = error.response.data;
        return {
          success: false,
          error: errorData?.message || 'Validation failed',
          validationErrors: errorData?.errors || [],
        };
      }
      // Retry on network errors
      if (retries > 0 && (!error.response || error.response.status >= 500)) {
        console.log(`Retrying submission... (${retries} attempts left)`);
        await this._delay(1000); // Wait 1 second before retry
        return this.createSubmission(data, retries - 1);
      }
      return this._handleError(error, 'Failed to create submission');
    }
  }

  /**
   * Track a submission by tracking code with retry logic
   * @param {string} trackingCode - Tracking code (format: VISI-XXXXX-XXXX)
   * @param {number} retries - Number of retry attempts (default: 2)
   * @returns {Promise<Object>} Submission details
   */
  async trackSubmission(trackingCode, retries = 2) {
    const baseURL = this.client.defaults.baseURL;
    const path = API_ENDPOINTS.trackSubmission(trackingCode);
    const fullURL = `${baseURL.replace(/\/$/, '')}${path}`;
    // #region agent log
    // #endregion
    try {
      const response = await this.client.get(path);
      const rawKeys = response.data && typeof response.data === 'object' ? Object.keys(response.data) : [];
      const payload = response.data?.data != null ? response.data.data : response.data;
      const isPayloadObject = typeof payload === 'object' && payload !== null && !Array.isArray(payload);
      const payloadKeys = isPayloadObject ? Object.keys(payload) : [];
      const hasTitle = isPayloadObject && 'title' in payload;
      const hasContent = isPayloadObject && 'content' in payload;
      const hasStatus = isPayloadObject && 'status' in payload;
      const hasPriority = isPayloadObject && 'priority' in payload;
      const hasCreatedAt = isPayloadObject && 'createdAt' in payload;
      // #region agent log
      // #endregion
      if (!isPayloadObject || !('trackingCode' in payload)) {
        return {
          success: false,
          error: 'Invalid response from server. The app may be pointed at the web app URL instead of the API server. Check Settings for the correct API URL.',
        };
      }
      return {
        success: true,
        data: payload,
      };
    } catch (error) {
      const errType = error.response ? 'response' : (error.request ? 'no_response' : 'setup');
      const errDetail = error.response ? { status: error.response.status } : (error.request ? {} : { message: error.message });
      // #region agent log
      // #endregion
      if (error.response && error.response.status === 404) {
        const errorData = error.response.data;
        return {
          success: false,
          error: errorData?.message || 'Tracking code not found',
          notFound: true,
          reason: errorData?.reason || 'not_found',
        };
      }
      // Retry on network errors
      if (retries > 0 && (!error.response || error.response.status >= 500)) {
        console.log(`Retrying tracking... (${retries} attempts left)`);
        await this._delay(1000); // Wait 1 second before retry
        return this.trackSubmission(trackingCode, retries - 1);
      }
      return this._handleError(error, 'Failed to track submission');
    }
  }

  /**
   * Upload an image (if separate from createSubmission)
   * Note: In the current backend, images are uploaded as part of createSubmission
   * This method is here for future use if a separate upload endpoint is needed
   * @param {string} imageData - Base64 encoded image
   * @returns {Promise<Object>} Response with image URL
   */
  async uploadImage(imageData) {
    try {
      const response = await this.client.post(API_ENDPOINTS.uploadImage, {
        image: imageData,
      });
      
      return {
        success: true,
        imageUrl: response.data.imageUrl,
      };
    } catch (error) {
      return this._handleError(error, 'Failed to upload image');
    }
  }

  /**
   * Check backend API health
   * @returns {Promise<boolean>} True if API is reachable
   */
  async checkHealth() {
    try {
      // Try to make a simple request to check connectivity
      // Using a HEAD request or a dedicated health endpoint if available
      const response = await this.client.get('/api/health', {
        timeout: 5000, // Shorter timeout for health check
      });
      return response.status === 200;
    } catch (error) {
      // If no health endpoint, try the main API endpoint
      try {
        await this.client.get('/api/suggestions', {
          timeout: 5000,
          validateStatus: (status) => status < 500, // Accept any non-500 status
        });
        return true;
      } catch (fallbackError) {
        console.error('Health check failed:', fallbackError.message);
        return false;
      }
    }
  }

  /**
   * Handle API errors and format error response
   * @private
   * @param {Error} error - Axios error object
   * @param {string} defaultMessage - Default error message
   * @returns {Object} Formatted error response
   */
  _handleError(error, defaultMessage) {
    let errorMessage = defaultMessage;
    let errorDetails = null;

    if (error.response) {
      const status = error.response.status;
      if (status === 405) {
        errorMessage = 'Server returned 405 (Method Not Allowed). The app may be pointed at the web app URL instead of the API server. Set the API URL in Settings to your backend server.';
      } else {
        errorMessage = error.response.data?.message || error.response.data?.error || defaultMessage;
      }
      errorDetails = error.response.data;
    } else if (error.request) {
      errorMessage = 'Network error. Please check your internet connection.';
    } else {
      errorMessage = error.message || defaultMessage;
    }

    return {
      success: false,
      error: errorMessage,
      details: errorDetails,
    };
  }

  /**
   * Delay helper for retry logic
   * @private
   * @param {number} ms - Milliseconds to delay
   * @returns {Promise<void>}
   */
  _delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Update base URL (useful for switching environments)
   * @param {string} newBaseURL - New base URL
   */
  setBaseURL(newBaseURL) {
    this.client.defaults.baseURL = newBaseURL;
  }

  /**
   * Get current base URL
   * @returns {string} Current base URL
   */
  getBaseURL() {
    return this.client.defaults.baseURL;
  }
}

// Export singleton instance
const apiService = new ApiService();
export { apiService };
export default apiService;
