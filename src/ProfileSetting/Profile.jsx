import React from 'react'
import styles from './Profile.module.css';
import pic from './profilePic.jpeg'
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';


const Profile = () => {
  const role = localStorage.getItem('role');
  const navigate = useNavigate();

  useEffect(() => {
    if (role !== 'admin') {
      toast.error('Unauthorized access'); 
      navigate('/'); 
    }
  }, [role, navigate]);

  if (role !== 'admin') return null; // Return nothing if not admin
  return (
    <div>
        <div className={styles.profile}>
          <div className= {styles.profileImageContainer}>
                  <img src={pic} className= {styles.img} />
            <span className={styles.changeImageLink}> Change Profile Picture</span>
            </div>

            <div className={styles.form}>

                <input type="text"
                    placeholder='Name' 
                    className={styles.input}
                />  
                <input
                type="password"
                placeholder='Password'
                  className={styles.input}                  
                  />

                <input
                type="password"
                placeholder='Confirm Password'
                  className={styles.input}                  
                  />
 
                  </div>
          <button 
           className ={styles.btn}
           >
              Update Profile 
          </button>          

        </div>
    </div>
  );
};

export default Profile;
