import 'dotenv/config';

import app from './src/app.js';
import connectDB from './src/config/db.js';
const PORT = process.env.PORT || 5000;

// Connect to MongoDB Database
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`========================================================`);
      console.log(`  TravelMind AI Backend Agent Server running on port ${PORT}`);
      console.log(`  Environment: Production/Hackathon Ready`);
      console.log(`  Process ID: ${process.pid}`);
      console.log(`========================================================`);
    });
  })
  .catch((err) => {
    console.error('CRITICAL: Database connection failed. Server shutting down.', err);
    process.exit(1);
  });