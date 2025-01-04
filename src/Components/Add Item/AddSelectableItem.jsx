import axios from 'axios';
import React, { useState } from 'react';
import styles from './AddItem.module.css';
import { Link, useNavigate, useParams } from 'react-router-dom';
import swal from 'sweetalert';
import './AddItem.css'


const AddSelectableItem = ({theme}) => {
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const  [error, setError] = useState('')


  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("https://cafe-working-server.vercel.app/selectable-items", { itemName, price })
      .then(result => {
        console.log(result);
      setItemName('');   
      setPrice('');   
      })
      .catch(err => {
        console.log(err);
        setError('An error occured, Please try again later.')
      });
  };
  

  return (
    <div className="">

            <div className="button-class"> 
                      <Link to='/show-items'>
                      <button className=''> 
                        Show Items
                        </button>
                    </Link>
                    </div>
   
      <form className={`${styles.form} ${theme === 'light' ? 'light-theme' : 'dark-theme'}`} onSubmit={handleSubmit}>
          <p>{error}</p>
          <h3 className={`${styles.header} ${theme === 'light' ? 'light-theme' : 'dark-theme'}`}>Add Item</h3>
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
                                    Add
                                </button>
      </form>                
    </div>
  );
};

export default AddSelectableItem;
