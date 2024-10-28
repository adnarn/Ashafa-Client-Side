import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './TopNav.module.css';
import lightIcon from '../../assets/day.png';
import darkIcon from '../../assets/night.png';
import './TopNav.css'

const TopNav = ({ theme, toggle_mode }) => {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('./login');
  };



  return (
    <div className={theme === 'light' ? 'light-theme' : 'dark-theme'}>
      {token ? (
        <nav className={styles.TopNav}>
          <h5 className={styles.dashName}>Dex Dash</h5>
          <div className={styles.btnToggle}>
            <div className={styles.button}>
              <Link to="login">
                <button className="btn btn-danger" onClick={handleLogout}>
                  Log Out
                </button>
              </Link>
            </div>
            <img
              onClick={toggle_mode}
              src={theme === 'light' ? darkIcon : lightIcon}
              className={styles.toggle}
              alt="Toggle Theme"
            />
          </div>
        </nav>
      ) : (
        <nav className={styles.TopNavLogin}>
          <h5 className={styles.dashName}>Dex Dash</h5>
          <div className={styles.button}>
{/*             <Link to="login">
              <button className="btn btn-success">Login</button>
            </Link>
            <Link to="register">
              <button className="btn btn-primary">Signup</button>
            </Link> */}
          </div>
        </nav>
      )}
    </div>
  );
};

export default TopNav;
