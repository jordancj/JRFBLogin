import express, { Request, Response } from 'express';
import cors from 'cors';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
console.log(process.env.COSMOS_DB_URI);

app.use(cors());
app.use(express.json());

const client = new MongoClient(process.env.COSMOS_DB_URI!);
client.connect().then(() => {
  const db = client.db('jrfbActivityLogger');
  const usersCollection = db.collection('Usernames');

  app.post('/login', async (req: Request, res: Response) => {
    try {
      const { username } = req.body;
      const user = await usersCollection.findOne({ username });

      if (user) {
        res.status(200).json({ success: true });
      } else {
        res.status(401).json({ success: false, message: 'Authentication failed' });
      }
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ success: false, message: 'An error occurred' });
    }
  });

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}).catch((err) => {
  console.error('Failed to connect to database:', err);
});