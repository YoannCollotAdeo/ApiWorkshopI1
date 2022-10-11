var mongoose = require('mongoose');
var missionSchema = new mongoose.Schema({
  name: String,
  company: String,
});
mongoose.model('Mission', missionSchema);
