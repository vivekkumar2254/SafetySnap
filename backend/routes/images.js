const router = require('express').Router();
const multer = require('multer');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const Image = require('../models/Image');

const storage = multer.memoryStorage();
const upload = multer({ storage });

const getRandomDetections = () => {
  const labels = ['helmet', 'vest', 'person', 'car', 'road'];
  const detections = [];
  const numDetections = Math.floor(Math.random() * 5) + 1;

  for (let i = 0; i < numDetections; i++) {
    const label = labels[Math.floor(Math.random() * labels.length)];
    const bbox = [
      Math.random() * 100,
      Math.random() * 100,
      Math.random() * 100,
      Math.random() * 100,
    ];
    detections.push({ label, bbox });
  }
  return detections;
};

router.post('/', upload.single('image'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileBuffer = file.buffer;
    const hash = crypto.createHash('sha256').update(fileBuffer).digest('hex');

    // check duplicate
    const existingImage = await Image.findOne({ detections_hash: hash });
    if (existingImage) {
      return res.status(200).json({ id: existingImage._id });
    }

    const detections = getRandomDetections();

    // ✅ FIXED PATH
    const uploadPath = path.join(
      __dirname,
      '..',
      '..',
      'frontend',
      'public',
      'uploads',
      file.originalname
    );

    // make sure folder exists
    fs.mkdirSync(path.dirname(uploadPath), { recursive: true });

    // save file
    fs.writeFileSync(uploadPath, fileBuffer);

    const newImage = new Image({
      filename: file.originalname,
      size: file.size,
      detections,
      detections_hash: hash,
    });

    const savedImage = await newImage.save();
    res.status(201).json({ id: savedImage._id });
  } catch (error) {
    console.error('Error during image upload:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/', async (req, res) => {
  try {
    const { limit = 10, offset = 0, label, from, to } = req.query;

    const query = {};
    if (label) query['detections.label'] = label;
    if (from && to) {
      query.createdAt = { $gte: new Date(from), $lte: new Date(to) };
    } else if (from) {
      query.createdAt = { $gte: new Date(from) };
    } else if (to) {
      query.createdAt = { $lte: new Date(to) };
    }

    const images = await Image.find(query)
      .sort({ createdAt: -1 })
      .skip(parseInt(offset))
      .limit(parseInt(limit));

    res.json(images);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) return res.status(404).json({ error: 'Image not found' });
    res.json(image);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const image = await Image.findByIdAndDelete(req.params.id);
    if (!image) return res.status(404).json({ error: 'Image not found' });
    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
