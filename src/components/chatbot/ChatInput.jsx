import React, { useState } from 'react';

const ChatInput = ({ onSendMessage }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSendMessage(text);
    setText('');
  };

  return (
    <form onSubmit={handleSubmit} className='flex gap-1 mt-4'>
      <input
        type="text"
        value={text}
        required
        onChange={(e) => setText(e.target.value)}
        placeholder="Type your message..."
        className='w-4/5 px-3 py-2 rounded-md border-2 border-zinc-300'
      />
      <button type="submit" className='px-4 rounded-lg py-2 text-white bg-[#6ccb8a]'>Send</button>
    </form>
  );
};

export default ChatInput;
