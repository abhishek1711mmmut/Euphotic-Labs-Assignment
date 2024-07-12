// src/services/dishService.js
import axios from 'axios';

export const getDishes = async () => {
  try {
    const response = await axios.get(import.meta.env.VITE_REACT_APP_API_URL);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching dishes', error);
    throw error;
  }
};

export const toggleDishStatus = async (dishId) => {
  try {
    const response = await axios.patch(`${import.meta.env.VITE_REACT_APP_API_URL}/${dishId}/toggle`);
    return response.data.data;
  } catch (error) {
    console.error('Error toggling dish status', error);
    throw error;
  }
};