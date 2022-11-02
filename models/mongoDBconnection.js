const mongoose = require("mongoose")

exports.DBconnection = () =>{
          try{
                    mongoose.connect(process.env.MONGDBURL)
                    console.log(`Connection Established on ${process.env.MONGDBURL} at PORT : ${process.env.PORT} `);
          }catch(err){
                    console.log("DataBase Error >>"+err);
          }
} 
