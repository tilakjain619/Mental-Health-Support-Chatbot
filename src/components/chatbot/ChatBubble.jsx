import React from 'react';
import './chat.css'

const ChatBubble = ({ text, sender }) => {
  const bubbleStyle = sender === 'user' ? 'user-bubble' : 'bot-bubble';
  return <div className={`${bubbleStyle} text-black`}>{text}</div>;
};

export default ChatBubble;
