import express from 'express';
import dotenv from 'dotenv';
import routes from './routes';
dotenv.config();

const app = express();
app.use(express.json());
app.use('/api', routes);

app.get('/', (req: express.Request, res: express.Response) => {
  res.send('Taxi backend running!');
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 