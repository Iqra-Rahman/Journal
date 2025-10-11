import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from "./components/Navbar.jsx";
import Home from './pages/Home'
import Login from './pages/Login'
import EmailVerify from './pages/EmailVerify'
import ResetPassword from './pages/ResetPassword'
import Canvas from './pages/Canvas'
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import JournalList from './pages/JournalList'

const App = () => {
  const location = useLocation();
  
  // Hide Navbar on Login, EmailVerify, and ResetPassword pages
  const hideNavbarPaths = ['/login', '/email-verify', '/reset-password'];
  const shouldHideNavbar = hideNavbarPaths.includes(location.pathname);
  return (
    <div >
      <ToastContainer/>
      {!shouldHideNavbar && <Navbar />}
      <div className='pt-20 bg-gradient-to-b from-amber-200 to-fuchsia-200 min-h-screen flex items-center justify-center'>
        <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/email-verify" element={<EmailVerify/>} />
        <Route path="/reset-password" element={<ResetPassword/>} />
        <Route path="/canvas" element={<Canvas/>} />
        <Route path="/journals" element={<JournalList/>}/>
      </Routes>
      </div>
    </div>
  )
}

export default App
