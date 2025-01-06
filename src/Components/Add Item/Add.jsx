import React from "react";
import { Link } from "react-router-dom";
import { FaPlusCircle, FaDollarSign } from "react-icons/fa";

const Add = ({ theme }) => {
  const themeClass = theme === "light" ? "bg-light text-dark" : "bg-dark text-light";

  return (
    <div className={`Add-dashboard container my-4 ${themeClass}`}>
      <div className="row g-4">
        {/* Add Record Card */}
        <div className="col-md-6">
          <Link to="/add-item" className="text-decoration-none">
            <div className={`card h-100 ${themeClass} shadow`}>
              <div className="card-body text-center">
                <FaPlusCircle size={40} className="mb-3" />
                <h5 className="card-title">Add Record</h5>
                <p className="card-text">Click here to add a new record to your dashboard.</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Add Expense Card */}
        <div className="col-md-6">
          <Link to="/add-expense" className="text-decoration-none">
            <div className={`card h-100 ${themeClass} shadow`}>
              <div className="card-body text-center">
                <FaDollarSign size={40} className="mb-3" />
                <h5 className="card-title">Add Expense</h5>
                <p className="card-text">Click here to add a new expense to your dashboard.</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Add;
