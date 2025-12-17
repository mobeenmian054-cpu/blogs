import React from 'react';
import { Link } from 'react-router';

const BlogCard = ({ blog }) => {
    // Default image if none provided
    const imageSrc = blog.image || "https://images.unsplash.com/photo-1499750310159-5b5f87d46316?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80";

    return (
        <article className="group bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col h-full">
            <Link to={`/blog/${blog._id}`} className="block relative overflow-hidden h-56">
                <img
                    src={imageSrc}
                    alt={blog.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
            </Link>

            <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-4 uppercase tracking-wider">
                    <span className="text-indigo-600">Article</span>
                    <span>•</span>
                    <span>{new Date(blog.createdAt || Date.now()).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-tight">
                    <Link to={`/blog/${blog._id}`}>
                        {blog.title}
                    </Link>
                </h3>

                <p className="text-gray-600 line-clamp-3 mb-6 flex-grow text-base leading-relaxed">
                    {blog.excerpt}
                </p>

                <div className="flex items-center justify-between pt-6 border-t border-gray-100 mt-auto">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500">
                            {blog.author ? blog.author.charAt(0).toUpperCase() : 'A'}
                        </div>
                        <span className="text-sm font-medium text-gray-900">{blog.author || 'Anonymous'}</span>
                    </div>
                </div>
            </div>
        </article>
    );
};

export default BlogCard;
