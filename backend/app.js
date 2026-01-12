const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const blogRoutes = require("./routes/blogRoutes");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());

// routes
app.use("/auth", authRoutes);
app.use("/", blogRoutes);

// health check
app.get("/health", (req, res) => res.json({ ok: true }));

// error handler (must be last)
app.use(errorHandler);

module.exports = app;  
