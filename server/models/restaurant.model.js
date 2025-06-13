const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  owner_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  owner_name: {
    type: String,
    required: true,
    trim: true
  },
  outlet_name: {
    type: String,
    required: true,
    trim: true
  },
  outlet_type: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  city: {
    type: String,
    trim: true
  },
  state: {
    type: String,
    trim: true
  },
  zip_code: {
    type: String,
    trim: true
  },
  country: {
    type: String,
    trim: true
  },
  logo_url: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

restaurantSchema.set('toJSON', {
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  }
});
restaurantSchema.set('toObject', {
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  }
});

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = Restaurant;
