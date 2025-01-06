import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./MainContent.module.css";
import { Link } from "react-router-dom";
import { FaPlusCircle, FaReceipt, FaTrash } from "react-icons/fa";
import SearchBar from "../SearchBar/SearchBar";
import swal from "sweetalert";
import LoadingComponent from "../loadingComponent";

const MainContent = ({ theme }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const role = localStorage.getItem("role");

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async (query = "") => {
    setLoading(true);
    const url = query
      ? `http://localhost:4000/search?q=${query}`
      : "http://localhost:4000/";

    try {
      const response = await axios.get(url);
      const data = Array.isArray(response.data) ? response.data : [];
      setItems(data);
    } catch (error) {
      console.error("Error fetching items:", error);
      swal("Error", "Failed to fetch items. Please try again later.", "error");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const isToday = (dateString) => {
    const today = new Date().toLocaleDateString();
    return formatDate(dateString) === today;
  };

  const groupByDay = (items) => {
    return items.reduce((groups, entry) => {
      const date = formatDate(entry.date);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(entry);
      return groups;
    }, {});
  };

  const computeTotal = (dayItems) => {
    return dayItems.reduce(
      (total, entry) =>
        total +
        entry.items.reduce(
          (subTotal, item) => subTotal + item.price,
          0
        ),
      0
    );
  };

  // Filter items based on role
  const filteredItems = role === "admin" ? items : items.filter((item) => isToday(item.date));

  const groupedItems = groupByDay(filteredItems);

  if (loading) {
    return <LoadingComponent message="Fetching data, please wait..." />;
  }

  return (
    <div
      className={`${styles.mainContent} ${
        theme === "light" ? "light-theme" : "dark-theme"
      }`}
    >
      <main>
        <div className={styles.header}>
          <h2 className={styles.headers}>Dashboard</h2>
          <SearchBar onSearch={fetchItems} />
          <Link to="/add">
            <button className={styles.button}>
              <FaPlusCircle className={styles.icons} /> Add Item
            </button>
          </Link>
        </div>

        <div className="table-responsive">
          <table
            className={`table table-sm ${
              theme === "light" ? "table-light" : "table-dark"
            }`}
          >
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Comment</th>
                <th>Payment</th>
                <th>Service Name</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Time</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(groupedItems).map((date, dateIndex) => (
                <React.Fragment key={dateIndex}>
                  {/* Display Date as a Header */}
                  <tr>
                    <td colSpan="11" style={{ fontWeight: "bold" }}>
                      {date}
                    </td>
                  </tr>

                  {/* Display Entries for Each Date */}
                  {groupedItems[date].map((entry, entryIndex) =>
                    entry.items.map((item, itemIndex) => (
                      <tr key={`${entry._id}-${itemIndex}`}>
                        <td>{entry.referenceId}</td>
                        <td>{entry.customer}</td>
                        <td>{entry.comment}</td>
                        <td>{entry.payment}</td>
                        <td>{item.name}</td>
                        <td>&#8358;{item.price}</td>
                        <td>{item.quantity}</td>
                        <td>
                          {new Date(entry.date).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                            hour12: true,
                          })}
                        </td>
                        <td>{formatDate(entry.date)}</td>
                        <td>
                          <div className={styles.actions}>
                            <Link to={`/receipt/${entry._id}`}>
                              <FaReceipt className={styles.edit} />
                            </Link>
                            {role === "admin" && (
                              <FaTrash
                                className={styles.icon}
                                onClick={() => handleDelete(entry._id)}
                              />
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}

                  {/* Daily Total for Each Group */}
                  <tr>
                    <td colSpan="6">
                      <strong>Daily Total</strong>
                    </td>
                    <td colSpan="5">
                      <strong>&#8358;{computeTotal(groupedItems[date])}</strong>
                    </td>
                  </tr>
                </React.Fragment>
              ))}

              {/* Overall Total for Admin */}
              {role === "admin" && (
                <tr>
                  <td colSpan="6">
                    <strong>Overall Total</strong>
                  </td>
                  <td colSpan="5">
                    <strong>
                      &#8358;
                      {items.reduce(
                        (overallTotal, entry) =>
                          overallTotal +
                          entry.items.reduce(
                            (subTotal, item) =>
                              subTotal + item.price,
                            0
                          ),
                        0
                      )}
                    </strong>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default MainContent;
