import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './MainContent.module.css';
import { Link } from 'react-router-dom';
import { FaPlusCircle, FaReceipt, FaRegEdit, FaTrash } from 'react-icons/fa';
import SearchBar from '../SearchBar/SearchBar';
import swal from 'sweetalert';

const MainContent = ({ theme }) => {
  const [items, setItems] = useState([]);
  const role = localStorage.getItem('role');

  useEffect(() => {
    fetchItems(); // Initial fetch of all items
  }, []);

  const fetchItems = (query = '') => {

    const url = query ? `https://ashafa-server.onrender.com/api/search?q=${query}` : 'https://ashafa-server.onrender.com/api/items';
    axios.get(url)

      .then(result => {
        const data = Array.isArray(result.data) ? result.data : []; // Ensure it's an array
        setItems(data);
      })
      .catch(err => console.log(err));
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

        axios.delete(`https://ashafa-server.onrender.com/api/items/${id}`)

          .then(res => {
            const updatedItems = items.filter((_, i) => i !== index);
            setItems(updatedItems);
            swal("Your item has been deleted!", {
              icon: "success",
            });
          })
          .catch(err => {
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

   if (role !== 'admin') return null; // Return nothing if not admin

  return (
    <div className={`${styles.mainContent} ${theme === 'light' ? 'light-theme' : 'dark-theme'}`}>
      <main>
        <div className={styles.header}>
          <h2 className={styles.headers}> Dashboard</h2>
          <SearchBar onSearch={handleSearch} />
          <Link to='/add'>
            <button className={styles.button}><FaPlusCircle className={styles.icons} /> Add Item</button>
          </Link>
        </div>

        <div className="table-responsive">
          <table className={`table table-sm ${theme === 'light' ? 'table-light' : 'table-dark'}`}>
            <thead>
              <tr>
                <th>S/N</th>
                <th>Service Name</th>
                <th>Price</th>
                <th>Time</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(groupedItems).map((date, dateIndex) => (
                <React.Fragment key={dateIndex}>
                  {/* Display the date */}
                  <tr>
                    <td colSpan="6" style={{ fontWeight: 'bold', padding: '10px 0' }}>
                      {date}
                    </td>
                  </tr>

                  {/* Display items for that date */}
                  {groupedItems[date].map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.name}</td>
                      <td>&#8358;{item.price}</td>
                      <td>{new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}</td>
                      <td>{formatDate(item.date)}</td>
                      <td>
                        <div className={styles.actions}>
                          <Link to={`/update/${item._id}`}><FaRegEdit className={styles.edit} /></Link>
                          <Link to={`/receipt/${item._id}`}><FaReceipt className={styles.edit} /></Link>
                          <FaTrash  className = {styles.icon}  onClick={() => handleDelete(index, item._id)} />
                        </div>
                      </td>
                    </tr>
                  ))}

                  {/* Display the total price for the day */}
                  <tr>
                    <td colSpan="2"><strong>Daily Total</strong></td>
                    <td colSpan="4">
                      <strong>&#8358;{groupedItems[date].reduce((acc, item) => acc + item.price, 0)}</strong>
                    </td>
                  </tr>
                </React.Fragment>
              ))}

              { role === 'admin' &&
             ( <tr>
                <td colSpan="2"><strong>Overall Total</strong></td>
                <td colSpan="4">
                  <strong>&#8358;{items.reduce((acc, item) => acc + item.price, 0)}</strong>
                </td>
              </tr>)
              }
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default MainContent;
