import React, { useState } from 'react'
import ChatWindow from './chatbot/ChatWindow'
import './style.css'

const Home = () => {
  const [bgOpacity, setBgOpacity] = useState(false);
  return (
    <div className={`min-h-[100vh] grid items-center justify-center main-container ${
      bgOpacity ? '' : ''
    }`}>
      <ChatWindow onBreathingPopupStateChange={setBgOpacity}/>
    </div>
  )
}

export default Home
