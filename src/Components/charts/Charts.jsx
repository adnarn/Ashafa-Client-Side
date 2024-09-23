import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './charts.css';
import styles from './Charts.module.css';
import { Chart as ChartJs, ArcElement, Legend, Tooltip } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { FaRegEdit, FaReceipt, FaTrash } from 'react-icons/fa';
import swal from 'sweetalert';

ChartJs.register(ArcElement, Legend, Tooltip);

const Charts = ({ theme }) => {
  const data = {
    labels: ['Approved', 'Pending', 'Error'],
    datasets: [{
      data: [9, 5, 3],
      backgroundColor: ['aqua', 'orange', 'red']
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          boxWidth: 20,
          padding: 15
        }
      },
      tooltip: {
        enabled: true,
      }
    }
  };

  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchItems(); 
  }, []);

  const fetchItems = () => {
    const url = 'http://localhost:4000/api/items';
    axios.get(url)
      .then(result => {
        const data = Array.isArray(result.data) ? result.data : [];
        setItems(data);
      })
      .catch(err => console.log(err));
  };

  // Helper function to format date (adjust based on the date format in your backend)
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Check if two dates are the same day
  const isSameDay = (date1, date2) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return d1.toDateString() === d2.toDateString();
  };

  // Filter items to get only today's items
  const today = new Date();
  const todayItems = items.filter(item => isSameDay(item.createdAt, today));

  return (
    <div className={`charts ${theme === 'light' ? 'light-theme' : 'dark-theme'}`}>
      <div className={`topContents ${theme === 'light' ? 'light-theme' : 'dark-theme'}`}>
        <div className={`records ${theme === 'light' ? 'light-pieChart' : 'dark-pieChart'}`}>
          <h5>TODAY'S INCOME= &#8358;{todayItems.reduce((acc, item) => acc + item.price, 0)}</h5>
        </div>
        <div className={`records ${theme === 'light' ? 'light-pieChart' : 'dark-pieChart'}`}>
          <h5>OVERALL INCOME = &#8358;{items.reduce((acc, item) => acc + item.price, 0)}</h5>
        </div>
        <div className={`records ${theme === 'light' ? 'light-pieChart' : 'dark-pieChart'}`}>
          <h5>EXPENSES = 0</h5> 
        </div>
      </div>
      
      <div className="asideContents">
        <div className={`Profits table-responsive ${theme === 'light' ? 'light-pieChart' : 'dark-pieChart'}`}>
          <table className={`table table-sm ${theme === 'light' ? 'table-light' : 'table-dark'}`}>
            <thead>
              <tr>
                <th>S/N</th>
                <th>Service Name</th>
                <th>Price</th>
                <th>Date</th> {/* New column for the date */} 
              </tr>
            </thead>
            <tbody>
              {todayItems.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.name}</td>
                  <td>&#8358;{item.price}</td>
                  <td>{formatDate(item.createdAt)}</td>
                </tr>
              ))}

              {/* Display the total price for today */}
              <tr>
                <td colSpan="2"><strong>Today's Total</strong></td>
                <td colSpan="2">
                  <strong>&#8358;{todayItems.reduce((acc, item) => acc + item.price, 0)}</strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="footer">
        <div className={`pieChart ${theme === 'light' ? 'light-pieChart' : 'dark-pieChart'}`}>
          <Pie data={data} options={options} />
        </div>

        <div className={`toDo ${theme === 'light' ? 'light-pieChart' : 'dark-pieChart'}`}>
          <header><h4>To-Do List</h4></header>

                  <input type="text" placeholder='Add your task' />


        </div>
      </div>
    </div>
  );
};

export default Charts;
