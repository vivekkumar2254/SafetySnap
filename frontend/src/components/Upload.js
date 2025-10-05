
import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import { Form, Button, Alert, Image } from 'react-bootstrap';
import './Upload.css';

const Upload = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const onDrop = useCallback((acceptedFiles) => {
    const selectedFile = acceptedFiles[0];
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await axios.post('/api/images', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSuccess(`Image uploaded successfully. ID: ${res.data.id}`);
      setError('');
      setFile(null);
      setPreview(null);
    } catch (err) {
      setError('Error uploading image');
      setSuccess('');
    }
  };

  return (
    <div className="upload-container">
      <h2 className="mb-4">Upload Image</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Form onSubmit={handleSubmit}>
        <div
          {...getRootProps()}
          className={`dropzone ${isDragActive ? 'active' : ''}`}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <p>Drop files here or click to upload.</p>
          )}
        </div>
        {preview && (
          <div className="mt-4 text-center">
            <Image src={preview} className="preview-image" />
          </div>
        )}
        <Button type="submit" className="upload-button mt-4" disabled={!file}>
          Upload
        </Button>
      </Form>
    </div>
  );
};

export default Upload;
