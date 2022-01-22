import Steps from '../helper-components/Steps';
import Metadata from '../helper-components/metadata';
import { useSelector } from 'react-redux';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';

export default function Confirm({ history }) {
  const { user } = useSelector((state) => state.user);
  const shippingInfo = user.shippingInfo || {};
  const { cartItems } = useSelector((state) => state.cart);

  const cartTotal = cartItems.reduce((acc, item) => {
    return acc + item.price * item.quantity;
  }, 0);

  const shipping = cartTotal > 500 ? 0 : 50;
  const discount = cartTotal < 10000 ? 0 : 0.05 * cartTotal;
  const total = cartTotal + shipping - discount;

  function proceedToPayment(e) {
    e.preventDefault();
    const data = {
      cartTotal,
      shipping,
      discount,
      total,
    };
    sessionStorage.setItem('orderInfo', JSON.stringify(data));
    history.push('/payment');
  }

  const address = `${shippingInfo.area}, ${shippingInfo.street}, ${shippingInfo.city}, ${shippingInfo.district}, ${shippingInfo.state}`;
  return (
    <div className="max-w-screen-xl mx-auto mb-10">
      <Metadata title="Confirm order" />
      <Steps activeStep={1} />
      <div className="px-4 mt-10 md:grid md:grid-cols-[2fr_1fr] ">
        <div className="md:mr-10 SHIPPING">
          <div className="px-4 ADDRESS">
            <h3 className="px-10 pb-2 mb-4 text-xl text-center border-b">
              Shipping Address
            </h3>
            <div className="mb-10">
              <div>
                <span>Name:&nbsp;</span>
                <span>{shippingInfo.name}</span>
              </div>
              <div>
                <span>Phone:&nbsp;</span>
                <span>{shippingInfo.mobile}</span>
              </div>
              <div>
                <span>Address:&nbsp;</span>
                <span>{address}</span>
              </div>
              <div>
                <span>PIN:&nbsp;</span>
                <span>{shippingInfo.pinCode}</span>
              </div>
            </div>
          </div>
          <div className="CART">
            <h4 className="pb-2 mb-4 text-xl text-center border-b">
              Cart Items
            </h4>
            {cartItems.map((item) => {
              return (
                <div
                  key={item.productId}
                  className="flex items-center justify-between mb-4"
                >
                  <Link to={`/product/${item.productId}`}>
                    <img
                      src={item.image.url}
                      className="object-contain mr-2 w-28 h-28"
                      alt=""
                    />
                  </Link>
                  <span>{item.name}</span>
                  <div className="space-x-2">
                    <span>{item.quantity}</span>
                    <span>x</span>
                    <span>₹{item.price}</span>
                    <span>=</span>
                    <span className="text-base">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                </div>
              );
            })}
            <div className="py-3 text-right border-t border-b">
              Total:&nbsp;₹{cartTotal}
            </div>
          </div>
        </div>
        <div className="PAYMENT">
          <h4 className="pb-2 mb-4 text-xl text-center border-b">
            Order Summary
          </h4>
          <div className="flex justify-between mb-2 px-14">
            <span>Cart Total:&nbsp;</span>
            <span>₹{cartTotal}</span>
          </div>
          <div className="flex justify-between mb-2 px-14">
            <span>Shipping:&nbsp;</span>
            <span>₹{shipping}</span>
          </div>
          <div className="flex justify-between mb-2 px-14">
            <span>Discount:&nbsp;</span>
            <span>₹{discount}</span>
          </div>
          <div className="flex justify-between py-2 text-lg font-semibold border-t border-b px-14">
            <span>Total:&nbsp;</span>
            <span>₹{total}</span>
          </div>
          <Button
            onClick={proceedToPayment}
            fullWidth
            sx={{
              mt: 3,
            }}
            variant="contained"
          >
            Proceed to payment
          </Button>
        </div>
      </div>
    </div>
  );
}
