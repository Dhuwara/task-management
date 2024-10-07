// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes.js');
const taskRoutes = require('./routes/taskRoutes.js');

const app = express();
// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Create a function to connect to the database
if(process.env.NODE_ENV !== 'test'){
 
       mongoose.connect('mongodb+srv://dhuwadhuruvan:Dhuwa@cluster0.ldcnj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
            tls: true, // Enable TLS
        });
        console.log("Connected to MongoDB");
  
}



// Routes
app.use('/api/users', userRoutes);
app.use('/api/task', taskRoutes);

const PORT = 5000;

if(require.main === module){
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

}

module.exports = app
