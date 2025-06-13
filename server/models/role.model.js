const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
}, {
  versionKey: false // ✅ Disable __v completely
});

const Role = mongoose.model('Role', roleSchema);

module.exports = Role;
