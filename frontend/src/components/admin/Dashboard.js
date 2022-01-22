import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Doughnut, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminProducts } from '../../redux/actions/productActions';
import Loading from '../../helper-components/Loading';
import PageTitle from '../../helper-components/PageTitle';
import { fetchAllUsers } from '../../redux/actions/userActions';
import { getAllOrders } from '../../redux/actions/orderActions';
import Sidebar from '../admin/Sidebar';

export default function Dashboard() {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Tooltip,
    Legend,
  );
  const { loading, products } = useSelector((state) => state.products);
  const { users } = useSelector((state) => state.allUsers);
  const { orders } = useSelector((state) => state.allOrders);
  const [totalAmount, setTotalAmount] = useState(0);
  const [shippedLength, setShippedLength] = useState(0);
  const [deliveredLength, setDeliveredLength] = useState(0);
  const [cumulativeOrderAmounts, setCumulativeOrderAmounts] = useState(0);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAdminProducts());
    dispatch(fetchAllUsers());
    dispatch(getAllOrders());
  }, [dispatch]);

  useEffect(() => {
    const totalAmount =
      orders &&
      orders.reduce((acc, order) => {
        return acc + order.totalPrice;
      }, 0);

    setTotalAmount(totalAmount);

    const shippedLength = orders?.filter(
      (order) => order.orderStatus === 'Shipped',
    ).length;
    setShippedLength(shippedLength);

    const deliveredLength = orders?.filter(
      (order) => order.orderStatus === 'Delivered',
    ).length;
    setDeliveredLength(deliveredLength);

    let cumulativeOrderAmounts = [];
    orders?.reduce(
      (acc, order, i) => (cumulativeOrderAmounts[i] = order?.totalPrice + acc),
      0,
    );
    setCumulativeOrderAmounts(cumulativeOrderAmounts);
  }, [orders]);

  const LineData = {
    labels: orders?.map((order) =>
      new Date(order?.paidAt).toLocaleDateString(),
    ),
    datasets: [
      {
        label: 'TOTAL TURNOVER IN RUPEES',
        data: cumulativeOrderAmounts,
        fill: true,
        lineTension: 0.5,
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderColor: 'rgba(75,192,192,1)',
      },
    ],
  };

  const doughnutData = {
    labels: ['Processing', 'Shipped', 'Delivered'],
    datasets: [
      {
        backgroundColor: ['blue', 'gray', 'green'],
        data: [
          orders?.length - shippedLength - deliveredLength,
          shippedLength,
          deliveredLength,
        ],
      },
    ],
  };

  return (
    <div className="flex flex-col">
      <PageTitle title="Admin dashboard" />
      <div className="flex flex-col md:flex-row 2xl:px-10">
        <Sidebar />
        {loading ? (
          <Loading />
        ) : (
          <div className="flex-1 sm:ml-44">
            <h4 className="py-2 mt-10 mb-10 text-2xl text-center text-white bg-orange-400 md:py-10">
              <p>Total amount </p>
              <p>₹{totalAmount}</p>
            </h4>
            <div className="flex items-center justify-between px-4 my-10 md:text-2xl xl:mx-40 lg:mx-28 md:mx-10">
              <Link
                className="grid w-24 h-24 my-2 bg-blue-300 rounded-full md:w-40 md:h-40 place-items-center"
                to="/admin/products"
              >
                <div className="flex flex-col items-center space-x-2">
                  <p>Products </p>
                  <p>{products?.length}</p>
                </div>
              </Link>
              <Link
                className="grid w-24 h-24 my-2 bg-blue-300 rounded-full md:w-40 md:h-40 place-items-center"
                to="/admin/orders"
              >
                <div className="flex flex-col items-center space-x-2">
                  <p>Orders </p>
                  <p>{orders?.length} </p>
                </div>
              </Link>
              <Link
                className="grid w-24 h-24 my-2 bg-blue-300 rounded-full md:w-40 md:h-40 place-items-center"
                to="/admin/users"
              >
                <div className="flex flex-col items-center space-x-2">
                  <p>Users </p>
                  <p>{users?.length} </p>
                </div>
              </Link>
            </div>
            <div className="w-full px-4 mx-auto my-10 md:w-3/4">
              <Line data={LineData} />
            </div>
            <div className="w-full mx-auto my-10 lg:px-[20%] px-20 md:w-3/4">
              <Doughnut data={doughnutData} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
