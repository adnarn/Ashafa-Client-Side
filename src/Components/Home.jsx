import React, {useState} from 'react'
import TopNav from './TopNav'
import SideNav from './SideNav'


const Home = () => {
  const [theme, setTheme] = useState("light");

  return (
    <div className={theme === 'light' ? 'light-theme' : 'dark-theme'}>
    <TopNav theme={theme} setTheme={setTheme} />
  </div>
  )
}

export default Home 
