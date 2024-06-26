import { Config } from './config';
import app from './app';

const startServer = async () => {
  try {
    await app.listen(Config.PORT, () => {
      console.log(`Server is running on port ${Config.PORT}.`);
    });
  } catch (error) {
    console.error(`Error starting server: ${error}`);
    process.exit(1);
  }
};

startServer();
