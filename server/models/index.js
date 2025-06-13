const mongoose = require('mongoose');
const dbConfig = require('../config/db.config');
const Role = require('./role.model');
const User = require('./user.model');

const db = {};
db.mongoose = mongoose;
db.Role = Role;
db.User = User;

db.ROLES = ['admin', 'restaurant_owner', 'staff', 'customer']; // Define available roles

db.connectDB = async () => {
  try {
    await mongoose.connect(dbConfig.MONGO_URI);
    console.log('MongoDB connected successfully!');
    await initializeRoles();
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

async function initializeRoles() {
  try {
    const count = await Role.estimatedDocumentCount();
    if (count === 0) {
      await Promise.all(
        db.ROLES.map(roleName => new Role({ name: roleName }).save())
      );
      console.log('Roles initialized successfully!');
    }
  } catch (err) {
    console.error('Error initializing roles:', err);
  }
}

module.exports = db;