const express = require("express");
const cors = require("cors");
const { syncDatabase } = require("./models");
const routes = require("./routes");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", routes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Có lỗi xảy ra trên server",
    error: err.message,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Không tìm thấy route",
  });
});

// Start server
app.listen(PORT, async () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
  console.log(`API endpoint: http://localhost:${PORT}/api`);

  // Sync database
  await syncDatabase();
});

module.exports = app;
