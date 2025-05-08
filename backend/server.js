import express from 'express';
import cors from 'cors';
import translateRoute from './routes/translateRoute.js' //using translationg api here go to controllers to see the api

// npm install express cors @vitalets/google-translate-api

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: 'https://emovox.vercel.app',
})); // yung frontend URL origin ang i specify


app.use(express.json());


app.post('/translate', translateRoute);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
