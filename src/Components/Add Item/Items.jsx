import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaRegEdit, FaTrash } from 'react-icons/fa';
import swal from 'sweetalert';
import styles from '../MainContent/MainContent.module.css'
import {Link} from 'react-router-dom'

const Items = ({theme}) => {
  const [items, setItems] = useState([]);

  // Fetch items from the backend when the component mounts
  useEffect(() => {
    axios.get("https://cafe-working-server.vercel.app/selectable-items")
      .then(response => {
        setItems(response.data);
      })
      .catch(error => {
        console.error("Error fetching items:", error);
      });
  }, []);

  const handleDelete = (index, id) => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this item!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {

        axios.delete(`https://cafe-working-server.vercel.app/delete-selectable-items/${id}`)

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


  return (
    <div className="ItemContainer mt-4">
      <h2>Item List</h2>
      {/* <table className="table table-bordered"> */}
      <table className={`table table-sm ${theme === 'light' ? 'table-light' : 'table-dark'}`}>

        <thead>
          <tr>
            <th>Item Name</th>
            <th>Price</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={item._id}>
              <td>{item.itemName}</td>
              <td>&#8358;{item.price}</td>
          <td>
                        <div className={styles.actions}>
{/*                           <Link to={`/update-items/${item._id}`}><FaRegEdit className={styles.edit} /></Link> */}
                          <FaTrash  className = {styles.icon}  onClick={() => handleDelete(index, item._id)} />
                        </div>
                      </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Items;
