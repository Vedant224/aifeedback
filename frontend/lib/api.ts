import { getSession } from 'next-auth/react';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchWithAuth(endpoint: string, options?: RequestInit) {
  try {
    const session = await getSession();
    
    if (!session?.accessToken) {
      throw new Error('No authentication token found');
    }
    
    const formattedEndpoint = endpoint.startsWith('http') 
      ? endpoint 
      : endpoint.startsWith('/api') 
        ? endpoint 
        : `/api${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    
    const url = formattedEndpoint.startsWith('http') 
      ? formattedEndpoint 
      : `${API_URL}${formattedEndpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.accessToken}`,
        ...options?.headers,
      },
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'An error occurred');
    }
    
    return data;
  } catch (error) {
    console.error('API error:', error);
    throw error;
  }
}