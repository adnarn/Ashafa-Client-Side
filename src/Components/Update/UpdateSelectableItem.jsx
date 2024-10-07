import axios from 'axios';
import React, { useState, useEffect } from 'react';
import styles from './UpdateItem.module.css';
import { Link, useNavigate, useParams } from 'react-router-dom';
import swal from 'sweetalert';

const UpdateSelectableItem = ({ theme }) => {
  const [itemName, setItemName] = useState('');
  const [price, setPrice] = useState('');
  const [error, setError] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();  // Use navigate here

  useEffect(() => {
    // Fetch the item details by ID
    axios.get(`https://ashafa-server.onrender.com/selectable-items/${id}`)
      .then(result => {
        console.log(result);
        setItemName(result.data.itemName); // Adjust casing based on actual field
        setPrice(result.data.price);
      })
      .catch(err => {
        console.log(err);
        setError('Failed to fetch item details');
      });
  }, [id]);

  const handleUpdate = (e) => {
    e.preventDefault();
    
    if (!itemName || !price) {
      setError('Both fields are required');
      return;
    }

    axios.put(`https://ashafa-server.onrender.com/update-selectable-item/${id}`, { itemName, price, id })
      .then(result => {
        console.log(result);
        navigate('/show-items');  // Use navigate to redirect
        swal({
          title: "Success!",
          text: "Item Updated!",
          icon: "success",
        });
      })
      .catch(err => {
        console.log(err);
        swal("Error", "Failed to update record. Please try again.", "error");
      });
  };

  return (
    <div className="">
      <form className={`${styles.form} ${theme === 'light' ? 'light-theme' : 'dark-theme'}`} onSubmit={handleUpdate}>
        {error && <p className={styles.error}>{error}</p>}  {/* Show error if exists */}
        <h3 className={`${styles.header} ${theme === 'light' ? 'light-theme' : 'dark-theme'}`}>Update Item</h3>
        <input
          type="text"
          placeholder='Input Service Name'
          className={styles.input}
          id='Name'
          value={itemName} 
          onChange={(e) => setItemName(e.target.value)}
        />
        <input
          type="number"
          placeholder='Input Price'
          className={styles.input}
          id='Price'
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <button className={`${styles.btn} ${theme === 'light' ? 'light-theme' : 'dark-theme'}`}>
          Update
        </button>
      </form>                
    </div>
  );
};

export default UpdateSelectableItem;
