import express from 'express';
import { createIssue , getIssues } from '../controllers/issueController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { createIssueValidator } from '../validators/issueValidator.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/issues'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

// File filter for images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only images are allowed'), false);
  }
};

const upload = multer({ storage, fileFilter });

const router = express.Router();

// Create issue (authenticated users only)
router.post('/', [authMiddleware(['citizen']), upload.single('photo'), ...createIssueValidator], createIssue);

router.get('/', authMiddleware(['municipal']), getIssues);

export default router;