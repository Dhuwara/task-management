const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }] // Reference to tasks
});

const User = mongoose.model('User', userSchema);
module.exports = User;