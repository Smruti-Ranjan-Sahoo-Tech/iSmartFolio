const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  nanoid: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  socialMedias: [
    {
      name: { type: String, required: true },
      icon: { type: String, required: true },
      your_Link: { type: String, required: true }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Contact', contactSchema);
