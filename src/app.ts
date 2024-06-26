import express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.send('Hello King ABR');
});

export default app;
