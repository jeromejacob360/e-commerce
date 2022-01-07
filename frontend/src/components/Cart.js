import {
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import Metadata from '../metadata';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { Link } from 'react-router-dom';
import { addToCart } from '../redux/actions/cartActions';

export default function Cart() {
  const { cartItems: cart, loading } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

  function decrement(item, quantity) {
    if (quantity > 1) {
      dispatch(addToCart(item, -1));
    }
  }

  function increment(item, quantity, stock) {
    if (quantity >= stock) return;
    dispatch(addToCart(item, 1));
  }

  if (!cart) {
    return <div>No items in cart</div>;
  }

  return (
    <div className="pb-10">
      <Metadata title="Cart" />
      <div className="justify-center">
        <TableContainer
          sx={{ maxWidth: 1000, marginX: 'auto' }}
          component={Paper}
        >
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell align="center">Quantity</TableCell>
                <TableCell align="right">Total&nbsp;(₹)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cart.map((item) => (
                <StyledTableRow
                  key={item.productId}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="item">
                    <Link
                      to={`/product/${item.productId}`}
                      className="flex items-center"
                    >
                      <img
                        className="object-contain h-20 mr-2 w-14"
                        src={item.productDetails.images.url}
                        alt="product"
                      />
                      <div>
                        <h3> {item.productDetails.name}</h3>
                        <p> ₹{item.productDetails.price}</p>
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell align="center">
                    <div className="flex items-center justify-center space-x-2">
                      <IconButton
                        disabled={loading || item.quantity === 1}
                        onClick={() =>
                          decrement(item.productDetails, item.quantity)
                        }
                        color="primary"
                        aria-label="reduce"
                        component="span"
                      >
                        <RemoveIcon />
                      </IconButton>
                      <span>{item.quantity}</span>
                      <IconButton
                        disabled={
                          loading || item.quantity === item.productDetails.stock
                        }
                        onClick={() =>
                          increment(
                            item.productDetails,
                            item.quantity,
                            item.productDetails.stock,
                          )
                        }
                        color="primary"
                        aria-label="increase"
                        component="span"
                      >
                        <AddIcon />
                      </IconButton>
                    </div>
                  </TableCell>
                  <TableCell align="right">
                    {item.productDetails.price * item.quantity}
                  </TableCell>
                </StyledTableRow>
              ))}
              <StyledTableRow
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              ></StyledTableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <div className="max-w-[1000px] mt-4 mx-auto">
          <div className="flex justify-end w-full pr-2 text-xl font-bold">
            <p>Total amount:&nbsp; </p>
            <span>
              ₹
              {cart.reduce((acc, item) => {
                return acc + item.productDetails.price * item.quantity;
              }, 0)}
            </span>
          </div>

          <div className="flex justify-end px-4 mt-4">
            <Button variant="contained" color="primary">
              Place order
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
