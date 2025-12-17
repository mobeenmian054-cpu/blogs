const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');

const multer = require('multer');
const path = require('path');

// Configure Multer Storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Get all blogs
router.get('/', async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ createdAt: -1 });
        res.json(blogs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get single blog
router.get('/:id', async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ message: 'Blog not found' });
        res.json(blog);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a blog
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const { title, content, author, excerpt } = req.body;
        let imageUrl = '';

        if (req.file) {
            imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        } else if (req.body.image) {
            // Fallback if image URL is manually provided (legacy support)
            imageUrl = req.body.image;
        }

        const blog = new Blog({
            title,
            content,
            author,
            excerpt,
            image: imageUrl
        });

        const newBlog = await blog.save();
        res.status(201).json(newBlog);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Like a blog
router.post('/:id/like', async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ message: 'Blog not found' });

        blog.likes += 1; // Simple increment for now
        await blog.save();
        res.json({ likes: blog.likes });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Comment on a blog
router.post('/:id/comment', async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ message: 'Blog not found' });

        const { user, text } = req.body;
        const newComment = { user, text };

        blog.comments.push(newComment);
        await blog.save();

        res.json(blog.comments);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
