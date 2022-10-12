const mongoose = require('mongoose');
const missionSchema = new mongoose.Schema({
  name: String,
  company: String,
  description: String,
  image: String,
});
mongoose.model('Mission', missionSchema);
