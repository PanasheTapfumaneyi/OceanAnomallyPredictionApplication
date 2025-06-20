import axios from 'axios';

const API_BASE_URL = 'http://192.168.100.220:5000/';

export const predictWhaleMigration = async (params) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/predict_migration`, params);
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw new Error(error.response?.data?.message || 'Failed to predict whale migration');
  }
};

export const predictTemperature = async (params) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/predict_temperature`, params);
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw new Error(error.response?.data?.message || 'Failed to predict temperature anomaly');
  }
};