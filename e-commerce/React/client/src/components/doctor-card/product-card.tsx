import './product-card.scss';
import { Modal } from 'bootstrap';
import { useEffect } from 'react';
import useCache from '../../hooks/use-cache';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { App_Product } from '../../utility/types';
import { appActions, Cart_Items } from '../../store/app-slice';

export default function ProductCard({ product }: { product: App_Product }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const productImage = import.meta.env.VITE_BASE_URL + product.productImage;

  const { value: cart } = useCache<Cart_Items[]>('cart');

  function addProductToCart() {
    const newCart = JSON.parse(JSON.stringify(cart)) as typeof cart;
    const existingItem = newCart.find(item => item._id === product._id);

    if (existingItem) existingItem.quantity++;
    else newCart.push({ ...product, quantity: 1 });

    sessionStorage.setItem('cart', JSON.stringify(newCart));

    return newCart;
  }

  function addToCart(isBuying = false) {
    dispatch(appActions.addToCart(addProductToCart()));
    if (isBuying) return navigate('/orders', { replace: true });
    new Modal('#confirmation-modal').show();
  }

  useEffect(function () {}, [cart]);

  return (
    <div className="mx-0 p-3 p-sm-0 my-3 my-sm-0 row gap-3 doctor-card">
      <div className="p-0 col align-self-stretch doctor-card__head">
        <img className="mw-100" src={productImage} alt="profile-picture" />
      </div>
      <div className="p-0 p-sm-3 col align-self-center doctor-card__body">
        <div className="text-container">
          <span className="d-flex flex-wrap align-items-center justify-content-between">
            <span className="d-block order-1 order-sm-0">{product.name}</span>
            <span className="d-block btn--secondary py-0">
              Rs. {product.price}
            </span>
          </span>
          <span className="d-block mt-1 mt-sm-0">{product.description}</span>
        </div>
        <div className="my-1 d-flex flex-column gap-2 button-container">
          <button
            onClick={addToCart.bind(null, true)}
            className="text-center text-decoration-none btn--primary"
          >
            Buy Now
          </button>
          <button
            onClick={addToCart.bind(null, false)}
            className="text-center text-decoration-none btn--secondary"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
