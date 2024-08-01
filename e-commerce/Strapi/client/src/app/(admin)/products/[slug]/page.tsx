import { Show } from '@/lib/views';
import Product from '@/components/product';
import Exception from '@/components/exception';
import processEnv from '../../../../../next-env';
import { deleteFilesAdmin, getProduct, uploadFilesAdmin } from '@/lib/actions';
import {
  App_Exception,
  App_Product_Public,
  App_Response_Public
} from '@/lib/types';

type App_Product_Page = {
  params: { slug: string };
};

type App_Response_Product =
  | App_Exception
  | App_Response_Public<App_Product_Public>;

export default async function ProductPage({ params }: App_Product_Page) {
  const response = (await getProduct(params.slug)) as App_Response_Product;
  const _exception = response as App_Exception;
  const exception = _exception.status ? _exception : null;
  const product = (response as App_Response_Public<App_Product_Public>).data;

  return (
    <main>
      <Show>
        <Show.When isTrue={!!exception}>
          <Exception exception={exception} />
        </Show.When>
        <Show.Else>
          <Product
            product={product}
            baseURL={processEnv.BASE_URL}
            uploadFilesAction={uploadFilesAdmin}
            deleteFilesAction={deleteFilesAdmin}
            sessionTime={Number(processEnv.SESSION_TIME)}
          />
        </Show.Else>
      </Show>
    </main>
  );
}
