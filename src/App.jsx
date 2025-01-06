import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Home from './Components/Home';
import AddItem from './Components/Add Item/AddItem';
import Add from './Components/Add Item/Add';
import AddExpense from './Components/Add Item/AddExpense';
import MainContent from './Components/MainContent';
import UpdateItem from './Components/Update';
import HomeDash from './HomeContents';
import Profile from './ProfileSetting';
import Login from './Components/auth/LogReg/Login';
import Signup from './Components/auth/LogReg/Signup';
import SideNav from './Components/SideNav';
import TopNav from './Components/TopNav'; 
import Settings from './Components/Settings/Settings';
import Receipt from './PDF/Reciept';
import Charts from './Components/charts/Charts';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddSelectableItem from './Components/Add Item/AddSelectableItem';
import Items from './Components/Add Item/Items';
import UpdateSelectableItem from './Components/Update/UpdateSelectableItem';
import ExpensesPage from './Components/Add Item/ExpensesPage';


function App() {
  return (
    <BrowserRouter>
      <AppContent />
      <ToastContainer />
    </BrowserRouter>
  );
}

function AppContent() {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  const [theme, setTheme] = useState("");

  const toggle_mode = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    document.body.style.backgroundColor = theme === 'light' ? '#fff' : '#222';
    document.body.style.color = theme === 'light' ? '#000' : '#fff';
  }, [theme]);




  return (
    <div className={`app-container ${theme === 'light' ? 'light-app' : 'dark-app'}`}>
      <TopNav theme={theme} setTheme={setTheme} toggle_mode={toggle_mode} />
      {token && <SideNav theme={theme} setTheme={setTheme} />}
      <Routes>
        <Route path="/" element={token ? <HomeDash theme={theme} /> : <Login />} />
        <Route path="/clipBoard" element={token ? <MainContent theme={theme} /> : <Login />} />
        <Route path="/add-item" element={token ? <AddItem theme={theme} /> : <Login />} />
        <Route path="/expenses" element={token ? <ExpensesPage theme={theme} /> : <Login />} />
        <Route path="/add" element={token ? <Add theme={theme} /> : <Login />} />
        <Route path="/add-expense" element={token ? <AddExpense theme={theme} /> : <Login />} />
        <Route path="/add-selected-item" element={token ? <AddSelectableItem theme={theme} /> : <Login />} />
        <Route path="/show-items" element={token ? <Items theme={theme} /> : <Login />} />
        <Route path="/update/:id" element={token ? <UpdateItem theme={theme} /> : <Login />} />
        <Route path="/update-items/:id" element={token ? <UpdateSelectableItem theme={theme} /> : <Login />} />
        <Route path="/profile" element={token ? <Profile theme={theme} /> : <Login />} />
        <Route path="/charts" element={token ? <Charts theme={theme} /> : <Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/receipt/:id" element={<Receipt />} />
      </Routes>
    </div>
  );
}


export default App;
