import React, { useState } from 'react';
import styles from './AddItem.module.css';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const AddExpense = ({ theme }) => {
  const [itemName, setItemName] = useState('');
  const [price, setPrice] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!itemName || !price) {
      setError('Please fill in all fields.');
      return;
    }

    // Clear previous messages
    setError('');
    setSuccess('');

    try {
      // Send POST request to the backend API
      const response = await fetch('http://localhost:4000/api/add-expense', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ itemName, price }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Expense added successfully!');
        setItemName('');
        setPrice('');
      } else {
        setError(data.error || 'Failed to add expense.');
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
    }
  };

  return (
    <div>
      <div className="button-class">
        <Link to="/expenses">
          <button>Show Expenses</button>
        </Link>
      </div>

      <form
        className={`${styles.form} ${theme === 'light' ? 'light-theme' : 'dark-theme'}`}
        onSubmit={handleSubmit}
      >
        {error && <p className={styles.error}>{error}</p>}
        {success && <p className={styles.success}>{success}</p>}

        <h3 className={`${styles.header} ${theme === 'light' ? 'light-theme' : 'dark-theme'}`}>
          Add Expense
        </h3>
        <input
          type="text"
          placeholder="Input Service Name"
          className={styles.input}
          id="itemName"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Input Price"
          className={styles.input}
          id="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <button
          type="submit"
          className={`${styles.btn} ${theme === 'light' ? 'light-theme' : 'dark-theme'}`}
        >
          Add
        </button>
      </form>
    </div>
  );
};

export default AddExpense;
