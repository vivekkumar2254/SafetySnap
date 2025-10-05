import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Card, ListGroup, ListGroupItem, Row, Col, Badge } from 'react-bootstrap';
import './Result.css';

const Result = () => {
  const [image, setImage] = useState(null);
  const { id } = useParams();
  const imageRef = useRef(null);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const res = await axios.get(`/api/images/${id}`);
        setImage(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchImage();
  }, [id]);

  const renderDetections = () => {
    if (!image || !image.detections || !imageRef.current) return null;

    const { naturalWidth, naturalHeight } = imageRef.current;
    const scaleX = imageRef.current.clientWidth / naturalWidth;
    const scaleY = imageRef.current.clientHeight / naturalHeight;

    return image.detections.map((detection, index) => {
      const [x, y, width, height] = detection.bbox;
      const style = {
        left: `${x * scaleX}px`,
        top: `${y * scaleY}px`,
        width: `${width * scaleX}px`,
        height: `${height * scaleY}px`,
      };

      return (
        <div key={index} className="detection-box" style={style}>
          <Badge variant="primary">{detection.label}</Badge>
        </div>
      );
    });
  };

  if (!image) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  return (
    <div className="result-container">
      <h2 className="mb-4">Detection Result</h2>
      <Row>
        <Col md={8}>
          <Card className="shadow-sm image-card">
            <Card.Body>
              <img
                ref={imageRef}
                src={`/uploads/${image.filename}`}
                alt={image.filename}
                style={{ width: '100%' }}
                onLoad={renderDetections}
              />
              {renderDetections()}
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow-sm details-card">
            <Card.Header>Details</Card.Header>
            <ListGroup variant="flush">
              <ListGroup.Item>Filename: {image.filename}</ListGroup.Item>
              <ListGroup.Item>Size: {image.size} bytes</ListGroup.Item>
            </ListGroup>
          </Card>
          <Card className="shadow-sm mt-4 detections-card">
            <Card.Header>Detections</Card.Header>
            <ListGroup variant="flush">
              {image.detections.map((detection, index) => (
                <ListGroup.Item key={index}>
                  <Badge variant="primary" className="mr-2">{detection.label}</Badge>
                  <small>BBox: {detection.bbox.join(', ' )}</small>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Result;