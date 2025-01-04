import React from "react";
import { Link } from "react-router-dom";
import { FaPlusCircle, FaSearch, FaBook, FaUser } from "react-icons/fa";

const HomeDash = ({ theme }) => {
  const role = localStorage.getItem("role");

  return (
    <>
    {role==='admin'?
   (   <div className='user-dashboard'>
    <div
 className={`container py-4 ${
   theme === "light" ? "bg-light" : "bg-dark text-light"
 }`}
>
 <h2 className="text-center mb-4">Admin Dashboard</h2>
 <div className="row g-4">
   {/* Add Record Card */}
   <div className="col-12 col-sm-6 col-lg-3">
     <div className="card h-100 text-center shadow">
       <div className="card-body">
         <FaPlusCircle className="mb-3 text-primary" size={50} />
         <h5 className="card-title">Add Record</h5>
         <p className="card-text">Add a new record to the system.</p>
         <Link to="/add" className="btn btn-primary">
           Add Record
         </Link>
       </div>
     </div>
   </div>

   {/* Search Receipt Card */}
   <div className="col-12 col-sm-6 col-lg-3">
     <div className="card h-100 text-center shadow">
       <div className="card-body">
         <FaSearch className="mb-3 text-success" size={50} />
         <h5 className="card-title">Search Receipt</h5>
         <p className="card-text">Search for receipts by keyword.</p>
         <Link to="/search" className="btn btn-success">
           Search Receipt
         </Link>
       </div>
     </div>
   </div>

   {/* View Records Card */}
   <div className="col-12 col-sm-6 col-lg-3">
     <div className="card h-100 text-center shadow">
       <div className="card-body">
         <FaBook className="mb-3 text-info" size={50} />
         <h5 className="card-title">View Records</h5>
         <p className="card-text">View all available records.</p>
         <Link to="/clipBoard" className="btn btn-info">
           View Records
         </Link>
       </div>
     </div>
   </div>

   {/* User Profile Card */}
   <div className="col-12 col-sm-6 col-lg-3">
     <div className="card h-100 text-center shadow">
       <div className="card-body">
         <FaUser className="mb-3 text-warning" size={50} />
         <h5 className="card-title">User Profile</h5>
         <p className="card-text">View and edit your profile details.</p>
         <Link to="/profile" className="btn btn-warning">
           User Profile
         </Link>
       </div>
     </div>
   </div>
 </div>
</div>

 </div>
 ):
    (
      <div className='user-dashboard'>
         <div
      className={`container py-4 ${
        theme === "light" ? "bg-light" : "bg-dark text-light"
      }`}
    >
      <h2 className="text-center mb-4">User Dashboard</h2>
      <div className="row g-4">
        {/* Add Record Card */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card h-100 text-center shadow">
            <div className="card-body">
              <FaPlusCircle className="mb-3 text-primary" size={50} />
              <h5 className="card-title">Add Record</h5>
              <p className="card-text">Add a new record to the system.</p>
              <Link to="/add" className="btn btn-primary">
                Add Record
              </Link>
            </div>
          </div>
        </div>

        {/* Search Receipt Card */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card h-100 text-center shadow">
            <div className="card-body">
              <FaSearch className="mb-3 text-success" size={50} />
              <h5 className="card-title">Search Receipt</h5>
              <p className="card-text">Search for receipts by keyword.</p>
              <Link to="/search" className="btn btn-success">
                Search Receipt
              </Link>
            </div>
          </div>
        </div>

        {/* View Records Card */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card h-100 text-center shadow">
            <div className="card-body">
              <FaBook className="mb-3 text-info" size={50} />
              <h5 className="card-title">View Records</h5>
              <p className="card-text">View all available records.</p>
              <Link to="/clipBoard" className="btn btn-info">
                View Records
              </Link>
            </div>
          </div>
        </div>

        {/* User Profile Card */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card h-100 text-center shadow">
            <div className="card-body">
              <FaUser className="mb-3 text-warning" size={50} />
              <h5 className="card-title">User Profile</h5>
              <p className="card-text">View and edit your profile details.</p>
              <Link to="/profile" className="btn btn-warning">
                User Profile
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>

      </div>
    )
 }
 </>
 );
};

export default HomeDash;
