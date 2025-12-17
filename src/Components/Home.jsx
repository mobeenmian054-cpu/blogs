import React, { useEffect, useState } from 'react';
import BlogCard from './BlogCard';
import { Link } from 'react-router';
import API_BASE_URL from '../config';

const Home = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/blogs`)
      .then(res => res.json())
      .then(data => setBlogs(data))
      .catch(err => console.error('Error fetching blogs:', err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pt-10">

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white border-b border-gray-100">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-white pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <span className="inline-block py-1 px-3 rounded-full bg-indigo-50 text-indigo-600 text-sm font-semibold mb-6 tracking-wide">
              WELCOME TO STORY NEST
            </span>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 tracking-tight leading-tight mb-8">
              Discover stories, <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
                thinking, and expertise.
              </span>
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 mb-10 leading-relaxed">
              A curated space for writers to share their thoughts, expertise, and tales.
              Read, write, and grow with a community of storytellers.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/showblogs" className="px-8 py-4 rounded-full bg-indigo-600 text-white font-semibold text-lg hover:bg-indigo-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
                Start Reading
              </Link>
              <Link to="/create" className="px-8 py-4 rounded-full bg-white text-gray-900 border border-gray-200 font-semibold text-lg hover:border-gray-300 hover:bg-gray-50 transition-all hover:-translate-y-1">
                Write a Story
              </Link>
            </div>
          </div>
        </div>
      </section>



    </div>
  )
}

export default Home

