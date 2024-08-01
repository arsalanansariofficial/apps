import { getProducts } from '@/lib/actions';
import Products from '@/components/products';
import processEnv from '../../../../next-env';
import {
  App_Exception,
  App_Product_Public,
  App_Response_Public
} from '@/lib/types';

export default async function ProductsPage() {
  const response = (await getProducts()) as
    | App_Exception
    | App_Response_Public<App_Product_Public[]>;

  const _exception = response as App_Exception;
  const exception = _exception.status ? _exception : null;
  const products = (response as App_Response_Public<App_Product_Public[]>).data;

  return (
    <Products
      products={products}
      exception={exception}
      baseURL={processEnv.BASE_URL}
      sessionTime={Number(processEnv.SESSION_TIME)}
    />
  );
}
