import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import webhookHandler from './webhookHandler.js';
import connectDB from './utils/db.js';

dotenv.config();
const app = express();
app.use(bodyParser.json());

app.post('/webhook', webhookHandler);

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
