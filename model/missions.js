var mongoose = require('mongoose');
var missionSchema = new mongoose.Schema({
  name: String,
  company: String,
  description: String,
});
mongoose.model('Mission', missionSchema);
