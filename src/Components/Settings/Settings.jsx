import React, {useState} from 'react';
import styles from './Settings.module.css';
import pic from './profilePic.jpeg'
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const Settings = () => {
  const role = localStorage.getItem('role');
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (role !== 'admin') {
      toast.error('Unauthorized access'); 
      navigate('/'); 
    }
  }, [role, navigate]);

  if (role !== 'admin') return null; // Return nothing if not admin



  useEffect(() => {
    // Redirect if not admin
    if (role !== 'admin') {
      toast.error('Unauthorized access');
      navigate('/');
    }

    // Fetch admin profile data
    axios.get('https://ashafa-server.onrender.com/api/admin/profile')
      .then(response => {
        const { name, email } = response.data;
        setName(name);
        setEmail(email);
      })
      .catch(error => {
        toast.error('Failed to fetch profile');
        console.error(error);
      });
  }, [role, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    // Update profile API call
    axios.put('https://ashafa-server.onrender.com/api/admin/profile', { name, email, password })
      .then(response => {
        toast.success('Profile updated successfully');
      })
      .catch(error => {
        toast.error('Failed to update profile');
        console.error(error);
      });
  };


  return (
    <div className={styles.profile}>
          <div className= {styles.profileImageContainer}>
                  <img src={pic} className= {styles.img} />
            <span className={styles.changeImageLink}> Change Profile Picture</span>
            </div>

            <div className={styles.form}>

            <input
            type="text"
            placeholder="Name"
            className={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            className={styles.input}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
