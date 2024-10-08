import React, { useState, useEffect } from 'react';
import styles from './UpdateItem.module.css';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';


const UpdateItem = ({ theme }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState(1);  // Default quantity as 1
  const [originalPrice, setOriginalPrice] = useState(''); // Track original price
  const [customer, setCustomer] = useState('');
  const [comment, setComment] = useState('Good');
  const [selectableItems, setSelectableItems] = useState([]); // State to store selectable items
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`https://ashafa-server.onrender.com/api/items/${id}`)
      .then(result => {
        console.log(result)
        setName(result.data.name)
        setPrice(result.data.price)
        setCustomer(result.data.customer)
        })
      .catch(err => console.log(err));
  }, [id]);

  useEffect(() => {
    axios.get("https://ashafa-server.onrender.com/selectable-items")
      .then((response) => {
        setSelectableItems(response.data);
      })
      .catch((error) => {
        console.error("Error fetching selectable items:", error);
      });
  }, []);

  // Handle item selection from the dropdown
  const handleItemChange = (e) => {
    const selectedItem = selectableItems.find(item => item.itemName === e.target.value);
    setName(selectedItem?.itemName || '');
    setOriginalPrice(selectedItem?.price || '');  // Store the original price
    setPrice(selectedItem?.price || '');  // Set the initial price
  };

  // Handle quantity change and recalculate the total price
  const handleQuantityChange = (e) => {
    const newQuantity = e.target.value;
    setQuantity(newQuantity);

    if (originalPrice) {
      // Multiply the original price by the quantity
      const calculatedPrice = originalPrice * newQuantity;
      setPrice(calculatedPrice);
    }
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    axios.put(`https://ashafa-server.onrender.com/updateItem/${id}`, { name, price, customer, id })
      .then(result => {
        console.log(result);
        navigate('/clipBoard');
        swal({
          title: "Success!",
          text: "Record Updated!",
          icon: "success",
        });
      })
      .catch(err => {
        console.log(err);
        swal("Error", "Failed to update record. Please try again.", "error");
      });
  };

  return (
    <form className={`${styles.form} ${theme === 'light' ? 'light-theme' : 'dark-theme'}`} onSubmit={handleUpdate}>
    <h3 className={`  ${styles.header} ${theme === 'light' ? 'light-theme' : 'dark-theme'}`}>Update Record</h3>
    <select 
        className={styles.input} 
        value={name} 
        onChange={handleItemChange}
      >
        <option value="" disabled>Select Item</option>
        {selectableItems.map((item) => (
          <option key={item._id} value={item.itemName}>{item.itemName}</option>
        ))}
      </select>

           {/* Input for quantity, and on change, the price will be updated */}
      <input
        type="number"
        placeholder='Input Quantity'
        className={styles.input}
        id='Quantity'
        value={quantity} 
        onChange={handleQuantityChange}  // This will recalculate the price
      />

      {/* Automatically filled price field based on selected item and quantity */}
      <input
        type="number"
        placeholder='Price'
        className={styles.input}
        id='Price'
        value={price}
        readOnly // Make it read-only since it should update automatically
      />

      <input
        type="text"
        placeholder='Input Customer Name'
        className={styles.input}
        id='Customer'
        value={customer}
        onChange={(e) => setCustomer(e.target.value)}
      />

      <input
        type="text"
        placeholder='Input Comment'
        className={styles.input}
        id='comment'
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
          <button  className ={styles.btn}>Update</button>
      </form>
  );
};


export default UpdateItem;

