const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    // store refresh tokens for rotation/revocation
    refreshTokens: { type: [String], default: [] },
    // role: 'customer' | 'admin'
    role: { type: String, enum: ['customer', 'admin'], default: 'customer' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
