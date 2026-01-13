import express from "express";
import { json } from "body-parser";
import { someMiddleware } from "./middleware"; // Assuming you have some middleware to use

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(json());
app.use(someMiddleware);

// Main application logic
app.get("/", (req, res) => {
  res.send("Welcome to my web application!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});