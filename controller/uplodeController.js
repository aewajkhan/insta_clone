const express = require('express');
const multer = require('multer');
const Post = require('../model/fileModel');
const router = express.Router();
const upload=require("../middleware/uploade")





router.get('/posts', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/upload', upload.single('photo'), async (req, res) => {
  try {
    const description = req.body.description;
    const photoUrl = `http://localhost:3001/uploads/${req.file.filename}`;

    const post = new Post({ description, photoUrl });
    await post.save();

    req.app.get('io').emit('new_post', post);

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/like/:id', async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);

    if (post) {
      post.likes += 1;
      await post.save();

      req.app.get('io').emit('update_like', postId);

      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/comment/:id', async (req, res) => {
  try {
    const postId = req.params.id;
    const comment = req.body.comment;
    const post = await Post.findById(postId);

    if (post) {
      post.comments.push(comment);
      await post.save();

      req.app.get('io').emit('update_comment', { postId, comment });

      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
