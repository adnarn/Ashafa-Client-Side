import React from 'react';
import styles from './Settings.module.css';
import pic from './profilePic.jpeg'



const Settings = () => {
  return (
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
                type="number"
                placeholder='Password'
                  className={styles.input}                  
                  />  

                <input
                type="number"
                placeholder='Confirm Password'
                  className={styles.input}                  
                  />
 
          <button 
           className ={styles.btn}
           >
              Update Profile 
          </button>          
                  </div>
      
      
    </div>
  );
};

export default Settings;
