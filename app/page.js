// pages/index.js
"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { Container, Card, CardMedia, CardContent, Typography, Button, TextField } from '@mui/material';
import Upload from './components/upload'


const socket = io('http://localhost:3001');

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3001/posts').then(response => {
      setPosts(response.data);
    });

    socket.on('new_post', post => {
      setPosts(prevPosts => [post, ...prevPosts]);
    });

    socket.on('update_like', postId => {
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post._id === postId ? { ...post, likes: post.likes + 1 } : post
        )
      );
    });

    socket.on('update_comment', ({ postId, comment }) => {
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post._id === postId ? { ...post, comments: [...post.comments, comment] } : post
        )
      );
    });

    return () => {
      socket.off('new_post');
      socket.off('update_like');
      socket.off('update_comment');
    };
  }, []);

  const handleLike = async (postId) => {
    await axios.post(`http://localhost:3001/like/${postId}`);
  };

  const handleComment = async (postId) => {
    await axios.post(`http://localhost:3001/comment/${postId}`, { comment: newComment });
    setNewComment('');
  };

  return (
    <Container>
      <Upload />
      {posts.map(post => (
        <Card key={post._id}>
          <CardMedia style={{width:"400px",height:"200px" ,margin:"10px"}} component="img" image={post.photoUrl} />
          <CardContent>
            <Typography style={{Size:"50px"}} variant="body2">{post.description}</Typography>
            <Button onClick={() => handleLike(post._id)} >Like ({post.likes})</Button>
            <div>
              <TextField
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                placeholder="Add a comment"
              />
              <Button onClick={() => handleComment(post._id)}>Comment</Button>
            </div>
            {post.comments.map((comment, index) => (
              <Typography key={index} variant="body2">{comment}</Typography>
            ))}
          </CardContent>
        </Card>
      ))}
    </Container>
  );
};

export default Home;
