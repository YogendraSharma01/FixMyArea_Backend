import { validationResult } from 'express-validator';
import Issue from '../models/Issue.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createIssue = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { issueTitle, issueDescription, category, priority, address } = req.body;
  const userId = req.user.userId; // From authMiddleware

  try {
    const issue = new Issue({
      issueTitle,
      issueDescription,
      category,
      priority,
      address,
      userId,
      photo: req.file ? `/uploads/issues/${req.file.filename}` : null,
    });

    await issue.save();
    res.status(201).json({ message: 'Issue reported successfully', issue });
  } catch (error) {
    console.error('Issue creation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


export const getIssues = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 6;
      const skip = (page - 1) * limit;
  
      const totalIssues = await Issue.countDocuments();
      const issues = await Issue.find()
        .populate('userId', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
  
      res.json({
        issues,
        totalPages: Math.ceil(totalIssues / limit),
        currentPage: page,
        totalIssues,
      });
    } catch (error) {
      console.error('Error fetching issues:', error);
      res.status(500).json({ message: 'Server error' });
    }
};