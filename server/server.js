import express from 'express';
import cors from 'cors';
import pdfRoute from './routes/pdf.js';

const app = express();

app.use(cors({
  origin: [
    'https://innopulse-puce.vercel.app',
    'http://localhost:3000'
  ],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Authorization', 'Content-Type'],
  credentials: true
}));

app.options('*', cors());
