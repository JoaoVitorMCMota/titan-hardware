const mongoose = require('mongoose');

async function connectDatabase() {
  try {
    await mongoose.connect('mongodb://localhost:27017/titanHardwareDB');

    console.log('MongoDB conectado');
  } catch (error) {
    console.log(error);
  }
}

module.exports = connectDatabase;