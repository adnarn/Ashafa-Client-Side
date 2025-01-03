import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./HomeDash.module.css";
import { Link } from "react-router-dom";
import SearchBar from "../Components/SearchBar/SearchBar";
import { FaPlusCircle } from "react-icons/fa";
import LoadingComponent from "../Components/loadingComponent";

const HomeDash = ({ theme }) => {
  const role = localStorage.getItem("role");
  const [loading, setLoading] = useState(true); // Add loading state


  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchItems(); // Initial fetch of all items
  }, []);

  const fetchItems = (query = "") => {
    setLoading(true); // Show loading spinner

    const url = query
      ? `https://cafe-working-server.vercel.app/search?q=${query}`
      : "https://cafe-working-server.vercel.app/";
    console.log("Fetching items from URL:", url);
    axios
      .get(url)
      .then((result) => {
        console.log("Items fetched successfully:", result.data);
        setItems(result.data);
      })
      .catch((err) => {
        console.error("Error fetching items:", err);
        // Optionally, set an error state to display a message to the user
      })
      .finally(() => setLoading(false)); // Hide spinner after fetch
  };

  if (loading) {
    return <LoadingComponent message="Fetching data, please wait..." />;
  }

  const handleSearch = (searchQuery) => {
    console.log("Searching items with query:", searchQuery);
    fetchItems(searchQuery);
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Group items by day
  const groupByDay = (items) => {
    return items.reduce((groups, item) => {
      const date = formatDate(item.date);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(item);
      return groups;
    }, {});
  };

  const groupedItems = groupByDay(items);

  const computeTotal = (dayItems) => {
    return dayItems.reduce(
      (total, entry) =>
        total +
        entry.items.reduce(
          (subTotal, item) => subTotal + item.price * item.quantity,
          0
        ),
      0
    );
  };

  return (
    <div
      className={`${styles.mainContent} ${
        theme === "light" ? "light-theme" : "dark-theme"
      }`}
    >
      <main className={theme === "light" ? "light-theme" : "dark-theme"}>
        <div className={styles.header}>
          <h2 className={styles.headers}> Dashboard</h2>
          <SearchBar onSearch={handleSearch} />{" "}
          {/* Add the SearchBar component */}
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
                <th>S/N</th>
                <th>Service Name</th>
                <th>Price</th>
                <th>Time</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(groupedItems).map((date, dateIndex) => (
                <React.Fragment key={dateIndex}>
                  {/* Display the date */}
                  <tr>
                    <td
                      colSpan="5"
                      style={{ fontWeight: "bold", padding: "10px 0" }}
                    >
                      {date}
                    </td>
                  </tr>

                  {/* Display items for that date */}
                  {groupedItems[date].map((entry, entryIndex) =>
                    entry.items.map((item, itemIndex) => (
                      <tr key={item._id}>
                        <td>
                          {entryIndex + 1}.{itemIndex + 1}
                        </td>
                        <td>{item.name}</td>
                        <td>&#8358;{item.price}</td>
                        <td>
                          {new Date(entry.date).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                            hour12: true,
                          })}
                        </td>
                        <td>{formatDate(entry.date)}</td>
                      </tr>
                    ))
                  )}

                  {/* Display the total price for the day */}
                  <tr>
                    <td colSpan="2">
                      <strong>Daily Total</strong>
                    </td>
                    <td colSpan="3">
                    <strong>&#8358;{computeTotal(groupedItems[date])}</strong>

                    </td>
                  </tr>
                </React.Fragment>
              ))}

              {role === "admin" && (
                <tr>
                  <td colSpan="2">
                    <strong>Overall Total</strong>
                  </td>
                  <td colSpan="3">
                    <strong>
                    {items.reduce(
                        (overallTotal, entry) =>
                          overallTotal +
                          entry.items.reduce(
                            (subTotal, item) =>
                              subTotal + item.price * item.quantity,
                            0
                          ),
                        0
                      )}                    </strong>
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

export default HomeDash;
