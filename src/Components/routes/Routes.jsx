import React from 'react'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import AddItem from './Components/Add Item/AddItem';
import MainContent from './Components/MainContent';
import UpdateItem from './Components/Update';
import HomeDash from './HomeContents';
import Profile from './ProfileSetting';
import Login from './Components/auth/LogReg/Login';
import Signup from './Components/auth/LogReg/Signup';

const Routes = () => 
const token = localStorage.getItem('token');
const navigate = useNavigate();

const handleLogout = () => {
  localStorage.removeItem('token');
  navigate('/login');
};
  return (

    <div>
        <BrowserRouter>
        <Routes>
        <Route path="/" element={token ? <HomeDash /> : <Login />} />
        <Route path="/clipBoard" element={token ? <MainContent /> : <Login />} />
        <Route path="/add" element={token ? <AddItem /> : <Login />} />
        <Route path="/update/:id" element={token ? <UpdateItem /> : <Login />} />
        <Route path="/profile" element={token ? <Profile /> : <Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signup />} />            
        </Routes>
        </BrowserRouter>
    </div>
  )
}

export default Routes