import app from './app';
import 'dotenv/config';

const { PORT } = process.env;

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
