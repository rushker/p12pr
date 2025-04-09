// client/src/hooks/useApi.js
import { useState } from 'react';
import axios from '../api/axiosConfig';

const useApi = (apiFunction) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const request = async (...args) => {
    try {
      setLoading(true);
      const response = await apiFunction(...args);
      setData(response.data);
      return response;
    } catch (err) {
      setError(err.message || 'Unexpected Error!');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { data, error, loading, request };
};

export default useApi;