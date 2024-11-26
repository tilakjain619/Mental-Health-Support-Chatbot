import React from 'react'
import { WavyBackground } from '../components/ui/WavyBackground'
import logo from '../assets/logo.svg';
import { Link } from 'react-router-dom';

const Landing = () => {
    return (
        <div>
            <WavyBackground className="max-w-4xl mx-auto">
                <div className='px-3 py-2 w-full h-full flex flex-col items-center justify-center text-center'>
                    <h2 className="text-center">
                        <img className='w-44 md:w-56' src={logo} alt="Relief Logo" />
                    </h2>
                    <p className="text-lg md:text-2xl mt-4 text-white font-normal inter-var text-center">
                        Mental Health Support Chatbot
                    </p>
                    <div className='flex gap-2 mt-4'>
                        <Link to="/about" className='text-white bg-black bg-opacity-50 rounded-lg text-sm md:text-lg px-4 py-3 hover:bg-opacity-85 transition-all duration-300'>Read more</Link>
                        <Link to="/chat" className='text-white bg-black bg-opacity-50 rounded-lg text-sm md:text-lg px-4 py-3 hover:bg-opacity-85 transition-all duration-300'>Try now</Link>
                    </div>
                </div>
            </WavyBackground>
        </div>
    )
}

export default Landing
