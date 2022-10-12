const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    companyId: String,
});
mongoose.model('User', userSchema);
