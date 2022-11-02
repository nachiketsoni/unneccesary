const {Schema ,model} = require('mongoose')
const validator = require("validator")
const bcrypt = require("bcryptjs")
const userSchema = Schema({

          name:{
                    type:String,
                    required:true,

          },
          email:{
                    type:String,
                    required:true,
                    unique:true,
                    validate: [validator.isEmail,"Please Enter Correct Email Address"]
          },
          password:{
                    type:String,
                    required:true,
                    
                    minLength: [8,"Password Should be more the 8 Character"],
                    select: false
          },
          contact:{
                     type:Number,
                     // unique:true,
                     // validate: [validator.isMobilePhone,"Please Enter Correct Mobile Number"]
                  },
          address:{
                     type:String,

                  },
          avatar:{
               public_id: {
                    type: String,
                    required: true,
                    
                  },
                  url: {
                    type: String,
                    required: true,
                  },
          },
          followers:[{   
             type:Schema.Types.ObjectId,
             ref: "Users"
             
          }],
          following:[{   
             type:Schema.Types.ObjectId,
             ref: "Users"
             
          }],
          posts:[{type:Schema.Types.ObjectId, ref: "Posts"}],
          fav:[{type:Schema.Types.ObjectId, ref: "Posts"}],



})
 
userSchema.pre("save",async function(next){
          if(!this.isModified("password")){
                    next()
          }
          this.password =  await bcrypt.hash(this.password, 10)
})

userSchema.methods.comparePassword = async function(userPassword){
     return await bcrypt.compare(userPassword, this.password)
}

module.exports = model("Users" , userSchema)