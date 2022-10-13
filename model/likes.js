const mongoose = require('mongoose');
const likeSchema = new mongoose.Schema({
    employeeId: String,
    missionId: String
});
mongoose.model('Like', likeSchema);
