const jwt = require("jsonwebtoken");
const Movie = require("../../models/movie");


// get movies
exports.getMovies = async (req, res, next) => {
  try {
    const tokenUserId = req.header("Authorization");  //token enviado en el encabezado  
    const decoded = await jwt.verify(tokenUserId, process.env.SECRET_KEY); //decodificación del token (se tiene el objeto {userId: user._id} guardado en el post login)
    const userId = decoded.userId;  
    const movies  = await Movie.find({userId: userId});

    res.json(movies);
  } catch(err){ //Error 
    return next(err); 
  }
};

// post new movie
exports.postNewMovie = async (req, res, next) => {
  try {
    const tokenUserId = req.header("Authorization");  //token enviado en el encabezado
    const decoded = await jwt.verify(tokenUserId, process.env.SECRET_KEY); //decodificación del token (se tiene el objeto {userId: user._id} guardado en el post login)
    const userId = decoded.userId; 

    const data = {
      title: req.body.title,
      poster_path: req.body.poster_path,
      release_date: req.body.release_date,
      vote_average: req.body.vote_average,
      userId: userId
    }
    
    const newMovie = new Movie(data);
    await newMovie.save();
    console.log("Nueva película favorita agregada");

    res.json(newMovie);
  } catch(err){ //Error   
    return next(err); 
  }
};

// delete movie
exports.deleteMovie = async (req, res, next) => {
  try {
    await Movie.deleteOne({ _id: req.params.id});
    console.log("Película favorita eliminada");
    
    res.json({"exito":"ok"});
  } catch(err){ //Error 
    return next(err); 
  }
};