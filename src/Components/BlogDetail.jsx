import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { FaHeart, FaRegHeart, FaComment, FaArrowLeft } from 'react-icons/fa';

import API_BASE_URL from '../config';

const BlogDetail = () => {
    const { id } = useParams();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState('');
    const [likes, setLikes] = useState(0); // Initialize with 0
    const [isLiked, setIsLiked] = useState(false); // Local state for immediate feedback
    const [comments, setComments] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (!userInfo) {
            navigate('/login');
            return;
        }

        fetch(`${API_BASE_URL}/api/blogs/${id}`)
            .then(res => res.json())
            .then(data => {
                setBlog(data);
                setLikes(data.likes);
                setComments(data.comments);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [id, navigate]);

    const handleLike = () => {
        fetch(`${API_BASE_URL}/api/blogs/${id}/like`, { method: 'POST' })
            .then(res => res.json())
            .then(data => {
                setLikes(data.likes);
                setIsLiked(true); // Persist like visually (simple toggle not fully implemented in backend unique user check)
            })
            .catch(err => console.error(err));
    };

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const username = userInfo ? userInfo.username : "Guest User";

        fetch(`${API_BASE_URL}/api/blogs/${id}/comment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user: username, text: newComment })
        })
            .then(res => res.json())
            .then(data => {
                setComments(data); // Backend returns updated comments array
                setNewComment('');
            })
            .catch(err => console.error(err));
    };

    if (loading) return <div className="text-center py-20">Loading...</div>;
    if (!blog) return <div className="text-center py-20 text-2xl">Blog post not found!</div>;

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <Link to="/" className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-6">
                <FaArrowLeft className="mr-2" /> Back to Home
            </Link>

            <article className="bg-white rounded-lg shadow-lg overflow-hidden">
                <img src={blog.image} alt={blog.title} className="w-full h-96 object-cover" />

                <div className="p-8">
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <span>by {blog.author}</span>
                        <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                    </div>

                    <h1 className="text-4xl font-bold text-gray-900 mb-6">{blog.title}</h1>

                    <div className="prose max-w-none text-gray-800 text-lg leading-relaxed mb-8">
                        {blog.content}
                    </div>

                    {/* Like Section */}
                    <div className="flex items-center border-t border-b border-gray-200 py-4 mb-8">
                        <button
                            onClick={handleLike}
                            className={`flex items-center gap-2 text-xl font-medium transition-colors ${isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
                        >
                            <FaHeart className={isLiked ? "text-red-500" : ""} />
                            <span>{likes} Likes</span>
                        </button>
                    </div>

                    {/* Comment Section */}
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <FaComment className="text-indigo-600" />
                            Comments ({comments.length})
                        </h3>

                        {/* Comment List */}
                        <div className="space-y-6 mb-8">
                            {comments.length === 0 ? (
                                <p className="text-gray-500 italic">No comments yet. Be the first to share your thoughts!</p>
                            ) : (
                                comments.map((comment, index) => (
                                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                                        <h4 className="font-bold text-gray-900">{comment.user}</h4>
                                        <p className="text-gray-700 mt-1">{comment.text}</p>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Add Comment Form */}
                        <form onSubmit={handleCommentSubmit} className="bg-gray-50 p-6 rounded-lg">
                            <h4 className="text-lg font-medium text-gray-900 mb-4">Leave a Comment</h4>
                            <div className="mb-4">
                                <textarea
                                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                    rows="4"
                                    placeholder="Write your comment here..."
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    required
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Post Comment
                            </button>
                        </form>
                    </div>
                </div>
            </article>
        </div>
    );
};

export default BlogDetail;
