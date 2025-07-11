const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema(
  {
    menu_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Menu",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    price: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
    },
    discounted_price: {
      type: mongoose.Schema.Types.Decimal128,
      required: false,
    },
    status: {
      type: String, 
      enum: ["NoStatus", "Special", "New", "Offer", "Seasonal", "Bestseller"],
      default: "NoStatus",
    },
    item_type: {
      type: String, 
      enum: ["veg", "non-veg", "not-defined"],
      default: "not-defined",
    },
    image_url: {
      type: String,
      default: "",
    },
    is_available: {
      type: Boolean,
      default: true,
    },
    //advanced options
    spicy_level: {
      type: String,
      enum: ["Mild", "Medium", "Hot", "Extra Hot"],
      default: "Mild",
    },
    addons: [
      {
        name: {
          type: String,
          required: true,
        },
        price: {
          type: mongoose.Schema.Types.Decimal128,
          required: true,
        },
      },
    ],
    ingredients: {
      type: [String],
      required: false,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
    updated_at: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false }
);

const MenuItem = mongoose.model("MenuItem", menuItemSchema);

module.exports = MenuItem;
