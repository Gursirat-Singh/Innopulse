import express from 'express';
import cors from 'cors';
import pdfRoute from './routes/pdf.js';
process.on('uncaughtException', (err) => {
  console.error('CRASH:', err.message);
  console.error(err.stack);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED:', err.message);
  console.error(err.stack);
  process.exit(1);
});
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

app.use('/api', pdfRoute);

const PORT = process.env.PORT || 4000;

app.options('*', cors());
app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.listen(PORT, () => {
  console.log("Server running on port PORT");
}).on('error', (err) => {
  console.error('Listen error:', err);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection:', err);
});
