import React from 'react'
import { BackgroundBeamsWithCollision } from '../components/ui/background-beams'
import logo from '../assets/logo.svg';
import { Link } from 'react-router-dom';
const About = () => {
    return (
        <>
            <BackgroundBeamsWithCollision className="fixed -z-10 h-full w-full">

            </BackgroundBeamsWithCollision>
            <div className='container mx-auto px-5 py-3 pt-5 text-white flex flex-col gap-3'>
                <div>
                    <img className='w-20 md:w-32' src={logo} alt="Relief Logo" />
                </div>
                <div>
                    <h2 className='text-lg'>Introduction</h2>
                    <p className='text-zinc-300 mt-2 text-sm sm:text-base'>
                        Mental health is important for everyone. Sometimes, getting help from professionals can be hard. This project introduces a simple mental health chatbot made with ReactJS. It maps words typed by users and gives caring replies. While it's not a substitute for professional help, it encourages users to think about their mental health and seek further assistance if needed. This tool shows how basic technology can support mental health in an accessible way.
                    </p>
                </div>
                <div>
                    <h2 className='text-lg'>Tech used</h2>
                    <ul className='text-zinc-300 mt-2 text-sm sm:text-base'>
                        <li className='flex gap-1 items-center py-1'><img className='w-6' src="https://img.icons8.com/?size=100&id=asWSSTBrDlTW&format=png&color=000000" alt="reactjs" /> Reactjs</li>
                        <li className='flex gap-1 items-center py-1'><img className='w-6' src="https://img.icons8.com/?size=100&id=4PiNHtUJVbLs&format=png&color=000000" alt="tailwindcss" /> Tailwind CSS</li>
                    </ul>
                </div>
                <div>
                    <h2 className="text-lg">Features</h2>
                    <ul className="text-zinc-300 mt-2 text-sm sm:text-base list-disc ml-5">
                        <li className='list-disc'>Predefined responses for mental health-related queries.</li>
                        <li className='list-disc'>Breathing exercise with a timer and guidance.</li>
                        <li className='list-disc'>Customizable themes for a calming user experience.</li>
                        <li className='list-disc'>Background music for relaxation during sessions.</li>
                    </ul>
                </div>
                <div>
                    <h2 className="text-lg">Use Cases</h2>
                    <ul className="text-zinc-300 mt-2 text-sm sm:text-base ml-5">
                        <li className='list-disc'>A student feeling overwhelmed can use the chatbot for instant breathing exercises.</li>
                        <li className='list-disc'>An individual looking for relaxation can listen to calming music through the chatbot.</li>
                        <li className='list-disc'>Users seeking guidance on mental health can engage with predefined responses.</li>
                    </ul>
                </div>
                <div className='mt-4 bg-zinc-900 border border-zinc-600 px-4 py-3 rounded-lg'>
                    <p className="text-zinc-300 text-sm sm:text-base">
                        Ready to experience a better mental health journey? Start chatting now and take the first step toward self-care!
                    </p>
                    <Link to="/chat"><p className='text-white w-fit mt-2 bg-black bg-opacity-50 rounded-lg text-sm md:text-base px-4 py-2 hover:bg-opacity-25 duration-300'>Try now</p></Link>
                </div>


            </div>
        </>
    )
}

export default About
