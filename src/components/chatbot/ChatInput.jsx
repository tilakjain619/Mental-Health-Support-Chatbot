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
        {isListening ? 'Listening...' : '🎙️'}
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
