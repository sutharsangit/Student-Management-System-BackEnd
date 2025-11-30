const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require("dotenv");
dotenv.config()
const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected: " + conn.connection.name);
  } catch (err) {
    console.error("MongoDB connection error: " + err.message);
  }
};

connectDB();

// Book Schema & Model
const bookSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  bookname: { type: String, required: true },
  quantity: { type: Number, required: true }
});

const Book = mongoose.model("Books", bookSchema);

// Test route
app.get("/", (req, res) => res.send("Book API running"));

// GET all books
app.get("/books", async (req, res) => {
  try {
    const books = await Book.find({}, { _id: 0, __v: 0 });
    res.json(books);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// GET single book by ID
app.get("/books/:bid", async (req, res) => {
  const id = parseInt(req.params.bid);
  try {
    const book = await Book.findOne({ id }, { _id: 0, __v: 0 });
    if (!book) return res.status(404).json({ msg: "Book not found" });
    res.json(book);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// POST create new book
app.post("/books", async (req, res) => {
  try {
    const { id, bookname, quantity } = req.body;

    if (id == null || !bookname || quantity == null) {
      return res.status(400).json({ msg: "All fields required" });
    }

    const exists = await Book.findOne({ id });
    if (exists) return res.status(400).json({ msg: "Book ID already exists" });

    const newBook = new Book({ id, bookname, quantity });
    await newBook.save();
    res.json({ book: newBook, msg: "Book added successfully" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// PUT update book
app.put("/books/:bid", async (req, res) => {
  const id = parseInt(req.params.bid);
  try {
    const result = await Book.updateOne({ id }, { $set: req.body });
    if (result.matchedCount === 0) return res.status(404).json({ msg: "Book not found" });
    res.json({ msg: "Book updated successfully" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// DELETE book
app.delete("/books/:bid", async (req, res) => {
  const id = parseInt(req.params.bid);
  try {
    const result = await Book.deleteOne({ id });
    if (result.deletedCount === 0) return res.status(404).json({ msg: "Book not found" });
    res.json({ msg: "Book deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
