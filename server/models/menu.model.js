const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
  restaurant_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  is_active: {
    type: Boolean,
    default: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
}, { versionKey: false });

const Menu = mongoose.model('Menu', menuSchema);

module.exports = Menu;
