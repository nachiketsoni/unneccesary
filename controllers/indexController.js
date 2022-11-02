const ErrorHandler = require("../utils/errorhandler");
const AsyncError = require("../middleware/asyncErrors");
const User = require("../models/userModel");
const Post = require("../models/postModel");
const { sendToken } = require("../utils/auth");
const formidable = require("formidable");
const cloudinary = require("cloudinary");

/** @api {get} / homepage */
exports.homepage = AsyncError(async (req, res, next) => {
  const post = await Post.find({}).populate("owner");
  const user = await User.findOne({ _id: req.user._id })
  res.render("homepage",{post , user});
  // res.status(200).json("hompage");
});
/** @api {get} / homepage */
exports.singlePost = AsyncError(async (req, res, next) => {
  const post = await Post.findOne({_id:req.params.id}).populate("owner").populate({
    path: "comments",
    populate: {
      path: "commentOwner",
    }
  });
  console.log(post)
  const user = await User.findOne({ _id: req.user._id })
  res.render("singlePost",{post , user});
  // res.status(200).json("hompage");
});
/** @api {get} / loginPage */
exports.profile = AsyncError(async (req, res, next) => {
  const user = await User.findOne({_id:req.user._id})
  
  res.render("profile", {user});  
  // res.status(200).json("hompage");
});
exports.clickedUserProfile = AsyncError(async (req, res, next) => {
  const user = await User.findOne({_id:req.params.id}).populate({path:"followers", populate:[{path:"followers"},{path:"following"}]}).populate({path:"following", populate:[{path:"followers"},{path:"following"}]}).populate({path:"posts",populate:{path:"owner"}})
  console.log(user)
  res.render("clickedUser", {user});  
  // res.status(200).json("hompage");
});


exports.clickedUser = AsyncError(async (req, res, next) => {
  const { id, type } = req.params;
  
  const {posts,followers,following } = await User.findOne({_id:id}).populate({path:"followers", populate:[{path:"followers"},{path:"following"}]}).populate({path:"following", populate:[{path:"followers"},{path:"following"}]}).populate({path:"posts",populate:{path:"owner"}})
  if(type === "followers"){
  res.status(200).json({followers, following});
}else if(type === "posts"){
  res.status(200).json(posts);
}else if(type === "following"){
  res.status(200).json({following });
}else{
  res.status(404).json("not found");
}

});
exports.userDataAPI = AsyncError(async (req, res, next) => {
  const { type } = req.params;
  
  const {posts,followers,following } = await User.findOne({_id:req.user._id}).populate({path:"followers", populate:[{path:"followers"},{path:"following"}]}).populate({path:"following", populate:[{path:"followers"},{path:"following"}]}).populate({path:"posts",populate:{path:"owner"}})
  if(type === "followers"){
  res.status(200).json({followers, following});
}else if(type === "posts"){
  res.status(200).json(posts);
}else if(type === "following"){
  res.status(200).json({following });
}else{
  res.status(404).json("not found");
}

});
/** @api {get} / loginPage */
exports.loginPage = AsyncError(async (req, res, next) => {
  
  res.render("index");  
  // res.status(200).json("hompage");
});
exports.newPost = AsyncError(async (req, res, next) => {
  
  res.render("newPost");  
  // res.status(200).json("hompage");
});
exports.weather = AsyncError(async (req, res, next) => {
  
  res.render("weather");
  // res.status(200).json("hompage");
});
exports.search = AsyncError(async (req, res, next) => {
  
  res.render("search");
  // res.status(200).json("hompage");
});
exports.searchApi = AsyncError(async (req, res, next) => {
  try {
    
    const {search , type } = req.params;
    
    if(type === "user"){
  const user = await User.find({
    $or: [
      {email:{$regex:search,$options:"i"}},
      {name:{$regex:search,$options:"i"}},
    ]
  })
  res.status(200).json(user);
}else if(type === "post"){
  const post = await Post.find({
    $or: [
    {title:{$regex:search,$options:"i"}},
    {body:{$regex:search,$options:"i"}},
    {hashtag:{$regex:search,$options:"i"}},
    {comments:{ $elemMatch: { commentBody: { $regex: search, $options: "i" } }  }},
    ]
  }).populate("owner")
  res.status(200).json(post);
}else if(type === "hashtag"){
  const post = await Post.find({hashtag:{$regex:search,$options:"i"}}).populate("owner")
  res.status(200).json(post);
}else{
  res.status(404).json();
}
} catch (error) {
  res.status(404).json("not found");
}

});

