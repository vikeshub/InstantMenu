const mongoose = require('mongoose');

const qrCodeSchema = new mongoose.Schema({
  restaurant_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true,
  },
  menu_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Menu',
    required: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
  },
  qr_url: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
}, { versionKey: false });

const QRCode = mongoose.model('QRCode', qrCodeSchema);

module.exports = QRCode;
