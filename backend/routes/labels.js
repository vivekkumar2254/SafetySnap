
const router = require('express').Router();
const Image = require('../models/Image');

router.get('/', async (req, res) => {
  try {
    const labels = await Image.distinct('detections.label');
    res.json(labels);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
