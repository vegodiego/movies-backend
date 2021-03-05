const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const routes = require('./routes');
require('dotenv').config();


const app = express();

// DB conexion
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const dbCon = async () => {               
	try {
	  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/movies', options)
	  console.log("Connection established successfully");
	} catch (err) {
	  console.log('Something went wrong!', err);
	  process.exit();
	}
}

dbCon();

app.use(express.urlencoded({ extended: true }));

app.use('/public', express.static(process.cwd() + '/public'));

app.use(express.json());

app.use(cors());
app.options('*', cors());

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something is broken!');
});

app.use("/", routes);


module.exports = app;