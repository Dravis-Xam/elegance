const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const defaultHeaders = {
  'Content-Type': 'application/json',
};

const api = {
  get: async (url, options = {}) => {
    const res = await fetch(`${BASE_URL}${url}`, {
      method: 'GET',
      credentials: 'include',
      headers: defaultHeaders,
      ...options,
    });
    return handleResponse(res);
  },

  post: async (url, body, options = {}) => {
    const res = await fetch(`${BASE_URL}${url}`, {
      method: 'POST',
      credentials: 'include',
      headers: defaultHeaders,
      body: JSON.stringify(body),
      ...options,
    });
    return handleResponse(res);
  },

  put: async (url, body, options = {}) => {
    const res = await fetch(`${BASE_URL}${url}`, {
      method: 'PUT',
      credentials: 'include',
      headers: defaultHeaders,
      body: JSON.stringify(body),
      ...options,
    });
    return handleResponse(res);
  },

  del: async (url, options = {}) => {
    const res = await fetch(`${BASE_URL}${url}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: defaultHeaders,
      ...options,
    });
    return handleResponse(res);
  },
};

async function handleResponse(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || 'Unknown error');
  }
  return data;
}

export default api;
