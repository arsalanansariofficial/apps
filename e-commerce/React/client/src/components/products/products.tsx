import './products.scss';
import Spinner from '../spinner/spinner.tsx';
import AlertModal from '../modal/alert-modal.tsx';
import { App_State } from '../../store/store.tsx';
import { Modal_Ref } from '../../utility/types.tsx';
import { appActions } from '../../store/app-slice.tsx';
import { useDispatch, useSelector } from 'react-redux';
import { API_END_POINTS } from '../../utility/enums.tsx';
import ProductCard from '../doctor-card/product-card.tsx';
import useAsync, { action } from '../../hooks/use-async.ts';
import { getRequestConfig } from '../../utility/utility.tsx';
import { ChangeEvent, useEffect, useRef, useState } from 'react';

export default function Products() {
  const dispatch = useDispatch();
  const sendRequest = useAsync();

  const alertModal = useRef<Modal_Ref>();
  const [productName, setProductName] = useState(String());
  const isLoading = useSelector((state: App_State) => state.app.isLoading);
  const products = useSelector((state: App_State) => state.app.products);
  const exception = useSelector((state: App_State) => state.app.exception);
  const filteredProducts = useSelector(
    (state: App_State) => state.app.filteredProducts
  );

  function changeFilter(event: ChangeEvent<HTMLInputElement>) {
    setProductName((event.target as HTMLInputElement).value);
  }

  useEffect(function () {
    sendRequest(
      action.bind(
        null,
        getRequestConfig(API_END_POINTS.GET_PRODUCTS, {
          url: String(),
          method: 'GET',
          baseURL: import.meta.env.VITE_BASE_URL
        })
      ),
      'PRODUCTS'
    ).then(products => dispatch(appActions.setfilteredProducts(products)));

    return function () {
      alertModal.current?.close();
    };
  }, []);

  useEffect(
    function () {
      const filteredProducts = products.filter(product =>
        product.name
          .toLocaleLowerCase()
          .includes(productName!.toLocaleLowerCase())
      );
      dispatch(appActions.setfilteredProducts(filteredProducts));
    },
    [productName]
  );

  return (
    <>
      <AlertModal
        ref={alertModal}
        id="alert-products"
        message={exception?.message || 'Something went wrong'}
      />
      <ul className="my-1 mx-auto container-sm doctors">
        <li className="doctors__title">Products</li>
        <li className="my-1 d-flex justify-content-between doctors__filter">
          <input
            type="search"
            className="w-25 form-control btn--secondary"
            placeholder="Search"
            onChange={changeFilter}
          />
        </li>
        <li className="my-3 d-sm-grid gap-sm-3 doctors-list">
          {filteredProducts &&
            filteredProducts.map(function (product, index) {
              return <ProductCard product={product} key={index} />;
            })}
          {!isLoading && !filteredProducts.length && (
            <h3 className="m-auto">No products here!</h3>
          )}
          {isLoading && <Spinner />}
        </li>
      </ul>
    </>
  );
}
