const { Schema, model } = require("mongoose");

const postSchema = Schema({
  title:  {type:String, required: true},
  body:  {type:String, required: true},
  hashtag: Array,
  image: {
    public_id: {type:String, required: true},
    url:  {type:String, required: true},
  },
  owner: {type : Schema.Types.ObjectId , ref : "Users"},
  likes: [{type: Schema.Types.ObjectId , ref: "Users"}],
  comments : [{
          commentOwner : {type: Schema.Types.ObjectId , ref: "Users"},
          commentBody : String
  }]
});


module.exports = model("Posts", postSchema);
