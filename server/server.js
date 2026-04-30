import express from 'express';
import cors from 'cors';
import pdfRoute from './routes/pdf.js';

const app = express();

app.use(cors({
  origin: ['http://localhost:3000']
}));

app.use('/api', pdfRoute);

const PORT = process.env.PORT || 3001;
app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.listen(PORT, () => {
  console.log(`InnoPulse PDF server running on port ${PORT}`);
});
