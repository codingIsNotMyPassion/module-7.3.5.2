const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
require("express-async-errors");

// Db connection
const connectDb = require("./db/connect");

// Auth middleware
const authMiddleware = require("./middleware/authentication");

// Routers
const authRouter = require("./routes/auth");
const urlRouter = require("./routes/urls");

// Error handlers
const notFoundMiddleware = require("./middleware/not-found");
app.use(cors({ origin: "*" }));
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send(`
    <h1>URL Shortner</h1>
    <p><b>Auth endpoint</b>: /api/v1/auth</p>
    <p><b>Url shortner endpoint</b>: /api/v1/urls</p>
  `);
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1", urlRouter);
app.use(notFoundMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDb(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
