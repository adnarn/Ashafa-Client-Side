import React from 'react'
import styles from "./SideNav.module.css"
import {Link} from 'react-router-dom'
import profilePic from './profilePic.jpeg'
import { FaChartArea, FaClipboardList, FaCog, FaHome, FaPlus, FaUser } from 'react-icons/fa'
import './SideNav.css'

const SideNav = ({theme, setTheme}) => {
  const role = localStorage.getItem('role');
  const toggle_mode = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  console.log('User Role:', role);  
  
 

  return (
    
    <div className={theme === 'light' ? 'light-theme' : 'dark-theme'}>
  <aside className={`${styles.SideNav} ${theme === 'light' ? 'light-theme' : 'dark-theme'}`}>
            
         <div className="profile">
            <Link to = '/profile'>
                  <div><img src={profilePic} className={styles.img} /></div>
          </Link>
              <p  id='role'>{role}</p>
        </div>
          
          <div className={styles.center} > 

          <Link to = '/'>
                    <div ><FaHome className={styles.icons}/></div>
          </Link>

          <Link to = '/add'>
                    <div ><FaPlus className={styles.icons} /> </div>
            </Link>

            <Link to = '/clipBoard'>
                    <div ><FaClipboardList className={styles.icons} /></div>
            </Link>

           { 
            role === 'admin' &&
          ( <Link to = '/charts'>
                  <div ><FaChartArea className={styles.icons} /></div>
            </Link>
           ) }


            <Link to = '/profile'>
                    <div ><FaUser className={styles.icons} /></div>
              </Link>
          </div>

      <Link to = '/settings'>
          <div ><FaCog className={styles.icons} /></div>
        </Link>
        
    </aside>
  </div>
  )
}

export default SideNav