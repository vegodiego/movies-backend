const jwt = require("jsonwebtoken");
const User = require("../../models/user");


// post register
exports.postRegister = async (req, res, next) => {
  try {
    const data = {
      email: req.body.email,
      password: req.body.password
    }
    
    const newUser = new User(data);
    await newUser.save();
    console.log("Nuevo usuario creado");

    res.json({"userId":newUser._id, "error":"false"});
  } catch(err){ //si hay errores
    if(err.name === "ValidationError"){ //error de validación en la base de datos pues el usuario ya existe

      res.json({"user":null, "error":"true"}); 
    } else{ //otro error
      return next(err); 
    }   
  }
};

// post login
exports.postLogin = async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const user = await User.authenticate(email, password);
    if (user) {
      const tokenUserId = jwt.sign({userId: user._id}, process.env.SECRET_KEY); //Generacion del token del usuario(guarda el objeto {userId: user._id})
      console.log("Nuevo ingreso de usuario");

      res.json({"tokenUserId":tokenUserId, "error":"false"});
    } else { //error pues los valores ingresados no existen en la base de datos o no corresponden entre ellos
      console.log("Ingreso de usuario fallido por contraseña o usuario incorecto");
      
      res.json({"tokenUserId":null, "error":"true"});
    }
  } catch (err){ //otro error
    return next(err); 
  }
};