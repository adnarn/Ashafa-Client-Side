import React, { useState, useEffect } from 'react';
import styles from './UpdateItem.module.css';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';


const UpdateItem = ({ theme }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [customer, setCustomer] = useState('');
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
          <input type="text"
              placeholder='Input Service Name' 
               className={styles.input}
               id='Name'  
               value={name}
                onChange={(e)=>setName(e.target.value)} />

          <input
           type="number"
           placeholder='Input Price'
            className={styles.input}
            id='Price'  
            value={price}
            onChange={(e)=>setPrice(e.target.value)}              
            />

          <input
                  type="text"
                  placeholder='Input Customer Name'
                  className={styles.input}
                  id='Customer'
                  value={customer}
                  onChange={(e) => setCustomer(e.target.value)}
                />
          <button  className ={styles.btn}>Update</button>
      </form>
  );
};


export default UpdateItem;

