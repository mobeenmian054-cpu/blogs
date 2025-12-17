import React, { useEffect, useState } from 'react';
import BlogCard from './BlogCard';
import { useNavigate } from 'react-router';
import API_BASE_URL from '../config';

const ShowBlogs = () => {
    const [blogs, setBlogs] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (!userInfo) {
            navigate('/login');
            return;
        }

        fetch(`${API_BASE_URL}/api/blogs`)
            .then(res => res.json())
            .then(data => setBlogs(data))
            .catch(err => console.error(err));
    }, [navigate]);

    return (
        <div className="bg-gray-50 min-h-screen py-12 pt-20">
            <div className="max-w-7xl mx-auto px-4">

                {/* Heading */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-800">
                        Latest Articles
                    </h1>
                    <p className="text-gray-500 mt-2">
                        Read our newest stories and insights
                    </p>
                </div>

                {/* Blog Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {blogs.map(blog => (
                        <BlogCard key={blog._id} blog={blog} />
                    ))}
                </div>

            </div>
        </div>
    );
};

export default ShowBlogs;
