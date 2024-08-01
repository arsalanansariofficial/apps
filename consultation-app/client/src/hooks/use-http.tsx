import { useState } from 'react';
import { Request } from '../utility/types';
import { getRequestObject } from '../utility/utility';

function getResponseType(response: Response) {
  return response.headers.get('Content-Type')?.includes('application/json');
}

export default function useHttp() {
  const [isLoading, setIsLoading] = useState(false);

  async function sendRequest(request: Request) {
    setIsLoading(true);
    const url = `${import.meta.env.VITE_BASE_URL}${request.path}`;
    const requestConfig = getRequestObject(request);
    try {
      const response = await fetch(url, requestConfig);
      setIsLoading(false);
      switch (response.status) {
        case 200:
        case 201:
          if (getResponseType(response)) return await response.json();
          return await response.text();
        default:
          throw await response.json();
      }
    } catch (error: any) {
      setIsLoading(false);
      if (error.message) throw new Error(error.message);
      if (error.error) throw new Error(error.error);
      throw error;
    }
  }

  return { isLoading, sendRequest };
}
