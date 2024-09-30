const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes.js');
const taskRoutes = require('./routes/taskRoutes.js');

const app = express();
// Enable CORS for all routes
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://dhuwadhuruvan:Dhuwa@cluster0.ldcnj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    tls: true, // Enable TLS
}).then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("DB Connection Error: ", err));


// Routes
app.use('/api/users', userRoutes);
app.use('/api/task', taskRoutes);

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;
