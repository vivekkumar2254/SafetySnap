
const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema(
  {
    filename: { type: String, required: true },
    size: { type: Number, required: true },
    detections: [
      {
        label: { type: String, required: true },
        bbox: { type: [Number], required: true },
      },
    ],
    detections_hash: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Image', imageSchema);
