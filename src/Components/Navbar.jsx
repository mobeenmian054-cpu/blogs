import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router'
import { FaFacebookF, FaWhatsapp, FaInstagram } from "react-icons/fa";

const Navbar = () => {
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = () => {
      const user = localStorage.getItem('userInfo');
      if (user) {
        setUserInfo(JSON.parse(user));
      } else {
        setUserInfo(null);
      }
    };

    checkUser();

    // Listen for custom event to update state immediately
    window.addEventListener('storage', checkUser);
    window.addEventListener('authChange', checkUser);

    return () => {
      window.removeEventListener('storage', checkUser);
      window.removeEventListener('authChange', checkUser);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    setUserInfo(null);
    navigate('/login');
    // Dispatch event or just simple local update
  };
  return (
    <nav className='fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 transition-all duration-300'>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <Link to="/" className="flex-shrink-0 group">
            <h1 className='text-3xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent tracking-tight group-hover:opacity-80 transition-opacity'>
              Story Nest
            </h1>
          </Link>

          {/* Center Navigation */}
          <div className='hidden md:flex items-center gap-8'>
            <Link to="/" className='text-gray-600 hover:text-indigo-600 font-medium text-sm lg:text-base transition-colors relative group'>
              Home
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
            </Link>
            <Link to="/about" className='text-gray-600 hover:text-indigo-600 font-medium text-sm lg:text-base transition-colors relative group'>
              About
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
            </Link>
            <Link to="/create" className='text-gray-600 hover:text-indigo-600 font-medium text-sm lg:text-base transition-colors relative group'>
              Write
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
            </Link>
            <Link to="/contact" className='text-gray-600 hover:text-indigo-600 font-medium text-sm lg:text-base transition-colors relative group'>
              Contact
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
            </Link>
          </div>

          {/* Right Section: Auth & Socials */}
          <div className='flex items-center gap-6'>
            {/* Social Icons - Hidden on small screens to save space */}
            <div className='hidden lg:flex gap-4 text-gray-400'>
              <a href="https://facebook.com" target="_blank" className='hover:text-blue-600 transition-colors'><FaFacebookF /></a>
              <a href="https://wa.me/1234567890" target="_blank" className='hover:text-green-500 transition-colors'><FaWhatsapp size={18} /></a>
              <a href="https://instagram.com" target="_blank" className='hover:text-pink-500 transition-colors'><FaInstagram size={18} /></a>
            </div>

            <div className="h-6 w-px bg-gray-200 hidden lg:block"></div>

            <div className='flex items-center gap-3'>
              {userInfo ? (
                <div className="flex items-center gap-4">
                  <span className="text-gray-700 font-medium hidden sm:block">Hello, {userInfo.username}</span>
                  <button
                    onClick={handleLogout}
                    className='px-5 py-2.5 rounded-full bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-all'
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <>
                  <Link to="/login" className='hidden sm:block px-4 py-2 text-gray-600 hover:text-indigo-600 font-medium transition-colors'>
                    Login
                  </Link>
                  <Link to="/register" className='px-5 py-2.5 rounded-full bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5'>
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>

        </div>
      </div>
    </nav>
  )
}

export default Navbar
