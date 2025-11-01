// seedAdmin.js
// Run: node seedAdmin.js
// This script creates or updates an admin user using ADMIN_EMAIL and ADMIN_PASSWORD from environment.

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('./models/User');

const MONGO_URI = process.env.MONGO_URI;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!MONGO_URI) {
  console.error('Missing MONGO_URI in environment.');
  process.exit(1);
}
if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error('Missing ADMIN_EMAIL or ADMIN_PASSWORD in environment. Set them in your .env file or pass them in the environment.');
  process.exit(1);
}

async function run() {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    const existing = await User.findOne({ email: ADMIN_EMAIL });
    const hashed = await bcrypt.hash(ADMIN_PASSWORD, 10);

    if (existing) {
      // Update password and role to admin
      existing.password = hashed;
      existing.role = 'admin';
      // clear any stored refresh tokens for safety
      existing.refreshTokens = [];
      await existing.save();
      console.log(`Updated existing user ${ADMIN_EMAIL} to role=admin and reset password.`);
    } else {
      const user = new User({
        name: 'Admin',
        email: ADMIN_EMAIL,
        password: hashed,
        role: 'admin',
        refreshTokens: [],
      });
      await user.save();
      console.log(`Created admin user ${ADMIN_EMAIL}`);
    }

    console.log('Done. You can now login via POST /api/auth/login with the admin credentials.');
    process.exit(0);
  } catch (err) {
    console.error('Error creating admin:', err);
    process.exit(1);
  } finally {
    // mongoose.disconnect will be called by process.exit above, but ensure cleanup
    // await mongoose.disconnect();
  }
}

run();
