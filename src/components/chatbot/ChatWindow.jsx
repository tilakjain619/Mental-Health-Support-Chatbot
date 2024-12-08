import React, { useState, useEffect, useRef } from 'react';
import ChatInput from './ChatInput';
import ChatBubble from './ChatBubble';
import responses from '../responses.json';
import logo from '../../assets/logo.svg';
import { Link } from 'react-router-dom';

const ChatWindow = ({ onBreathingPopupStateChange }) => {
  const [messages, setMessages] = useState([
    { text: "Hey, welcome to Relief", sender: "bot" },
    { text: "type `theme` to change theme", sender: "bot" },
  ]);

  const [timer, setTimer] = useState(0);
  const [showStopButton, setShowStopButton] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [theme, setTheme] = useState('default');
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(true);
  const [chatOptions, setChatOptions] = useState(false);
  const [showThemeOptions, setShowThemeOptions] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [breathStage, setBreathStage] = useState("Breathe In");
  const [audio] = useState(new Audio("https://res.cloudinary.com/da3wjnlzg/video/upload/f_auto:video,q_auto/v1/mental-health-support/se4qfpkkefyiwaqdu9tb"));
  const synth = window.speechSynthesis; // Ensure this is declared at the top level of your ChatWindow component

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
      onBreathingPopupStateChange(true);
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
    onBreathingPopupStateChange(false);
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
  }

  // text to speech for better accessibility
  const handleBotSpeak = (message) => {
    if (!isSpeechEnabled || !synth) return;

    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = "en-US";
    synth.speak(utterance);
  };
  // toggle feature for user to access speech
  const toggleSpeech = () => {
    setIsSpeechEnabled((prev) => {
      const newState = !prev;
      const message = newState
        ? "Speech has been enabled. I will now read my responses aloud."
        : "Speech has been disabled.";
      setMessages((prevMessages) => [...prevMessages, { text: message, sender: "bot" }]);
      return newState;
    });
  };


  // const handleBotSpeak = (message) => {
  //   const utterance = new SpeechSynthesisUtterance(message);
  //   utterance.lang = 'en-US';
  //   synth.speak(utterance);
  // };

  useEffect(() => {
    const savedMessages = JSON.parse(localStorage.getItem("chatHistory")) || [];
    setMessages(savedMessages);
  }, []);

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
        action: () => setShowThemeOptions(true),
      },
    ];

    const userMessage = { text, sender: "user" };

    setMessages((prevMessages) => {
      const updatedMessages = [...prevMessages, userMessage];
      localStorage.setItem("chatHistory", JSON.stringify(updatedMessages));
      return updatedMessages;
    });

    // Check custom prompts
    const customMatch = customPrompts.find((prompt) =>
      prompt.keywords.some((keyword) => text.toLowerCase().includes(keyword))
    );

    if (customMatch) {
      customMatch.action();
      return; // Return early if a custom action is triggered
    }

    // Check predefined responses
    const match = responses.find((entry) =>
      entry.keywords.some((keyword) => text.toLowerCase().includes(keyword))
    );

    if (match) {
      const botResponse = { text: match.response, sender: "bot" };

      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages, botResponse];
        localStorage.setItem("chatHistory", JSON.stringify(updatedMessages));
        return updatedMessages;
      });

      handleBotSpeak(match.response);

      if (match.optional_response) {
        setTimeout(() => {
          const followUp = { text: match.optional_response, sender: "bot" };

          setMessages((prevMessages) => {
            const updatedMessages = [...prevMessages, followUp];
            localStorage.setItem("chatHistory", JSON.stringify(updatedMessages));
            return updatedMessages;
          });
        }, 2000);
      }
    } else {
      // Handle fallback response
      const fallbackResponse = {
        text: "I'm here to listen. Please tell me more.",
        sender: "bot",
      };

      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages, fallbackResponse];
        localStorage.setItem("chatHistory", JSON.stringify(updatedMessages));
        return updatedMessages;
      });

      handleBotSpeak(fallbackResponse.text);
    }
  };
  const handleClearHistory = () => {
    const defaultMessages = [
      { text: "Hey, welcome to Relief", sender: "bot" },
      { text: "Type `theme` to change theme", sender: "bot" },
    ];
    localStorage.removeItem("chatHistory");
    setMessages(defaultMessages);
    localStorage.setItem("chatHistory", JSON.stringify(defaultMessages));
  };
  const handleDownloadChatAsHTML = () => {
    // Build HTML content for the chat
    const chatContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Chat History</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; margin: 20px; }
          .message { margin-bottom: 10px; }
          .bot { color: #007bff; }
          .user { color: #28a745; }
        </style>
      </head>
      <body>
        <h2>Relief - Chat History</h2>
        ${messages
        .map(
          (msg) =>
            `<p class="message ${msg.sender}"><strong>${msg.sender === "bot" ? "Bot" : "You"}:</strong> ${msg.text}</p>`
        )
        .join("")}
      </body>
      </html>
    `;

    // Create a Blob with the HTML content
    const blob = new Blob([chatContent], { type: "text/html" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "chat_history.html"; // Default file name
    link.click();
  };



  return (
    <div className='px-4 py-2 w-[98%] border-2 border-zinc-200 rounded-lg sm:w-[450px] max-w-[450px] mx-auto'>
      <div className='flex relative items-center justify-between bg-[#a3d6e0] px-3 py-2 mt-2 rounded-lg'>
        <Link to="/">
          <div className=''>
            <img src={logo} alt="Relief Logo" className='w-28' />
          </div></Link>
        <div>
          <svg onClick={() => setChatOptions(!chatOptions)} className='cursor-pointer' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={20} height={20} color={"#141414"} fill={"none"}>
            <path d="M10 5L20 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M4 12L20 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M4 19L14 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {
            chatOptions && <div onClick={() => setChatOptions(false)} className='absolute rounded-lg border border-zinc-300 z-10 bg-white bg-opacity-50 backdrop-blur-md px-1 py-1 right-8'>
            <ul>
              <li onClick={handleClearHistory} className='px-4 rounded-lg py-3 hover:bg-zinc-400 hover:text-zinc-100 cursor-pointer'>Clear chat</li>
              <li onClick={handleDownloadChatAsHTML} className='px-4 rounded-lg py-3 hover:bg-zinc-400 cursor-pointer hover:text-zinc-100'>Download chat</li>
              <li onClick={toggleSpeech} className="px-4 rounded-lg py-3 hover:bg-zinc-400 cursor-pointer hover:text-zinc-100">
                {isSpeechEnabled ? "Disable Speech" : "Enable Speech"}
              </li>

            </ul>
          </div>
          }
        </div>
      </div>
      <div className={`h-[70vh] relative overflow-y-auto px-4 mt-4 overflow-x-hidden ${isRunning ? 'opacity-30 blur-sm' : 'blur-0'}`}>
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
        <div
          className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10`}
        >
          <div
            className={`bg-white border border-zinc-300 px-6 py-5 w-[300px] sm:min-w-[400px] min-h-[110px] rounded-lg shadow-lg transform transition-all duration-300 
        ${isRunning ? "animate-fadeIn" : "animate-fadeOut"}`}
          >
            <h2 className="text-black">Breathing Exercise</h2>
            <hr className="my-2" />
            <span className="text-zinc-800 uppercase text-lg sm:text-2xl">{breathStage}</span>
            <span className="bg-[#e76a7d] ml-2 float-right text-white px-2 py-0.5 rounded-md text-sm">{timer}s</span>
            <div className="flex gap-1 mt-2">
              <button
                className="bg-[#6ccb8a] text-white text-sm px-2 py-0.5 rounded-md"
                onClick={isPaused ? handleStart : handlePause}
              >
                {isPaused ? "Resume" : "Pause"}
              </button>
              <button
                className="bg-[#f1c84b] text-zinc-800 text-sm px-2 py-0.5 rounded-md"
                onClick={handleRestart}
              >
                Restart
              </button>
              <button
                className="bg-[#e76a7d] text-white text-sm px-2 py-0.5 rounded-md"
                onClick={handleStop}
              >
                Stop
              </button>
            </div>
          </div>
        </div>
      )}


      <ChatInput onSendMessage={handleSendMessage} />
      <div className='pt-2 text-center'>
        <small className='text-gray-700 flex justify-center items-center gap-1 text-xs'><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={14} height={14} fill={"none"}>
          <path d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12Z" stroke="currentColor" strokeWidth="1.5" />
          <path d="M12.2422 17V12C12.2422 11.5286 12.2422 11.2929 12.0957 11.1464C11.9493 11 11.7136 11 11.2422 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M11.992 8H12.001" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg> This chatbot can make mistakes</small>
      </div>
    </div>
  );
};

export default ChatWindow;
