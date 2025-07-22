import React from 'react'
import logo from '../assets/logo.webp'
import { Link } from 'react-router-dom'

function Home() {
  return (
    <div className='bg-gradient-to-r from-black to-blue-950 '>
        <div className='h-screen text-white container mx-auto md:px-52'>
            {/* Header */}
            <header className='flex items-center justify-between p-6'>

                {/* left */}
                <div className='flex items-center space-x-2'>
                    <img src={logo} alt="" className='w-10 h-10 rounded-full'/>
                    <h1 className='text-2xl font-bold text-orange-500'>NotesVerse</h1>
                </div>

                {/* right */}
                <div className='space-x-4'>
                    <Link to={"/login"} className='bg-transparent text-white py-2 px-4 border border-white rounded '>Login</Link>
                    <Link to={"/signup"} className='bg-transparent text-white py-2 px-4 border border-white rounded '>Signup</Link>
                </div>

            </header>

            {/* Main Section */}

            {/* section 1 */}
            <section className='text-center py-20 '>
                <h1 className='text-4xl font-semibold text-orange-500'>CourseVerse</h1>
                <br />
                <p className='text-gray-500 '>Sharpen Your skill with course crafted by experts.</p>
                <div className='space-x-4 mt-8'>
                    <button className='bg-green-500 text-white rounded font-semibold px-6 py-3 hover:bg-white hover:text-black duration-300'>Explore Courses</button>
                    <button className='bg-white text-black rounded font-semibold px-6 py-3  hover:bg-green-500 hover:text-white duration-300'>Courses Video </button>
                </div>
            </section>

            <section>section 2</section>
            <hr />

            {/* Footer */}
            <footer >
                <div className='text-gray-400 text-sm text-center py-4'>
                    Copyright © 2025 TermsFeed®. All rights reserved.
                </div>
            </footer>

        </div>
    </div>
  )
}

export default Home