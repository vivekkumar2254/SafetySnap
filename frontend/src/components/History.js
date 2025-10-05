import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Card, Row, Col, Form, Button, InputGroup, FormControl, Modal } from 'react-bootstrap';
import './History.css';

const History = () => {
  const [images, setImages] = useState([]);
  const [labels, setLabels] = useState([]);
  const [selectedLabel, setSelectedLabel] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  useEffect(() => {
    fetchImages();
    fetchLabels();
  }, [selectedLabel]);

  const fetchImages = async () => {
    try {
      const res = await axios.get('/api/images', {
        params: {
          label: selectedLabel,
        },
      });
      setImages(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchLabels = async () => {
    try {
      const res = await axios.get('/api/labels');
      setLabels(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFilter = () => {
    fetchImages();
  };

  const handleShowModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const filteredImages = images.filter((image) =>
    image.filename.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="history-container">
      <h2 className="mb-4">Image History</h2>
      <Form className="mb-4 filter-form">
        <Row>
          <Col md={6}>
            <Form.Group>
              <InputGroup>
                <FormControl
                  type="text"
                  placeholder="Search by filename..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Control
                as="select"
                value={selectedLabel}
                onChange={(e) => setSelectedLabel(e.target.value)}
              >
                <option value="">All Labels</option>
                {labels.map((label) => (
                  <option key={label} value={label}>
                    {label}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>
          <Col md={2}>
            <Button variant="primary" onClick={handleFilter} block>
              Filter
            </Button>
          </Col>
        </Row>
      </Form>
      <Row>
        {filteredImages.map((image) => (
          <Col key={image._id} sm={12} md={6} lg={4} className="mb-4">
            <Card className="shadow-sm image-card">
              <Card.Img
                variant="top"
                src={`/uploads/${image.filename}`}
                style={{ height: '200px', objectFit: 'cover', cursor: 'pointer' }}
                onClick={() => handleShowModal(`/uploads/${image.filename}`)}
              />
              <Card.Body>
                <Card.Title>{image.filename}</Card.Title>
                <Link to={`/result/${image._id}`} className="btn btn-outline-primary">
                  View Result
                </Link>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal show={showModal} onHide={handleCloseModal} centered size="md">
        <Modal.Body>
          <img src={selectedImage} alt="Full size" style={{ width: '100%' }} className="modal-image" />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default History;