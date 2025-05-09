// queryClient.js (or api/queryClient.js)

import { QueryClient, QueryFunction } from '@tanstack/react-query';
import axios from 'axios';

async function throwIfResNotOk(error) {
  if (error.response) {
    const message = error.response.data?.message || error.response.statusText;
    throw new Error(`${error.response.status}: ${message}`);
  } else {
    throw new Error(error.message);
  }
}

export async function apiRequest(method, url, data) {
  try {
    const res = await axios({
      method,
      url,
      data,
      withCredentials: true, // use only if needed
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return res;
  } catch (error) {
    await throwIfResNotOk(error);
  }
}

// Custom fetcher for useQuery
export const getQueryFn = ({ on401 }) => {
  return async ({ queryKey }) => {
    try {
      const res = await axios.get(queryKey[0], {
        withCredentials: true,
      });
      return res.data;
    } catch (error) {
      if (on401 === 'returnNull' && error.response?.status === 401) {
        return null;
      }
      await throwIfResNotOk(error);
    }
  };
};

// Query client setup
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: 'throw' }),
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
