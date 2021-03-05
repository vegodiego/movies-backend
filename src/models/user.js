const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const uniqueValidator = require("mongoose-unique-validator");

const validateEmail = (email) => {
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email)
};

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validateEmail, 'Please fill a valid email address']
  },
  password: {
    type: String,
    required: true,
  }
});

UserSchema.plugin(uniqueValidator);

// hashes the password 
UserSchema.pre("save", async function(next){
  try{
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(this.password, salt);
    this.password = hash;
  } catch(err){
    console.log(err)
  }
});


// used for authentication 
UserSchema.statics.authenticate = async (email, password) => {  
  try{
    const user = await mongoose.model("User").findOne({ email: email });
    if(user){
      const userOk = await bcrypt.compare(password, user.password);
      if(userOk){
        return user
      }
    }
  } catch(err){
    console.log(err)
  }
}



module.exports = mongoose.model("User", UserSchema);