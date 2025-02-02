const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();

// Create upload folders if they don't exist
const createFolder = (folder) => {
  const folderPath = path.join(__dirname, 'uploads', folder);
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
};

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Ensure that the target folder exists before saving the file
    const folder = req.body.folder || 'default';
    createFolder(folder); // Create folder dynamically based on the form data
    cb(null, path.join(__dirname, 'uploads', folder));
  },
  filename: (req, file, cb) => {
    // Rename the file with a timestamp
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Middleware to serve static files
app.use('/uploads', express.static('uploads')); // Serve files from the 'uploads' folder

// Upload Route
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  // Return the URL of the uploaded file
  res.json({
    message: 'File uploaded successfully',
    file_url: `http://localhost:5000/uploads/${req.body.folder || 'default'}/${req.file.filename}`
  });
});

// Start Server
app.listen(5000, () => console.log('Server running on port 5000'));
