const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true }, 
    email: { type: String, required: true, unique: true }, 
    task_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }], 
    address: { type: String, required: true }, 
    dateOfJoining: { type: Date, required: true }, 
    dob: { type: Date, required: true }, 
    phone: { type: String, required: true } 
});

const User = mongoose.model('User', userSchema);
module.exports = User;