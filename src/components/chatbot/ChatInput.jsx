import React, { useState } from 'react';

const ChatInput = ({ onSendMessage }) => {
  const [text, setText] = useState('');
  const [isListening, setIsListening] = useState(false);

  // Speech Recognition and Synthesis setup
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;
  const synth = window.speechSynthesis;

  // Speech-to-Text
  const handleStartListening = () => {
    if (!recognition) {
      alert('Speech Recognition is not supported in your browser.');
      return;
    }
    recognition.lang = 'en-US'; // Set language
    recognition.start();
    setIsListening(true);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setText(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
      alert('An error occurred while recognizing speech.');
    };
  };

  // Text-to-Speech
  const handleSpeak = (textToSpeak) => {
    if (!synth) {
      alert('Text-to-Speech is not supported in your browser.');
      return;
    }
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'en-US'; // Set language
    synth.speak(utterance);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSendMessage(text);
    // handleSpeak(text); // Read out user's message (optional as we don't need it for now)
    setText('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mt-4 items-center">
      <button
        type="button"
        title='Use mic to speak'
        onClick={handleStartListening}
        className={`px-3 py-2 rounded-md ${isListening ? 'bg-red-400' : 'bg-blue-200'} text-white`}
      >
        {isListening ? <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={20} height={20} color={"#141414"} fill={"none"}>
    <path d="M2 2L22 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M4 11C4 15.4183 7.58172 19 12 19M12 19C13.9545 19 15.7454 18.2991 17.1348 17.1348M12 19V22M12 22H15M12 22H9M20 11C20 12.6514 19.4996 14.1859 18.6422 15.4603" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M7 6.98V11C7 13.7614 9.23858 16 12 16C13.1354 16 14.1647 15.6096 15.004 14.972M16.4387 13.244C16.7973 12.5545 17 11.8309 17 11V6.98C17 4.21858 14.7614 2 12 2C10.1312 2 8.53009 2.96527 7.672 4.484" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
</svg> : <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={20} height={20} color={"#141414"} fill={"none"}>
    <path d="M17 7V11C17 13.7614 14.7614 16 12 16C9.23858 16 7 13.7614 7 11V7C7 4.23858 9.23858 2 12 2C14.7614 2 17 4.23858 17 7Z" stroke="currentColor" strokeWidth="1.5" />
    <path d="M20 11C20 15.4183 16.4183 19 12 19M12 19C7.58172 19 4 15.4183 4 11M12 19V22M12 22H15M12 22H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
</svg>}
      </button>
      <input
        type="text"
        value={text}
        required
        onChange={(e) => setText(e.target.value)}
        placeholder="Type your message..."
        className="w-4/5 px-3 py-2 rounded-md border-2 border-zinc-300"
      />
      <button type="submit" className="px-4 py-2 rounded-lg text-white bg-[#6ccb8a] hover:bg-[#41cc6d]">
        Send
      </button>
    </form>
  );
};

export default ChatInput;
