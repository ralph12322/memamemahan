import express from 'express';
import cors from 'cors';
import translateRoute from './routes/translateRoute.js'
import 'dotenv/config';



const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: ['https://emovox.vercel.app', 'http://localhost:5174'],
}));

app.use(express.json());


// app.post('/translate', translateRoute); app.use dapat kasi nasa server ka palang
app.use('/translate', translateRoute)
app.use('/', (req, res) => {
  res.send('Working')
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
