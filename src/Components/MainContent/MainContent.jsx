import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './MainContent.module.css';
import { Link } from 'react-router-dom';
import { FaPlusCircle, FaRegEdit, FaTrash } from 'react-icons/fa';
import SearchBar from '../SearchBar/SearchBar';
import swal from 'sweetalert';

const MainContent = ({ theme }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchItems(); // Initial fetch of all items
  }, []);

  const fetchItems = (query = '') => {
    axios.get(`https://records-saver.onrender.com/search?q=${query}`)
      .then(result => {
        setItems(result.data);
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
        axios.delete(`https://records-saver.onrender.com/deleteItem/${id}`)
          .then(res => {
            const updatedItems = items.filter((_, i) => i !== index);
            setItems(updatedItems);
            swal(" Your item has been deleted!", {
              // icon: "success",
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

  return (
    <div className={`${styles.mainContent} ${theme === 'light' ? 'light-theme' : 'dark-theme'}`}>
      <main>
        <div className={styles.header}>
          <h2 className={styles.headers}> Dashboard</h2>
          
          <SearchBar onSearch={handleSearch} /> {/* Add the SearchBar component */}

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
              {items.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.name}</td>
                  <td>&#8358;{item.price}</td>
                  <td>{new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}</td>
                  <td>{new Date(item.date).toLocaleDateString()}</td>
                  
                  <div className={styles.actions}>
                    <td className="del del-primary">
                      <Link to={`/update/${item._id}`}>
                        <FaRegEdit className={styles.edit} />
                      </Link>
                    </td>
                    <td className="del del-danger">
                      <FaTrash
                        className={styles.icon}
                        onClick={() => handleDelete(index, item._id)}
                      />
                    </td>
                 </div>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default MainContent;
