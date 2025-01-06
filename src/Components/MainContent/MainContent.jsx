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
  const [query, setQuery] = useState(""); // Search query
  const role = localStorage.getItem("role");

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchItems(query); // Fetch items dynamically based on query
    }, 300); // Debounce time for smoother typing experience

    return () => clearTimeout(delayDebounceFn); // Cleanup timeout
  }, [query]);

  const fetchItems = async (searchQuery = "") => {
    setLoading(true);
    const url = searchQuery
      ? `https://cafe-working-server.vercel.app/search?q=${searchQuery}`
      : "https://cafe-working-server.vercel.app/";

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
        entry.items.reduce((subTotal, item) => subTotal + item.price, 0),
      0
    );
  };

  const handleDelete = async (id) => {
    try {
      const confirmation = await swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this entry!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      });
      if (confirmation) {
        await axios.delete(`https://cafe-working-server.vercel.app/deleteItem/${id}`);
        swal("Success", "Entry deleted successfully", "success");
        fetchItems(query); // Refresh the items
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      swal("Error", "Failed to delete item. Please try again.", "error");
    }
  };

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
          <SearchBar onSearch={(value) => setQuery(value)} />
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
                  <tr>
                    <td colSpan="11" style={{ fontWeight: "bold" }}>
                      {date}
                    </td>
                  </tr>
                  {groupedItems[date].map((entry) =>
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
                          entry.items.reduce((subTotal, item) => subTotal + item.price, 0),
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
