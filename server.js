const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware to parse JSON requests
app.use(bodyParser.json());
app.use(cors());

// MySQL database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'dummy',
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error('MySQL connection error:', err);
        throw err; // Throw the error to stop the application if there's a connection issue
    } else {
        console.log('Connected to MySQL database');
    }
});

// API endpoint for form submission
app.post('/submit-form', (req, res) => {
    const formData = req.body;
    console.log('Received form data:', formData);

    // Insert form data into the database
    const sql = 'INSERT INTO contact_form_data (name, email, mobile, message, age) VALUES (?, ?, ?, ?, ?)';
    const values = [formData.name, formData.email, formData.mobile, formData.message, formData.age];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('MySQL query error:', err);
            res.status(500).json({ error: 'Internal Server Error' }); // Send a JSON error response
        } else {
            console.log('Form submitted successfully!');
            res.status(200).json({ message: 'Form submitted successfully!' }); // Send a JSON success response
        }
    });
});

// Handle unhandled promise rejections globally
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    // Optionally, you can log the error or perform other actions here
});

// Start the server
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
