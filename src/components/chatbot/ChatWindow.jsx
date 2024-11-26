import React, { useState, useEffect, useRef } from 'react';
import ChatInput from './ChatInput';
import ChatBubble from './ChatBubble';
import responses from '../responses.json';
import logo from '../../assets/logo.svg';

const ChatWindow = () => {
  const [messages, setMessages] = useState([
    { text: "Hey, welcome to Relief", sender: "bot" },
    { text: "type `theme` to change theme", sender: "bot" },
  ]);
  
  const [timer, setTimer] = useState(0);
  const [showStopButton, setShowStopButton] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [theme, setTheme] = useState('default');
  const [showThemeOptions, setShowThemeOptions] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [breathStage, setBreathStage] = useState("Breathe In");
  const [audio] = useState(new Audio("https://res.cloudinary.com/da3wjnlzg/video/upload/f_auto:video,q_auto/v1/mental-health-support/se4qfpkkefyiwaqdu9tb"));

  const messageEndRef = useRef(null);
  const scrollToBottom = () => {
    messageEndRef.current.scrollIntoView({ behavior: "smooth" })
    window.scrollTo({
      top: messageEndRef.current.offsetTop,
      behavior: "smooth"
    })
    console.log("runned");

  }
  // useEffect(() => {
  //   if (messages.length === 0) {
  //     setMessages([
  //       { text: "Hey, welcome to Relief", sender: "bot" },
  //       { text: "which theme do you want to use?", sender: "bot" },
  //     ]);
  //     setShowThemeOptions(true);
  //   }
  // }, [messages]);
  

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);
  


  useEffect(() => {
    // Remove existing theme classes
    document.body.classList.remove('cool-theme', 'dark-theme', 'calm-theme');

    // Add the current theme class
    if (theme !== 'default') {
      document.body.classList.add(`${theme}-theme`);
    }
  }, [theme]);

  const handleDeepBreathingExercise = () => {
    const customResponse = { text: "Let's start a deep breathing exercise in 2 seconds", sender: 'bot' };
    setMessages((prevMessages) => [...prevMessages, customResponse]);
    setTimer(0);
    setTimeout(() => {
      setIsRunning(true);
      setIsPaused(false);
      setBreathStage("Breathe In");
    }, 2000);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    setShowThemeOptions(false);
  };

  useEffect(() => {
    let interval;
    if (isRunning && !isPaused) {
      interval = setInterval(() => {
        setTimer((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
  
    if (timer > 0 && timer % 4 === 0) {
      setBreathStage((prevStage) => (prevStage === "Breathe In" ? "Breathe Out" : "Breathe In"));
    }
  
    return () => clearInterval(interval);
  }, [isRunning, isPaused, timer]);
  

  const handlePause = () => setIsPaused(true);
  const handleStart = () => setIsPaused(false);
  const handleRestart = () => {
    setTimer(0);
    setIsPaused(false);
    setIsRunning(true);
    setBreathStage("Breathe In");
  };
  const handleStop = () => {
    setIsRunning(false);
    const endMessage = {
      text: `You exercised for ${timer} seconds in this session.`,
      sender: 'bot',
    };
    setMessages((prevMessages) => [...prevMessages, endMessage]);
    setTimer(0);
  };
  const handlePlaySong = () => {
    audio.play();
    setShowStopButton(true); // Show the stop button
  }
  const handleStopSong = () => {
    audio.pause();
    audio.currentTime = 0; // Reset to start
    setShowStopButton(false); // Hide the stop button
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: "Stop the music", sender: "user" }
    ]);
  }

  const handleSendMessage = (text) => {
    const customPrompts = [
      {
        keywords: ["deep breathing", "breathing exercise", "breathing excercise", "breathe exercise", "breathing exercises"],
        action: handleDeepBreathingExercise,
      },
      {
        keywords: ["play music", "play song"],
        action: handlePlaySong,
      },
      {
        keywords: ["stop music", "stop song", "pause song", "pause music"],
        action: handleStopSong,
      },
      {
        keywords: ["theme"],
        action: () => setShowThemeOptions(true)
      }
    ];

    const userMessage = { text, sender: 'user' };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    const customMatch = customPrompts.find((prompt) =>
      prompt.keywords.some((keyword) => text.toLowerCase().includes(keyword))
    );
    if (customMatch) {
      customMatch.action();
      return;
    }

    const match = responses.find((entry) =>
      entry.keywords.some((keyword) => text.toLowerCase().includes(keyword))
    );

    if (match) {
      const botResponse = { text: match.response, sender: 'bot' };
      setMessages((prevMessages) => [...prevMessages, botResponse]);

      if (match.optional_response) {
        setTimeout(() => {
          const followUp = { text: match.optional_response, sender: 'bot' };
          setMessages((prevMessages) => [...prevMessages, followUp]);
        }, 2000);
      }
    } else {
      const fallbackResponse = {
        text: "I'm here to listen. Please tell me more.",
        sender: 'bot'
      };
      setMessages((prevMessages) => [...prevMessages, fallbackResponse]);
    }
  };

  return (
    <div className='px-4 py-2 w-[98%] border-2 border-zinc-200 rounded-lg sm:w-[450px] max-w-[450px] mx-auto'>
      <div className='bg-[#a3d6e0] px-3 py-2 mt-2 rounded-lg'>
        <img src={logo} alt="Relief Logo" className='w-28' />
      </div>
      <div className={`h-[70vh] relative overflow-y-auto px-4 mt-4 overflow-x-hidden ${isRunning ? 'blur-[2px]' : 'blur-0'}`}>
        {messages.map((msg, index) => (
          <ChatBubble key={index} text={msg.text} sender={msg.sender} />
        ))}
        {showStopButton && (
          <div className="mt-2">
            <button
              className="bg-[#e76a7d] hover:bg-opacity-70 text-white px-4 py-2 rounded-md"
              onClick={handleStopSong}
            >
              Stop Music
            </button>
          </div>
        )}
        {
          showThemeOptions && (
            <div className="flex flex-col gap-1 mt-2">
              <p>Choose Theme: </p>
          <button className='text-left' onClick={() => handleThemeChange('default')}>Default</button>
          <button className='text-left' onClick={() => handleThemeChange('cool')}>Cool</button>
          <button className='text-left' onClick={() => handleThemeChange('dark')}>Dark Mode</button>
          <button className='text-left' onClick={() => handleThemeChange('calm')}>Calming Colors</button>
        </div>
          )
        }
        <span ref={messageEndRef}></span>
      </div>
      {isRunning && (
        <div className='fixed z-10 top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-zinc-100 bg-opacity-80 px-6 py-5 sm:min-w-[300px] min-h-[110px] rounded-lg'>
          <span className=' text-zinc-800 text-lg'>{breathStage}</span>
          <span className='bg-[#e76a7d] ml-2 float-right text-white px-2 py-0.5 rounded-md text-sm'>{timer}s</span>
          <div className='flex gap-1 mt-2'>
            <button className='bg-[#6ccb8a] text-sm px-2 py-0.5 rounded-md' onClick={isPaused ? handleStart : handlePause}>
              {isPaused ? "Resume" : "Pause"}
            </button>
            <button className='bg-[#f1c84b] text-sm px-2 py-0.5 rounded-md' onClick={handleRestart}>Restart</button>
            <button className='bg-[#e76a7d] text-sm px-2 py-0.5 rounded-md' onClick={handleStop}>Stop</button>
          </div>
        </div>
      )}
      <ChatInput onSendMessage={handleSendMessage} />
      <div className='pt-1 text-center'>
        <small className='text-gray-700 text-xs'>This chatbot can make mistakes</small>
      </div>
    </div>
  );
};

export default ChatWindow;
