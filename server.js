// const express = require('express');
// const cors = require('cors');
// const dotenv = require('dotenv');

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// app.use(cors());
// app.use(express.json());

// app.get('/api', (req, res) => {
//   res.json({ message: 'Welcome to the Node.js Backend!' });
// });

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });


import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/Auth.js';

dotenv.config();
connectDB();

const app = express();

app.use(cors({ origin: 'http://localhost:5175' }));
app.use(express.json());

app.use('/v1/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));