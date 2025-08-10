import axios from 'axios';
import {BASE_URL} from '../Constants/Config';

export const merchantOverview = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/merchant`);
    return {success: true, data: response.data};
  } catch (error) {
    console.log(error, 'error in merchantOverView');
    return {
      success: false,
      message:
        error.response?.data?.message || 'Failed to fetch merchant details',
      status: error.response?.status || 500,
    };
  }
};

export const getMerchantDetails = async merchantId => {
  try {
    const response = await axios.get(
      `${BASE_URL}/merchant/${merchantId}/outlets`,
    );
    return {success: true, data: response.data};
  } catch (error) {
    console.error('Error fetching merchant details:', error);
    return {
      success: false,
      message:
        error.response?.data?.message || 'Failed to fetch merchant details',
      status: error.response?.status || 500,
    };
  }
};

export const getMerchantOutlets = async merchantId => {
  try {
    const response = await axios.get(
      `${BASE_URL}/merchant/${merchantId}/outlets`,
    );
    return {success: true, data: response.data};
  } catch (error) {
    console.error('Error fetching merchant outlets:', error);
    return {
      success: false,
      message:
        error.response?.data?.message || 'Failed to fetch merchant outlets',
      status: error.response?.status || 500,
    };
  }
};
