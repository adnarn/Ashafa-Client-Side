import React, { useEffect, useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import styles from '../MainContent/MainContent.module.css';

const ExpensesPage = ({ theme }) => {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const [total, setTotal] = useState(0); // Total sum of expenses
  const role = localStorage.getItem("role");


  // Fetch expenses from the backend
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await fetch('https://cafe-working-server.vercel.app/api/get-expense'); // Adjust the URL if needed
        const data = await response.json();

        if (response.ok) {
          setItems(data);
          // Calculate the total sum of expenses
          const totalSum = data.reduce((sum, item) => sum + item.price, 0);
          setTotal(totalSum);
        } else {
          setError('Failed to fetch expenses');
        }
      } catch (err) {
        setError('An error occurred while fetching expenses');
      }
    };

    fetchExpenses();
  }, []);

  // Handle delete action (admin only)
  const handleDelete = async (index, id) => {
    if (role=='admin' && window.confirm('Are you sure you want to delete this expense?')) {
      try {
        const response = await fetch(`https://cafe-working-server.vercel.app/api/delete-expense/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          // Remove the deleted item from the state
          const updatedItems = [...items];
          updatedItems.splice(index, 1);
          setItems(updatedItems);

          // Update the total
          const deletedItem = items[index];
          setTotal((prevTotal) => prevTotal - deletedItem.price);
        } else {
          setError('Failed to delete expense');
        }
      } catch (err) {
        setError('An error occurred while deleting the expense');
      }
    }
  };

  // Format numbers with commas
  const formatNumber = (number) => {
    return number.toLocaleString();
  };

  return (
    <div>
      <div className="ItemContainer mt-4">
        <h2>Expense List</h2>
        {error && <p className="text-danger">{error}</p>}
        <table className={`table table-sm ${theme === 'light' ? 'table-light' : 'table-dark'}`}>
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Price</th>
              {role=='admin' && <th>Action</th>}
            </tr>
          </thead>
          <tbody>
            {items.length > 0 ? (
              items.map((item, index) => (
                <tr key={item._id}>
                  <td>{item.itemName}</td>
                  <td>&#8358;{formatNumber(item.price)}</td>
                  {role=='admin' && (
                    <td>
                      <div className={styles.actions}>
                        <FaTrash
                          className={styles.icon}
                          onClick={() => handleDelete(index, item._id)}
                        />
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={role=='admin' ? 3 : 2} className="text-center">
                  No expenses found
                </td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr>
              <td><b>Total</b></td>
              <td><b>&#8358;{formatNumber(total)}</b></td>
              {role=='admin' && <td></td>}
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default ExpensesPage;
