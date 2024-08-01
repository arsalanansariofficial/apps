import './orders.scss';
import useCache from '../../hooks/use-cache';
import { App_User } from '../../utility/types';

export default function Orders() {
  const { value: user } = useCache<App_User>('userHavingOrders');

  if (!user)
    return (
      <ul className="my-0 mx-auto container-sm doctors">
        <li className="doctors__title">Your orders</li>
        <li>
          <h4 className="text-center">Login to view your orders!</h4>
        </li>
      </ul>
    );

  if (user?.orders && !user.orders.length)
    return (
      <ul className="my-0 mx-auto container-sm doctors">
        <li className="doctors__title">Your orders</li>
        <li>
          <h4 className="text-center">No orders here!</h4>
        </li>
      </ul>
    );

  return (
    <ul className="my-0 mx-auto container-sm doctors">
      <li className="appointments__title">Your orders</li>
      {user?.orders.map(function (order, index) {
        return (
          <li key={index} className="py-1 appointment">
            <div className="my-2 d-flex justify-content-between align-items-center appointment__head">
              <span className="btn--secondary appointment-id d-flex gap-1 ">
                {order._id.slice(-5)}
                <span className="appointment-id">Rs. {order.totalAmount}</span>
              </span>
              <span className="d-flex align-items-center gap-1 btn--secondary appointment-time">
                <i className="fa fa-clock-o clock-icon"></i>
                {new Date(order.createdAt).toDateString()}
              </span>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
