import express from 'express';
import multer from 'multer';
import path from 'path';
import cors from 'cors';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());

// Set up multer storage for file uploads
const storage = multer.diskStorage({
	destination: path.join(__dirname, 'uploads'), // Use path.join with __dirname
	filename: (req, file, cb) => {
		cb(null, `${Date.now()}-${file.originalname}`);
	},
});

const upload = multer({ storage });

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Handle file uploads
app.post('/upload', upload.single('file'), async (req, res) => {
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

	// Save the fileInfo to Firestore
	try {
		const docRef = await db.collection('images').add(fileInfo);
		fileInfo.id = docRef.id; // Update the ID with Firestore's generated ID
		res.json(fileInfo);
	} catch (error) {
		console.error('Error saving to Firestore:', error);
		res.status(500).send('Internal Server Error');
	}
});

// Define a route to list all uploaded files with detailed information
app.get('/uploads', async (req, res) => {
	try {
		const snapshot = await db.collection('images').get();

		const fileDetails = snapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
		}));

		res.json(fileDetails);
	} catch (err) {
		console.error('Error reading Firestore:', err);
		res.status(500).send('Internal Server Error');
	}
});

// Define a route for the root URL to display a "Hello, World!" page
app.get('/', (req, res) => {
	res.send('<h1>This is a server for images</h1>');
});

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
