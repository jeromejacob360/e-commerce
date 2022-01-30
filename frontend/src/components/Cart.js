import { Button, IconButton } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import Metadata from '../helper-components/Metadata';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { Link } from 'react-router-dom';
import { addToCart, removeFromCart } from '../redux/actions/cartActions';
import { AnimatePresence, motion } from 'framer-motion';

export default function Cart({ history }) {
  const { cartItems, loading } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  function decrement(item, quantity) {
    if (quantity > 1) {
      dispatch(addToCart(item.productId, -1));
    }
  }

  function increment(item, quantity, stock) {
    if (quantity >= stock) return;
    dispatch(addToCart(item.productId, 1));
  }

  function handleCheckout() {
    history.push('/checkout');
  }

  const MotionButton = motion(Button);

  if (!cartItems || !cartItems.length) {
    return (
      <div className="flex flex-col items-center justify-between w-screen mt-20">
        <h1 className="mb-4 text-3xl">Your cart is empty</h1>
        <Button component={Link} to="/products">
          Continue Shopping
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
      className="pb-10"
    >
      <Metadata title="Cart" />
      <div>
        <h1 className="mb-4 text-2xl text-center">
          <span className="px-10 pb-2 border-b">Shopping Cart</span>
        </h1>

        <motion.div
          layoutId="step"
          className="max-w-[1000px] mx-auto mt-10 shadow-md sm:p-4"
        >
          <div>
            <ul
              className="grid font-semibold"
              style={{
                gridTemplateColumns: '2fr 1fr 1fr',
              }}
            >
              <li className="p-1 sm:pl-4">Product</li>
              <li className="text-center ">Quantity</li>
              <li className="pr-1 text-right sm:pr-4 ">Total&nbsp;(₹)</li>
            </ul>
            <div>
              <AnimatePresence>
                {cartItems.length &&
                  cartItems.map((item) => (
                    <motion.div
                      initial={{
                        height: '150px',
                        overflow: 'hidden',
                        margin: 0,
                      }}
                      animate={{
                        height: 'auto',
                        overflow: 'visible',
                      }}
                      exit={{
                        height: 0,
                        overflow: 'hidden',
                        margin: 0,
                      }}
                      transition={{ duration: 0.3 }}
                      className="border-t "
                      key={item.productId}
                    >
                      <ul
                        className="grid p-2"
                        style={{
                          gridTemplateColumns: '2fr 1fr 1fr',
                        }}
                      >
                        <li>
                          <Link
                            to={`/product/${item.productId}`}
                            className="flex items-center"
                          >
                            <img
                              className="object-contain h-20 mr-2 w-14"
                              src={item.image.url}
                              alt="product"
                            />
                            <div>
                              <p className="pl-1">₹{item.price}</p>
                            </div>
                          </Link>
                        </li>
                        <li className="flex flex-col items-center">
                          <div className="flex items-center justify-center space-x-2">
                            <IconButton
                              disabled={loading || item.quantity === 1}
                              onClick={() => decrement(item, item.quantity)}
                              color="primary"
                              aria-label="reduce"
                              component="span"
                            >
                              <RemoveIcon />
                            </IconButton>
                            <span>{item.quantity}</span>
                            <IconButton
                              disabled={loading || item.quantity === item.stock}
                              onClick={() =>
                                increment(item, item.quantity, item.stock)
                              }
                              color="primary"
                              aria-label="increase"
                              component="span"
                            >
                              <AddIcon />
                            </IconButton>
                          </div>
                          <Button
                            onClick={() =>
                              dispatch(removeFromCart(item.productId))
                            }
                            variant="text"
                          >
                            Remove
                          </Button>
                        </li>
                        <li className="pr-4 text-right ">
                          {item.price * item.quantity}
                        </li>
                      </ul>
                      <h3 className="mt-1 whitespace-nowrap">{item.name}</h3>
                      <p className="mt-1 mb-2">{item.description}</p>
                    </motion.div>
                  ))}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.1 }}
          className="max-w-[1000px] mt-4 mx-auto"
        >
          <div className="flex justify-end w-full pr-2 text-xl font-bold">
            <p>Total amount:&nbsp; </p>
            <span>
              ₹
              {cartItems.reduce((acc, item) => {
                return acc + item.price * item.quantity;
              }, 0)}
            </span>
          </div>

          <div className="flex justify-end px-4 mt-4">
            <MotionButton
              layoutId="button"
              onClick={handleCheckout}
              variant="contained"
              color="primary"
            >
              Place order
            </MotionButton>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
