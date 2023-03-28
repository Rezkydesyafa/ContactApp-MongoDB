const mongoose = require('mongoose');

const contacts = mongoose.model('Contacts', {
  nama: {
    type: String,
    required: true,
  },
  nohp: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  alamat: {
    type: String,
    required: true,
  },
});

module.exports = contacts;
