import React, {useState} from 'react'
import axios from 'axios';
import styles from './AddItem.module.css'
import swal from "sweetalert"
import { useNavigate } from 'react-router-dom';

const AddItem = ({theme}) => {
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
   
  const navigate = useNavigate()
  

  const Submit = (e)=>{
    e.preventDefault();
    axios.post('https://records-saver.onrender.com/addItem', {name, price})
    .then(result =>{
       console.log(result)
       navigate('/')
       swal({
        title: "Success!",
        text: "Item Aded!",
        icon: "success",
      });
      })
    .catch(err => console.log(err))  
}

  return (
        <form className={`${styles.form} ${theme === 'light' ? 'light-theme' : 'dark-theme'}`} onSubmit={Submit}>
        <h3 className={`  ${styles.header} ${theme === 'light' ? 'light-theme' : 'dark-theme'}`}>Add Item</h3>
            <input type="text"
                placeholder='Input Service Name' 
                //  className={` ${styles.input} ${theme === 'light' ? 'light-theme' : 'dark-theme'}`}
                className={styles.input}
                 id='Name'  
                  onChange={(e)=>setName(e.target.value)} />

            <input
             type="number"
             placeholder='Input Price'
              // className={`  ${styles.input} ${theme === 'light' ? 'light-theme' : 'dark-theme'}`}
              className={styles.input}
              id='Price'  
              onChange={(e)=>setPrice(e.target.value)}              
              />
            <button  className ={` ${styles.btn} ${theme === 'light' ? 'light-theme' : 'dark-theme'}`}>Add</button>
            
        </form>
  )
}

export default AddItem
