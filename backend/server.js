
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI || 'mongodb://localhost:27017/safetysnap';
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
});

const imagesRouter = require('./routes/images');
const labelsRouter = require('./routes/labels');


app.use('/api/images', imagesRouter);
app.use('/api/labels', labelsRouter);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
