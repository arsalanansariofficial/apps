import { useState } from 'react';
import { App_Exception } from '@/lib/types';

export default function useAsync() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [exception, setException] = useState<null | App_Exception>(null);

  async function sendRequest(action: () => Promise<any>) {
    setIsLoading(true);

    const response = await action();
    const exception = response as App_Exception;

    if (exception.status) setException(exception);
    else setData(response);

    setIsLoading(false);
    return response;
  }

  return { data, isLoading, exception, sendRequest };
}
