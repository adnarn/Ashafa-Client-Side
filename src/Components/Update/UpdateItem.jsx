import React, {useState, useEffect} from 'react'
import styles from './UpdateItem.module.css'
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const UpdateItem = ({theme}) => {
    const [name, setName] = useState('')
    const [price, setPrice] = useState('')
    const {id} = useParams()
    const navigate = useNavigate()
    

    useEffect(() => {
        axios.get('https://records-saver.onrender.com/getItem/'+id)
          .then(result => {
            {console.log(result)}
            setName(result.data.name)
            setPrice(result.data.price)
            })
          .catch(err => console.log(err));
      }, []);

      const Update = (e)=>{
        e.preventDefault();
        axios.put('https://records-saver.onrender.com/updateItem/'+id, {name, price})
        .then(result =>{
           console.log(result)
           navigate('/')
          })
        .catch(err => console.log(err))  
    }


    return (
      <form className={`${styles.form} ${theme === 'light' ? 'light-theme' : 'dark-theme'}`} onSubmit={Update}>
        <h3 className={`  ${styles.header} ${theme === 'light' ? 'light-theme' : 'dark-theme'}`}>Add Item</h3>
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
              <button  className ={styles.btn}>Update</button>
          </form>
    )
}

export default UpdateItem
