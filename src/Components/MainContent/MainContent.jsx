import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./MainContent.module.css";
import { Link } from "react-router-dom";
import { FaPlusCircle, FaReceipt, FaTrash } from "react-icons/fa";
import SearchBar from "../SearchBar/SearchBar";
import swal from "sweetalert";

const MainContent = ({ theme }) => {
  const [items, setItems] = useState([]);
  const role = localStorage.getItem("role");

  useEffect(() => {
    fetchItems(); // Initial fetch of all items
  }, []);

  const fetchItems = (query = "") => {
    const url = query
      ? `https://cafe-working-server.vercel.app/search?q=${query}`
      : "https://cafe-working-server.vercel.app/";
    axios
      .get(url)
      .then((result) => {
        const data = Array.isArray(result.data) ? result.data : []; // Ensure it's an array
        setItems(data);
      })
      .catch((err) => console.log(err));
  };

  const handleSearch = (searchQuery) => {
    fetchItems(searchQuery);
  };

  const handleDelete = (index, id) => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this item!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        axios
          .delete(`https://cafe-working-server.vercel.app/deleteItem/${id}`)
          .then(() => {
            const updatedItems = items.filter((_, i) => i !== index);
            setItems(updatedItems);
            swal("Your item has been deleted!", {
              icon: "success",
            });
          })
          .catch((err) => {
            console.log(err);
            swal("Error! Something went wrong while deleting.", {
              icon: "error",
            });
          });
      } else {
        swal("Your item is safe!");
      }
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
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
          (subTotal, item) => subTotal + item.price * item.quantity,
          0
        ),
      0
    );
  };

  const groupedItems = groupByDay(items);

  return (
    <div
      className={`${styles.mainContent} ${
        theme === "light" ? "light-theme" : "dark-theme"
      }`}
    >
      <main>
        <div className={styles.header}>
          <h2 className={styles.headers}> Dashboard</h2>
          <SearchBar onSearch={handleSearch} />
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
                <th>Quantity</th>
                <th>Total</th>
                <th>Time</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(groupedItems).map((date, dateIndex) => (
                <React.Fragment key={dateIndex}>
                  <tr>
                    <td colSpan="8" style={{ fontWeight: "bold" }}>
                      {date}
                    </td>
                  </tr>
                  {groupedItems[date].map((entry, entryIndex) =>
                    entry.items.map((item, itemIndex) => (
                      <tr key={`${entryIndex}-${itemIndex}`}>
                        <td>
                          {entryIndex + 1}.{itemIndex + 1}
                        </td>
                        <td>{item.name}</td>
                        <td>&#8358;{item.price}</td>
                        <td>{item.quantity}</td>
                        <td>&#8358;{item.price * item.quantity}</td>
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
                            <FaTrash
                              className={styles.icon}
                              onClick={() =>
                                handleDelete(entryIndex, entry._id)
                              }
                            />
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                  <tr>
                    <td colSpan="4">
                      <strong>Daily Total</strong>
                    </td>
                    <td colSpan="4">
                      <strong>&#8358;{computeTotal(groupedItems[date])}</strong>
                    </td>
                  </tr>
                </React.Fragment>
              ))}
              {role === "admin" && (
                <tr>
                  <td colSpan="4">
                    <strong>Overall Total</strong>
                  </td>
                  <td colSpan="4">
                    <strong>
                      &#8358;
                      {items.reduce(
                        (overallTotal, entry) =>
                          overallTotal +
                          entry.items.reduce(
                            (subTotal, item) =>
                              subTotal + item.price * item.quantity,
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
