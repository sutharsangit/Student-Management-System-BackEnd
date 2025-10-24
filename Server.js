// const express = require('express');
// const cors = require('cors');

// const app = express();
// app.use(cors());
// app.use(express.json());

// let books = [
//   { id: 1, bookName: "JavaScript", quantity: 10 },
//   { id: 2, bookName: "React", quantity: 15 },
//   { id: 3, bookName: "NodeJS", quantity: 20 }
// ];

// // Welcome route
// app.get('/', (req, res) => {
//   res.send("Book Management System");
// });

// // Get all books
// app.get('/books', (req, res) => {
//   res.json(books);
// });

// // Add new book
// app.post('/books', (req, res) => {
//   const newBook = req.body;
//   books.push(newBook);
//   res.json({ message: "Book added successfully", books });
// });

// // Update book details
// app.put('/books/:id', (req, res) => {
//   const bookId = parseInt(req.params.id);
//   const book = books.find(b => b.id === bookId);
//   if (book) {
//     book.quantity = req.body.quantity;
//     res.json({ message: "Book updated successfully", books });
//   } else {
//     res.status(404).json({ message: "Book not found" });
//   }
// });

// // Delete a book
// app.delete('/books/:id', (req, res) => {
//   const bookId = parseInt(req.params.id);
//   const found = books.find(b => b.id === bookId);

//   if (found) {
//     books = books.filter(b => b.id !== bookId);
//     res.json({ message: "Book deleted successfully", books });
//   } else {
//     res.status(404).json({ message: "Book not found" });
//   }
// });

// app.listen(3748, () =>
//   console.log("✅ Backend running on http://localhost:3748")
// );


const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/studentsDB', )
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Define Student schema and model
const studentSchema = new mongoose.Schema({
    id: Number,
    name: String,
    email: String,
    age: Number,
    gender: String,
    course: String,
    year: Number,
    GPA: Number,
});

const Student = mongoose.model('Student', studentSchema);

// Get all students
app.get('/students', async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching students' });
    }
});

// Get student by ID
app.get('/students/:id', async (req, res) => {
    try {
        const student = await Student.findOne({ id: parseInt(req.params.id) });
        if (student) {
            res.json(student);
        } else {
            res.status(404).json({ message: 'Student Not Found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error fetching student' });
    }
});

// Add new student
app.post('/students', async (req, res) => {
    try {
        const newStudent = new Student(req.body);
        await newStudent.save();
        res.status(201).json({ message: 'Student Added Successfully', student: newStudent });
    } catch (err) {
        res.status(500).json({ message: 'Error adding student' });
    }
});

// Update student by ID
app.put('/students/:id', async (req, res) => {
    try {
        const updatedStudent = await Student.findOneAndUpdate(
            { id: parseInt(req.params.id) },
            req.body,
            { new: true }
        );
        if (updatedStudent) {
            res.json({ message: 'Student Updated Successfully', student: updatedStudent });
        } else {
            res.status(404).json({ message: 'Student not Found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error updating student' });
    }
});

// Delete student by ID
app.delete('/students/:id', async (req, res) => {
    try {
        const result = await Student.deleteOne({ id: parseInt(req.params.id) });
        if (result.deletedCount > 0) {
            res.json({ message: 'Student deleted successfully' });
        } else {
            res.status(404).json({ message: 'Student not Found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error deleting student' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log('Running at http://localhost:${',PORT,'}');
});