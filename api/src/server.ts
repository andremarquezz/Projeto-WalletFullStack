import app from './app';
import 'dotenv/config';

const { APP_PORT } = process.env;

app.listen(APP_PORT, () => {
  console.log(`Server is running on ${APP_PORT}`);
});
