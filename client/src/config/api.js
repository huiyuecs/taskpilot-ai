// API Configuration
// Supports automatic port detection or manual configuration via environment variable

const getApiBaseUrl = () => {
  // Check for explicit API URL in environment variable
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }

  // Try to detect backend port
  // In development, backend might be on 5000 or 5001
  // Check if backend is on 5001 (common when 5000 is occupied)
  const defaultPort = process.env.REACT_APP_API_PORT || '5001'; // Default to 5001 since 5000 is often occupied
  const fallbackPort = '5000';
  
  // Use the configured port
  return `http://localhost:${defaultPort}/api`;
};

export const API_BASE_URL = getApiBaseUrl();

// Helper function to test API connectivity
export const testApiConnection = async () => {
  try {
    const response = await fetch(`${API_BASE_URL.replace('/api', '')}/api/health`);
    return response.ok;
  } catch (error) {
    return false;
  }
};

export default API_BASE_URL;

