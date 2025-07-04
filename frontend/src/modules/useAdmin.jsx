import { useState } from 'react';

const useAppData = () => {
  const [appData, setAppData] = useState({
    isLoading: false,
    error: null,
    data: null,
  });

  const setLoading = (loading) => {
    setAppData((prev) => ({ ...prev, isLoading: loading }));
  };

  const setError = (error) => {
    setAppData((prev) => ({ ...prev, error }));
  };

  const setData = (data) => {
    setAppData((prev) => ({ ...prev, data }));
  };

  return { appData, setLoading, setError, setData };
};

export default useAppData;

// src/utils/api.js

export const fetchData = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const postData = async (url, data) => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const putData = async (url, data) => {
  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const patchData = async (url, data) => {
  try {
    const response = await fetch(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const deleteData = async (url) => {
  try {
    const response = await fetch(url, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const searchData = async (url, query) => {
  try {
    const response = await fetch(`${url}?q=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    throw error;
  }
};
