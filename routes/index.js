var express = require('express');
var router = express.Router();
const {isLoggedIn} = require("../utils/isLoggedIn")
const {homepage ,signup ,login , logout ,update, follow, all, createPost, comment, likes ,weather, search, favourite, loginPage, newPost, singlePost, commentDelete, searchApi, profile, others, userDataAPI, clickedUser, clickedUserProfile} = require("../controllers/indexController.js")

/** @api GET / homepage */
router.get('/',isLoggedIn, homepage);
/** @api GET / profile */
router.get('/singlePost/:id',isLoggedIn, singlePost);
/** @api GET / profile */
router.get('/profile',isLoggedIn, profile);
/** @api GET / profile */
router.get('/user/:id',isLoggedIn, clickedUserProfile);
/** @api GET / userDataAPI */
router.get('/userDataAPI/:type',isLoggedIn, userDataAPI);
/** @api GET / login */
router.get('/clickeduser/api/:id/:type',isLoggedIn, clickedUser);
/** @api GET / login */
router.get('/loginPage', loginPage);

/** @api GET / newPost */
router.get('/newPost', isLoggedIn , newPost);
/** @api GET / weather */
router.get('/weather', weather);    
/** @api GET / search */
router.get('/search', search);
/** @api GET / searchAPI */
router.get('/api/search/:type/:search', searchApi);
/** @api GET / fav */
router.get('/favourite',isLoggedIn, favourite);


/**@api POST / signup */
router.post("/signup", signup)

/**@api POST / login */
router.post("/login", login)

/**@api POST / logout */
router.get("/logout", isLoggedIn, logout);

/**@api POST / update */
router.post("/update",isLoggedIn, update);

/**@api GET / follow */
router.get("/follow/:id",isLoggedIn, follow);

/**@api GET / likes / postId */
router.get("/likes/:id",isLoggedIn, likes);

/**@api POST / createPost  */
router.post("/createPost",isLoggedIn, createPost);

/**@api POST / comment/postid */
router.post("/comment/:id",isLoggedIn, comment);
/**@api get / comment/postid */
router.get("/delete/comment/:postID/:commentID",isLoggedIn, commentDelete);

/**@api GET / all  */
router.get("/all",isLoggedIn, all);
/**@api GET / *  */
router.get("*", others);

module.exports = router;


// https://rudrastyh.com/instagram/get-photos-with-javascript.html