exports.favourite = AsyncError(async (req, res, next) => {
  const user = await User.findOne({ _id: req.user._id }).populate({
    path: "fav",
    populate: {
      path: "owner",
    }
  });
  console.log(user);
  res.render("favourite",{fav:user.fav});
  // res.status(200).json("hompage");
});

/**@api POST / signup */
exports.signup = AsyncError(async (req, res, next) => {
  const { name, email, password } = req.body;
  const defaultIMG =
    "https://img.freepik.com/free-psd/3d-illustration-person_23-2149436192.jpg?w=740&t=st=1665479565~exp=1665480165~hmac=a506127a19be062f341ab4d2e9767e3a1593d6e20efd3762ebfcb19cc39e49d1  ";
  if (!email || !password || !name) {
    return next(new ErrorHandler("Please Enter Name , Email & Password", 400));
  }
  const { public_id, secure_url } = await cloudinary.v2.uploader.upload(
    defaultIMG,
    {
      folder: `n9challenge/${email}`,
      fetch_format: "webp",
      quality: "50",
    }
  );

  const user = new User({
    name,
    email,
    password,
    avatar: {
      public_id,
      url: secure_url,
    },
  });
  const createdUser = await user.save();
  sendToken(res, 200, createdUser);
});

/**@api POST / login */
exports.login = AsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  // checking if user has given password and email both

  if (!email || !password) {
    return next(new ErrorHandler("Please Enter Email & Password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

   sendToken(res, 200, user , next);
});

/**@api POST / logout */
exports.logout = AsyncError((req, res, next) => {
  res.clearCookie("token");
  // res.status(200).json({ message: "user logged out" });
  res.redirect("/login");
});

/**@api POST / update */
exports.update = AsyncError(async (req, res, next) => {
  try{

  const form = formidable();

  form.parse(req, async (err, fields, files) => {
    if (err) throw err;
    console.log(fields, files);
    if(!fields  ){
      return next(new ErrorHandler("Please Enter Name & Email", 400));
    }
    var updateUser = {
      ...fields,
    };

    if (files.avatar.size>0 && files.avatar.mimetype.includes("image")) {
      var user = await User.findById(req.user._id).exec();
      var imageId = user.avatar.public_id;
      try {
        
        await cloudinary.v2.uploader.destroy(imageId);
        var { public_id, secure_url } = await cloudinary.v2.uploader.upload(
          files.avatar.filepath,
          {
            folder: `n9challenge/${user.email}`,
            fetch_format: "webp",
            quality: "50",
          }
        );
      } catch (error) {
          console.log(error);
      }

      updateUser.avatar = {
        public_id: public_id,
        url: secure_url, 
      };
    } else {
      console.log("no image");
      // res.error(new ErrorHandler("Please Enter a Valid Image File", 400));
    }

    await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateUser },
      { new: true }
    );
  res.redirect("back")
  
});
}catch(err){
  console.log(err);
  res.error(new ErrorHandler("Error Uploading Data", 500));
}
});

