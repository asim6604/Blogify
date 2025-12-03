const mongoose =require('mongoose');
const {createHmac,randomBytes} = require('node:crypto');
const userSchema=new mongoose.Schema({
    name:{type:String,
        required:true},
        email:{type:String,
            required:true,
            unique:true
        },
        profile:{
            type:String,
            default:'./avatar.jpeg'
        },
        role:{
            type:String,
            enum:["user","admin"],
            default:"user"
        },
        salt:{
            type:String,
           
        },
        password:{type:String,
            required:true
            


},},{timestamps:true})
userSchema.pre("save", function(next) {
    const user = this;

    // If the password is not modified, proceed without hashing
    if (!user.isModified("password")) return next();

    // Correctly generate the salt as a hex string
    const salt = randomBytes(16).toString('hex'); 

    // Hash the password using the generated salt
    const hashed = createHmac('sha256', salt).update(user.password).digest("hex");

    // Set the salt and the hashed password on the user document
    user.salt = salt;
    user.password = hashed;

    // Proceed with the next middleware or save operation
    next();
});

const user=mongoose.model("user",userSchema);
module.exports=user;