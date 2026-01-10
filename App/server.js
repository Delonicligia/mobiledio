import "dotenv/config";
import app from "./app.js";
import connectDB from "./config/mongodb.js";

const PORT = process.env.PORT || 3000;
const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server berjalan pada port ${PORT} && database connected`);
  });
};

startServer();