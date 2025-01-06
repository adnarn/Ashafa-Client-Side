import React, { useState, useEffect } from "react";
import "./AddItem.css";
import axios from "axios";
import swal from "sweetalert";
import { Link, useNavigate } from "react-router-dom";
import styles from "./AddItem.module.css";
import { FaPlusCircle, FaTrash } from "react-icons/fa";


const AddItem = ({ theme }) => {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(1); // Default quantity as 1
  const [price, setPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState(""); // Track original price
  const [customer, setCustomer] = useState("");
  const [comment, setComment] = useState("No Comment");
  const [payment, setPayment] = useState("Cash");
  const [addedItems, setAddedItems] = useState([]); // State to store items
  const [selectableItems, setSelectableItems] = useState([]); // Items for dropdown
  const navigate = useNavigate();

  // Fetch selectable items from the backend
  useEffect(() => {
    axios
      .get("https://cafe-working-server.vercel.app/selectable-items")
      .then((response) => setSelectableItems(response.data))
      .catch((error) =>
        console.error("Error fetching selectable items:", error)
      );
  }, []);

  // Handle item selection
  const handleItemChange = (e) => {
    const selectedItem = selectableItems.find(
      (item) => item.itemName === e.target.value
    );
    setName(selectedItem?.itemName || "");
    setOriginalPrice(selectedItem?.price || "");
    setPrice(selectedItem?.price || "");
  };

  // Update price based on quantity
  const handleQuantityChange = (e) => {
    const newQuantity = e.target.value;
    setQuantity(newQuantity);
    if (originalPrice) setPrice(originalPrice * newQuantity);
  };

  // Add item to the table
  const handleAddItem = () => {
    if (!name || !quantity || !price) {
      swal("Error", "Please fill all the item fields before adding!", "error");
      return;
    }
    const newItem = { name, quantity, price };
    setAddedItems([...addedItems, newItem]);
    setName("");
    setQuantity(1);
    setPrice("");
    setOriginalPrice("");
  };


  // Delete item from the table
  const handleDeleteItem = (index) => {
    const updatedItems = addedItems.filter((_, i) => i !== index);
    setAddedItems(updatedItems);
    swal("Deleted", "Item has been removed from the table.", "success");
  };

  // Calculate total price
  const totalPrice = addedItems.reduce(
    (acc, item) => acc + (item.price || 0),
    0
  );


  // Submit all items to the database
  const handleSubmitItems = async () => {
    if (!addedItems.length) {
      swal("Error", "No items to submit. Please add items first.", "error");
      return;
    }
    if (!customer) {
      swal("Error", "Customer name is required!", "error");
      return;
    }
    try {
      const response = await axios.post("https://cafe-working-server.vercel.app/addItem", {
        items: addedItems,
        customer,
        comment,
        payment,
      });
      swal("Success", "Items saved successfully!", "success");
      setAddedItems([]);
      setCustomer("");
      setComment("No Comment");
      navigate(`/receipt/${response.data._id}`);
    } catch (error) {
      console.error("Error saving items:", error);
      swal("Error", "Failed to save items. Please try again.", "error");
    }
  };

  return (
    <div className={styles.container}>
      <div className="button">
        <Link to="/add-selected-item">
          <button className={styles.button}>
            <FaPlusCircle className={styles.icons} />
                 Edit Item
          </button>
        </Link>
      </div>
      <form
        className={`style.form  ${theme === "light" ? "light-theme" : "dark-theme"}`}
        onSubmit={(e) => e.preventDefault()}
      >
        <h3 className={styles.header}>Add Item</h3>

        {/* Selectable Item Dropdown */}
        <select
          value={name}
          onChange={handleItemChange}
          className={styles.input}
        >
          <option value="" disabled>
            Select Item
          </option>
          {selectableItems.map((item) => (
            <option key={item._id} value={item.itemName}>
              {item.itemName}
            </option>
          ))}
        </select>

        <input
          type="number"
          value={quantity}
          onChange={handleQuantityChange}
          placeholder="Quantity"
          className={styles.input}
        />

        <input
          type="text"
          value={price}
          readOnly
          placeholder="Price"
          className={styles.input}
        />

        <input
          type="text"
          value={customer}
          onChange={(e) => setCustomer(e.target.value)}
          placeholder="Customer Name"
          className={styles.input}
        />


      <select
          value={payment}
          onChange={(e) => setPayment(e.target.value)}
          className={styles.input}
        >
          <option value="" disabled>
                Payment Method
          </option>
            <option>
                  Cash
            </option>
            <option>
                  Transfer
            </option>
            <option>
                  POS
            </option>

        </select>


        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Comment"
          className={styles.input}
        />

        <button type="button" className={styles.btn} onClick={handleAddItem}>
          Add to Table
        </button>

     
      </form>

      {/* Table to display added items */}
      { addedItems.length>0 ?(
      <div className={styles.tableContainer}>
        <h3 className={styles.tableHeader}>Added Items</h3>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {addedItems.map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td>{item.price}</td>
                <td>
                <FaTrash
                      className={styles.icon}
                      onClick={() => handleDeleteItem(index)}
                      title="Delete Item"
                      style={{ cursor: "pointer", color: "red" }}
                    />
                </td>
              </tr>
            ))}
          </tbody>
          </table>
          <div className={styles.totalPrice}>
            <strong>Total Price: &#8358;{totalPrice}</strong>
          </div>
          <button
          type="button"
          className={styles.btn}
          onClick={handleSubmitItems}
        >
          Add Record
        </button>
      </div>
    ):
   null
  }
    </div>
  );
};

export default AddItem;
