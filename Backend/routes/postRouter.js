const express = require("express");
const postRoute = express.Router();
const {PostModel} = require("../model/post.model");
const multer = require("multer")

// Set up multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/') // Specify the directory to save uploads
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname) // Rename uploaded file
    }
});

const upload = multer({ storage: storage });

// Get all posts
postRoute.get('/api/posts', async (req, res) => {
    try {
        const posts = await PostModel.find();
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get posts by pagination
postRoute.get('/api/posts', async (req, res) => {
    try {
        const page = parseInt(req.query.page ) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const posts = await PostModel.find().skip((page - 1) * limit).limit(limit);
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Get posts by category
postRoute.get('/api/posts', async (req, res) => {
    try {
        const category = req.query.category || 'design';
        const posts = await PostModel.find({ category });
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Get posts by title
postRoute.get('/api/posts/title=:title', async (req, res) => {
    try {
        const title = req.params.title;
        const posts = await PostModel.find({ title: { $regex: title, $options: 'i' } });
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create a new post
postRoute.post('/api/posts', upload.array('media', 10), async (req, res) => {
    try {
        const { user_id, title, category, content } = req.body;
        const media = req.files ? req.files.map(file => file.path) : []; // Check if files are uploaded
        const post = new PostModel({ user_id, title, category, content, media });
        await post.save();
        res.status(201).json({ message: 'Post created successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Update a post
postRoute.put('/api/posts/:post_id', async (req, res) => {
    try {
        const {postId} = req.params;
        const { title, category, content, media } = req.body;
        await PostModel.findByIdAndUpdate({_id : postId}, { title, category, content, media });
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a post
postRoute.delete('/api/posts/:post_id', async (req, res) => {
    try {
        const {postId} = req.params;
        await PostModel.findByIdAndDelete({_id:postId});
        res.status(202).json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Like a post
postRoute.post('/api/posts/:post_id/like', async (req, res) => {
    try {
        const {postId} = req.params;
        const userId = req.user._id; // Assuming user ID is available in req.user after authentication
        const post = await PostModel.findById({_id: postId});

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        if (post.likes.includes(userId)) {
            return res.status(400).json({ message: "You have already liked this post" });
        }

        post.likes.push(userId);
        await post.save();

        res.status(201).json({ message: 'Post liked successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Comment on a post
postRoute.post('/api/posts/:post_id/comment', async (req, res) => {
    try {
        const {postId} = req.params;
        const { user_id, comment } = req.body;
        const post = await PostModel.findById({_id: postId});

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const newComment = {
            user_id: user_id, // Assuming user ID is available in the request body
            comment: comment,
            created_at: new Date()
        };

        post.comments.push(newComment);
        await post.save();

        res.status(201).json({ message: 'Comment added successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports ={
    postRoute
}