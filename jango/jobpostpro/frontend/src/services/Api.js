import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api/jobposting';

export const fetchLocations = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/locations/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching locations:', error);
    throw error;
  }
};

export const addLocation = async (locationName) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/locations/`, { name: locationName });
    return response.data;
  } catch (error) {
    console.error('Error adding location:', error);
    throw error;
  }
};