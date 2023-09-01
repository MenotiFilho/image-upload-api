const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(cors());

// Set up multer storage for file uploads
const storage = multer.diskStorage({
	destination: './uploads/',
	filename: (req, file, cb) => {
		cb(null, `${Date.now()}-${file.originalname}`);
	},
});

const upload = multer({ storage });

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Handle file uploads
app.post('/upload', upload.single('file'), (req, res) => {
	const file = req.file;
	if (!file) {
		return res.status(400).json({ message: 'No file uploaded.' });
	}

	// Create an object containing the file information
	const fileInfo = {
		id: Date.now(),
		filename: file.filename,
		url: `/uploads/${file.filename}`,
		dateTime: new Date(),
	};

	res.json(fileInfo);
});

// Define a route to list all uploaded files with detailed information
app.get('/uploads', (req, res) => {
	// Read the contents of the 'uploads' directory
	fs.readdir('uploads', (err, files) => {
		if (err) {
			console.error('Error reading directory:', err);
			res.status(500).send('Internal Server Error');
		} else {
			// Create an array of objects containing detailed file information
			const fileDetails = files.map((filename) => {
				const filePath = `/uploads/${filename}`;
				const fileStats = fs.statSync(
					path.join(__dirname, 'uploads', filename)
				);

				return {
					filename,
					id: fileStats.ctimeMs,
					url: filePath,
					dateTime: fileStats.ctime,
				};
			});

			// Send the array of detailed file information as JSON
			res.json(fileDetails);
		}
	});
});

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
