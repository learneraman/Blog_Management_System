require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");
const seedDB = require("./utils/seedDB");

const PORT = process.env.PORT || 5000;
// const URI = "http://localhost:" + PORT;

if (process.env.NODE_ENV !== "test") {
  (async () => {
    try {
      await connectDB(process.env.MONGO_URI); // connect once
      await seedDB(); // seed default admin & blog
      app.listen(PORT, () => {
        // console.log(`MongoDB connected to ${URI}`);
        console.log(`Server running on port ${PORT}`);
      });
    } catch (err) {
      console.error("Failed to start server:", err);
      process.exit(1);
    }
  })();
}
