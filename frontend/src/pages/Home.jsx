import React from 'react'
import Navbar from '../components/Navbar.jsx'
import Header from '../components/Header.jsx'

const Home = () => {
  return (
    <div className='flex flex-col items-center justify-between min-h-screen bg-cover bg-center'>
      <Navbar/>
      <Header/>
    </div>
  )
}

export default Home
