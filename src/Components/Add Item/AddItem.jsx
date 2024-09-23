
import React, { useState } from 'react';
import './AddItem.css'
import axios from 'axios';
import styles from './AddItem.module.css';
import swal from 'sweetalert';
import { useNavigate, useParams } from 'react-router-dom';
import Receipt from '../../PDF/Reciept';

const AddItem = ({ theme }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [customer, setCustomer] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  const Submit = (e) => {
    e.preventDefault();
    axios.post("http://localhost:4000/addItem", { name, price, customer, id })
      .then(result => {
        console.log(result);
        navigate('/');
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
    <form className={`${styles.form} ${theme === 'light' ? 'light-theme' : 'dark-theme'}`} onSubmit={Submit}>
      <h3 className={`${styles.header} ${theme === 'light' ? 'light-theme' : 'dark-theme'}`}>Add Record</h3>
      <input
        type="text"
        placeholder='Input Service Name'
        className={styles.input}
        id='Name'
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="number"
        placeholder='Input Price'
        className={styles.input}
        id='Price'
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <input
        type="text"
        placeholder='Input Customer Name'
        className={styles.input}
        id='Customer'
        value={customer}
        onChange={(e) => setCustomer(e.target.value)}
      />
   
      <button className={`${styles.btn} ${theme === 'light' ? 'light-theme' : 'dark-theme'}`}>Add</button>
    </form>
  );
};

export default AddItem;
