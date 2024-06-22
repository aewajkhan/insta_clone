// components/Upload.js
"use client";

import { useState } from 'react';
import axios from 'axios';
import { Button, TextField } from '@mui/material';

const Upload = () => {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState('');

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('photo', file);
    formData.append('description', description);

    try {
      const response = await axios.post('http://localhost:3001/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log(response.data);
      setFile(null);
      setDescription('');
    } catch (error) {
      console.error("There was an error uploading the file!", error);
    }
  };

  return (
    <div style={{margin:"10px"}}>
      <input type="file" onChange={handleFileChange} />
      <TextField
      m
        value={description}
        style={{backgroundColor:"gray",borderRadius:"10px"}}
        onChange={e => setDescription(e.target.value)}
        placeholder="Add a description"
      />
      <Button style={{border:"1px solid blue", borderRadius:"10px",padding:"10px",marginLeft:"10px"}} onClick={handleUpload}>Upload</Button>
    </div>
  );
};

export default Upload;
