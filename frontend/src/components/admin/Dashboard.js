import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar';
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
import Loading from '../../helper-components/loading/Loading';
import PageTitle from '../../helper-components/PageTitle';

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

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAdminProducts());
  }, [dispatch]);

  const outOfStockCount = products.filter(
    (product) => product.stock === 0,
  ).length;

  const LineData = {
    labels: ['Initial Amount', 'Amount Earned'],
    datasets: [
      {
        label: 'TOTAL AMOUNT',
        backgroundColor: ['green'],
        data: [20, 100],
      },
    ],
  };

  const doughnutData = {
    labels: ['Out of stock', 'In stock'],
    datasets: [
      {
        backgroundColor: ['#5f5d63', '#6800B4'],
        hoverBackgroundColor: ['#38363d', '#35014F'],
        data: [outOfStockCount, products.length - outOfStockCount],
      },
    ],
  };

  if (loading) {
    return <Loading />;
  }

  if (products.length === 0) {
    return <div>No products</div>;
  }

  return (
    <div>
      <PageTitle title="Admin dashboard" />
      <div className="flex flex-col md:flex-row">
        <Sidebar />
        <div className="flex-1 md:px-20">
          <h4 className="py-2 mt-10 mb-10 text-2xl text-center text-white bg-orange-400 md:py-10">
            <p>Total amount </p>
            <p>2000</p>
          </h4>
          <div className="flex flex-col items-center justify-between my-10 md:text-2xl sm:flex-row">
            <Link
              className="grid w-24 h-24 my-2 bg-blue-300 rounded-full md:w-40 md:h-40 place-items-center"
              to="/admin/products"
            >
              <div className="flex flex-col items-center space-x-2">
                <p>Products </p>
                <p>{products.length}</p>
              </div>
            </Link>
            <Link
              className="grid w-24 h-24 my-2 bg-blue-300 rounded-full md:w-40 md:h-40 place-items-center"
              to="/admin/orders"
            >
              <div className="flex flex-col items-center space-x-2">
                <p>Orders </p>
                <p>3 </p>
              </div>
            </Link>
            <Link
              className="grid w-24 h-24 my-2 bg-blue-300 rounded-full md:w-40 md:h-40 place-items-center"
              to="/admin/users"
            >
              <div className="flex flex-col items-center space-x-2">
                <p>Users </p>
                <p>3 </p>
              </div>
            </Link>
          </div>
          <div className="w-full mx-auto my-10 md:w-3/4">
            <Line data={LineData} />
          </div>
          <div className="w-full mx-auto my-10 md:w-3/4">
            <Doughnut data={doughnutData} />
          </div>
        </div>
      </div>
    </div>
  );
}
