const express = require("express");
const app = express();
const ejs = require("ejs");
const bodyParser= require("body-parser");
const sassMiddleware = require('node-sass-middleware');
const bcrypt = require("bcryptjs");
// used for session cookie
const flash = require("connect-flash");
const session = require("express-session");
const passport= require("passport");
const LocalStrategy = require('passport-local').Strategy;


// Setting up SASS
app.use(sassMiddleware({
    src: './public/scss',
    dest: './public/css',
    debug: true,
    outputStyle: 'extended',
    prefix: '/public/css'
}));

// Setting the view engine
app.set('view engine', 'ejs');
// Setting the body parser
app.use(bodyParser.urlencoded({
    extended: true
}));
// Setting the static directory
app.use(express.static(__dirname + "/public"));

// Passport config
require('./config/passport')(passport);

// Setting up database
const database = require('./config/database');


// requiring the models - schemas
const User = require("./models/user");
const Post = require("./models/post");
const Comment = require("./models/comment");

app.use(session({
    secret: 'Our little secret.',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 365 * 24 * 60 * 60 * 1000 }
}));


// Passport middleware
app.use(passport.initialize());
app.use(passport.session());


// Connecting flash
app.use(flash());

// Global vars
app.use(function(req,res,next){
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash('error');
    next();
});













app.get('/', function(req,res){
    res.render('landing-page');
});

app.get('/login', function(req,res){
    res.render('login');
});

app.get('/signup', function(req,res){
    res.render('signup');
});





// Not visible unless authorized
app.get('/feed', function(req,res){
    if(req.isAuthenticated()){
        // Populating the user of each post.s
        Post.find({}).populate("user").populate({
            path: 'comments',
            populate: {
                path: "user"
            }
        }).exec(function(err,posts){
            return res.render("feed", {posts: posts});
        });
        console.log("hey");
    }
    else{
        req.flash("error_msg", "Please login to view this resource");
        res.redirect("/login");
    }
});


app.get('/logout', function(req,res){
    req.logout();
    req.flash("succes_msg", "You are successfully logged out");
    res.redirect("/");
    console.log("logged out");
})


app.post('/login', function(req,res, next){
    passport.authenticate('local', {
        successRedirect: '/feed',
        failureRedirect: '/login',
        failureFlash: true
      })(req, res, next);
});
    


// // For registering the user in database
app.post('/signup', function(req,res){
    let errors = [];
    // Check required fields
    if(!req.body.fullName || !req.body.email || !req.body.password || !req.body.confirmPassword){
        errors.push({msg: 'Please fill in all the fields'});
    }
    // Checking if passwords match
    if(req.body.password!== req.body.confirmPassword){
        errors.push({msg: 'Passwords do not match'});
    }

    if (errors.length > 0) {
        console.log(errors);
        res.render('signup', {
          errors: errors
        });
      } 
    // USER passed the validation
    else{
        User.findOne({email: req.body.email}).then(user => {
            if(user){
                // User already exists
                errors.push({msg: "Email is already registered "});
                res.render('signup', {
                    errors: errors
                });
            }
            else{
                // Using bcrypt to hash the password
                const newUser = new User({
                    fullName: req.body.fullName,
                    email: req.body.email,
                    password: req.body.password,
                    gender: req.body.gender,
                    username: req.body.username
                });

                bcrypt.genSalt(10, function(err, salt) {
                    bcrypt.hash(newUser.password, salt, function(err, hash) {
                        // Storing hash in password DB.
                        if(err){
                            console.log(err);
                        }
                        else{
                            newUser.password= hash;
                            newUser.save()
                            .then(user => {
                                req.flash("success_msg", "User registered!");
                                res.redirect("/login");
                            })
                            .catch(err => console.log(err));
                        }
                    });
                });
                console.log(newUser);
            }
        });
    }

});


app.post("/feed", function(req,res){
    Post.create({
        content: req.body.content,
        user: req.user._id
    }, function(err, post){
        if(err){
            console.log("Error in creating a post", err);
            return;
        }
        else{
            console.log(post);
            res.redirect('/feed');
        }
    });
});


app.post("/comments", function(req,res){
    // making sure that the post exists in database
    Post.findById(req.body.post, function(err, foundPost){
        if(err){
            console.log(err);
        }
        if(foundPost){
            // Creating a comment in the db with the user and post.
            Comment.create({
                content: req.body.commentContent,
                post: req.body.post,
                user: req.user._id
            }, function(err, madeComment){
                if(err){
                    console.log(err);
                }
                // Saving the comment in the post schema
                post.comments.push(madeComment);
                post.save();
                res.redirect("/feed");
            });
        }
    })
})


const PORT = process.env.PORT || 3000;
app.listen(PORT, function(err){
    if(err){
        console.log("Error", err);
    }
    console.log("Server is up and running on port 3000");
});