import React from 'react'
import ChatWindow from './chatbot/ChatWindow'
import './style.css'

const Home = () => {
  return (
    <div className='min-h-[100vh] grid items-center justify-center main-container'>
      <ChatWindow/>
    </div>
  )
}

export default Home