/**@api GET / follow */
exports.follow = AsyncError(async (req, res, next) => {
  if (!req.params.id) {
    return next(
      new ErrorHandler("Can't Find The User, params is incorrect", 500)
    );
  }
  const user = await User.findById(req.user._id);
  var followuser = await User.findById(req.params.id);
  if (req.params.id === req.user._id.toString()) {
    return next(new ErrorHandler("You Can't Follow Yourself", 400));
  }
  if (
    user.following.includes(req.params.id) &&
    followuser.followers.includes(req.user._id)
  ) {
    user.following.splice(user.following.indexOf(req.params.id), 1);
    followuser.followers.splice(followuser.followers.indexOf(user._id), 1);
    await user.save();
    await followuser.save();
  } else {
    user.following = [...user.following, followuser._id];
    followuser.followers = [...followuser.followers, user._id];
    await user.save();
    await followuser.save();
  }
  res.redirect("back")
  // res.status(200).json(user);
});
/**@api POST / likes */
exports.likes = AsyncError(async (req, res, next) => {
  if (!req.params.id) {
    return next(
      new ErrorHandler("Can't Find The Post, params is incorrect or Empty", 404)
    );
  }
  const user = await User.findById(req.user._id);
  var likePost = await Post.findById(req.params.id);

  if (likePost.likes.includes(req.user._id) && user.fav.includes(req.params.id)) {
    likePost.likes.splice(likePost.likes.indexOf(user._id), 1);
    user.fav.splice(user.fav.indexOf(likePost._id), 1);
    await user.save();
    await likePost.save();
  } else {
    user.fav = [...user.fav, likePost._id];
    likePost.likes = [...likePost.likes, user._id];
    await user.save();
    await likePost.save();
  }
  // res.redirect("back")

  res.status(200).json(likePost);
});


/**@api POST / createPost  */
exports.createPost = AsyncError(async (req, res, next) => {
  try{

    const user = await User.findById(req.user._id).populate("posts");
    
    const form = formidable();
    
    form.parse(req, async (err, fields, files) => {
      if(!fields.title || !fields.body || !files.image){
        return next(new ErrorHandler("Please Enter All Fields", 400));
      }
      if (err) throw err;
      var newPost 
      
      if (files.image.size > 0 && files.image.mimetype.includes("image")) {
        try{
          var { public_id, secure_url } = await cloudinary.v2.uploader.upload(
            files.image.filepath,
            {
            folder: `n9challenge/${user.email}`,
            fetch_format: "webp",
            quality: "50",
          })

        } catch(err){
          return next(new ErrorHandler(err.message, 500));
        }
        
        
        newPost = new Post({
          
          title : fields.title.trim(),
          body : fields.body.trim(),
          image: {
            public_id,
            url: secure_url,
          },
          owner: user._id,
          hashtag: fields.body.trim().split(" ").filter((item) => item.includes("#") && item.trim() && item.length > 1) ,
        });
      } else {
        res.error(new ErrorHandler("Please Enter a Valid Image File", 400));
      }
      
      user.posts = [...user.posts, newPost];
      await user.save();
      await newPost.save();
  res.redirect("back")
      
      // res.status(200).json(user);
    });
  } catch(err){
    res.status(400).json(err);

  }
});

/**@api POST / comment  */
exports.comment = AsyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate("posts");
  let { commentBody } = req.body;
  if(!commentBody || commentBody.trim().length === 0){
    return next(new ErrorHandler("Can't Send Empty Comment", 400));
  }
  if(!req.params.id){
    return next(new ErrorHandler("Post Not Found", 400));
  }
  const newComment =  {
    commentBody,
    commentOwner: user._id,
  }
  const post = await Post.findById(req.params.id)
  post.comments = [...post.comments, newComment]
  post.save()
  res.redirect(`back`);
});
/**@api POST / commentDelete  */
exports.commentDelete = AsyncError(async (req, res, next) => {
  let { postID , commentID } = req.params;
 
  if(!postID || !commentID){
    return next(new ErrorHandler("Post Not Found", 400));
  }
  const post = await Post.findOne({_id:postID}).populate("owner").populate({
    path: "comments",
    populate: {
      path: "commentOwner",
    }
  });
  console.log()
  post.comments.splice(post.comments.findIndex((item)=>( item._id.toString() === commentID)), 1)
  post.save()
  res.redirect(`back`);
});

/**@api GET / all  */
exports.all = AsyncError(async (req, res, next) => {
  let pol = await User.find().populate("posts");
  console.log(pol)
  res.status(200).json(pol);
});

/**@api GET / others  */
exports.others = AsyncError(async (req, res, next) => {
  res.redirect("/")
});