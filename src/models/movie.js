const mongoose = require("mongoose");


const MovieSchema = new mongoose.Schema({
  title: { 
    type: String
  },
  poster_path: {
    type: String
  },
  release_date: {
   type: String
  },
  vote_average: {
   type: Number
  },
  userId: { 
    type: String
  }
});


module.exports = mongoose.model("Movie", MovieSchema);