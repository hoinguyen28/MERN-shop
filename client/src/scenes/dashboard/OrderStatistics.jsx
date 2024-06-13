import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TotalRevenueAndOrders = () => {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);

  useEffect(() => {
    const fetchTotalData = async () => {
      try {
        const response = await axios.get('http://localhost:4000/order/thongke/tongdoanhthu');
        setTotalRevenue(response.data.totalRevenue);
        setTotalOrders(response.data.totalOrders);
      } catch (error) {
        console.error('Error fetching total revenue and orders:', error);
      }
    };

    fetchTotalData();
  }, []);

  return (
    <div className="statistics-container">
      <h2>Total Revenue and Orders</h2>
      <div className="statistics-block">
        <div className="statistic revenue">
          <p>Total Revenue</p>
          <span>{totalRevenue}</span>
        </div>
        <div className="statistic orders">
          <p>Total Orders</p>
          <span>{totalOrders}</span>
        </div>
      </div>
      <style jsx>{`
        .statistics-container {
          width: 100%;
          max-width: 600px;
          margin: 0 auto;
          text-align: center;
          font-family: Arial, sans-serif;
        }

        .statistics-block {
          display: flex;
          justify-content: space-around;
          align-items: center;
          padding: 20px;
          border: 1px solid #ddd;
          border-radius: 8px;
          background-color: #f9f9f9;
        }

        .statistic {
          flex: 1;
          margin: 0 10px;
          padding: 20px;
          border: 1px solid #ccc;
          border-radius: 8px;
          background-color: #fff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .revenue {
          background-color: #e0f7fa; /* Light blue background */
        }

        .orders {
          background-color: #ffebee; /* Light red background */
        }

        .statistic p {
          margin: 0;
          font-size: 1.2em;
          color: #333;
        }

        .statistic span {
          display: block;
          margin-top: 10px;
          font-size: 2em;
          font-weight: bold;
        }

        .revenue span {
          color: #007bff; /* Blue text color */
        }

        .orders span {
          color: #d32f2f; /* Red text color */
        }
      `}</style>
    </div>
  );
};

export default TotalRevenueAndOrders;
