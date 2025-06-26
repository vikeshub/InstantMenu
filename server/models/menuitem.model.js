const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  menu_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Menu',
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  price: {
    type: mongoose.Schema.Types.Decimal128,
    required: true,
  },
  image_url: {
    type: String,
    default: '',
  },
  is_available: {
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

const MenuItem = mongoose.model('MenuItem', menuItemSchema);

module.exports = MenuItem;
