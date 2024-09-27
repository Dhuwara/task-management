const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: String,
    description: String,
    status: String,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Reference to user
});

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;


