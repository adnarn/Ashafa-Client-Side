import React, { useState, useEffect } from "react";
import axios from "axios";
import "./charts.css";
import styles from "./Charts.module.css";
import { Chart as ChartJs, ArcElement, Legend, Tooltip } from "chart.js";
import { Pie } from "react-chartjs-2";
import {
  FaRegEdit,
  FaReceipt,
  FaTrash,
  FaTimes,
  FaPlusCircle,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

ChartJs.register(ArcElement, Legend, Tooltip);

const Charts = ({ theme }) => {
  const data = {
    labels: ["Profits", "Expenses"],
    datasets: [
      {
        data: [9, 5],
        backgroundColor: ["aqua", "orange"],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "bottom",
        labels: {
          boxWidth: 20,
          padding: 15,
        },
      },
      tooltip: {
        enabled: true,
      },
    },
  };

  const [items, setItems] = useState([]);
  const [expense, setExpense] = useState("");
  const [profit, setProfit] = useState("");

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = () => {
    const url = "http://localhost:4000/";
    axios
      .get(url)
      .then((result) => {
        const data = Array.isArray(result.data) ? result.data : [];
        setItems(data);
      })
      .catch((err) => console.log(err));
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
  const todayItems = items.filter((item) => isSameDay(item.createdAt, today));

  //Todo api

  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState([]);

  const Submit = (e) => {
    e.preventDefault();

    axios
      .post("http://localhost:4000/task", { taskName })
      .then((result) => {
        console.log(result);

        // Fetch the updated tasks after adding a new one
        axios
          .get("http://localhost:4000/tasks")
          .then((result) => {
            setTasks(result.data); // Update tasks state
            setTaskName(""); // Clear the input after submission
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:4000/deleteTask/${id}`)
      .then((res) => {
        console.log(res);

        // Filter out the deleted task from the current tasks state
        setTasks(tasks.filter((task) => task._id !== id));
      })
      .catch((err) => console.log(err));
  };

  // Calculate total price for today
const todayTotalPrice = todayItems.reduce((acc, entry) => {
  const entryTotal = entry.items.reduce((entryAcc, item) => entryAcc + item.price, 0);
  return acc + entryTotal;
}, 0);

// Calculate overall total price
const overallTotalPrice = items.reduce((acc, entry) => {
  const entryTotal = entry.items.reduce((entryAcc, item) => entryAcc + item.price, 0);
  return acc + entryTotal;
}, 0);



useEffect(() => {
  const fetchExpenses = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/get-expense'); // Adjust the URL if needed
      const data = await response.json();

      if (response.ok) {
        // setItems(data);
        // Calculate the total sum of expenses
        const totalSum = data.reduce((sum, item) => sum + item.price, 0);
        setExpense(totalSum);
      } else {
        toast.error('Failed to fetch expenses');
      }
    } catch (err) {
      toast.error('An error occurred while fetching expenses');
    }
  };

  fetchExpenses();
}, []);



useEffect(() => {
  const calculatedProfit = overallTotalPrice - expense;
  setProfit(calculatedProfit);
}, [expense, overallTotalPrice]);

  return (
    <div
      className={`charts ${theme === "light" ? "light-theme" : "dark-theme"}`}
    >
      <div className="button">
        <Link to="/add-selected-item">
          <button className={styles.button}>
            <FaPlusCircle className={styles.icons} />
            Add Item
          </button>
        </Link>
      </div>
      <div
        className={`topContents ${
          theme === "light" ? "light-theme" : "dark-theme"
        }`}
      >
        <div
          className={`records ${
            theme === "light" ? "light-pieChart" : "dark-pieChart"
          }`}
        >
          <h5>
            TODAY'S INCOME= &#8358;
            {todayTotalPrice}
          </h5>
        </div>
        <div
          className={`records ${
            theme === "light" ? "light-pieChart" : "dark-pieChart"
          }`}
        >
          <h5>
            TOTAL INCOME = &#8358;
            {overallTotalPrice}
          </h5>
        </div>
        <div
          className={`records ${
            theme === "light" ? "light-pieChart" : "dark-pieChart"
          }`}
        >
          <h5>EXPENSES = {expense}</h5>
          <h5>PROFIT =  {profit}</h5>
        </div>
      </div>

      <div className="asideContents">
        <div
          className={`Profits table-responsive ${
            theme === "light" ? "light-pieChart" : "dark-pieChart"
          }`}
        >
          <table
            className={`table table-sm ${
              theme === "light" ? "table-light" : "table-dark"
            }`}
          >
            <thead>
              <tr>
                <th>S/N</th>
                <th>Service Name</th>
                <th>Price</th>
                <th>Date</th> {/* New column for the date */}
              </tr>
            </thead>
            <tbody>
              {todayItems.map((entry, entryIndex) =>
                entry.items.map((item, itemIndex) => (
                  <tr key={`${entryIndex}-${itemIndex}`}>
                    <td>
                      {entryIndex + 1}.{itemIndex + 1}
                    </td>
                    <td>{item.name}</td>
                    <td>&#8358;{item.price}</td>
                    <td>{formatDate(entry.createdAt)}</td>
                  </tr>
                ))
              )}

              {/* Display the total price for today */}
              <tr>
                <td colSpan="2">
                  <strong>Today's Total</strong>
                </td>
                <td colSpan="2">
                  <strong>
                    &#8358;
                    {todayTotalPrice}
                  </strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="footer">
        <div
          className={`pieChart ${
            theme === "light" ? "light-pieChart" : "dark-pieChart"
          }`}
        >
          <Pie data={data} options={options} />
        </div>

        <div
          className={`toDo ${
            theme === "light" ? "light-pieChart" : "dark-pieChart"
          }`}
        >
          <header>
            <h4>To-Do List</h4>
          </header>
          <form className="form-container" onSubmit={Submit}>
            <input
              type="text"
              placeholder="Add your task"
              onChange={(e) => setTaskName(e.target.value)}
            />
            <button>Add</button>
          </form>
          {tasks.map((tasks, index) => (
            <div className="text-container">
              <h4>{tasks.taskName}</h4>
              <h4>{tasks.date.split("T")[0]}</h4>

              <h4 className="icon">
                <FaRegEdit className="x-icon" id="edit" />
              </h4>
              <h4 className="icon" onClick={() => handleDelete(tasks._id)}>
                <FaTimes className="x-icon" />
              </h4>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Charts;
