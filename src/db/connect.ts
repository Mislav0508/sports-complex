const mongoose = require('mongoose');

export const connectDB = (url) => {
  console.log("Connected to database.")
  return mongoose.connect(url);
};
