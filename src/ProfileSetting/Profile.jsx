import React, { useState, useEffect } from 'react';
import styles from './Profile.module.css';
import pic from './profilePic.jpeg';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const role = localStorage.getItem('role'); // Assuming role is stored in localStorage
  const navigate = useNavigate();

  // Fetch user details on component mount
  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = localStorage.getItem('token'); // Get token from localStorage
      if (!token) {
        toast.error('You are not logged in');
        navigate('/login'); // Redirect to login if no token
        return;
      }

      try {
        const response = await axios.get('http://localhost:4000/api/get-profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const { name, email } = response.data;
        setName(name);
        setEmail(email);
      } catch (error) {
        console.error('Error fetching user details:', error);
        toast.error('Failed to fetch user details');
      }
    };

    fetchUserDetails();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('You are not logged in');
      navigate('/login');
      return;
    }

    try {
      const response = await axios.put(
        'http://localhost:4000/api/update-profile',
        { name, email, password },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success('Profile updated successfully');
        setPassword('')
        setConfirmPassword('')
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  return (
    <div>
      <div className={styles.profile}>
        <div className={styles.profileImageContainer}>
          <img src={pic} className={styles.img} alt="Profile" />
          <span className={styles.changeImageLink}> Change Profile Picture</span>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
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
          <button className={styles.btn}>Update Profile</button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
