const passport = require("passport");
const User = require("../models/user.js");
// render signup form
module.exports.renderSignupForm = (req,res)=>{
        res.render("users/signup.ejs");
};
// render login form

module.exports.renderLoginForm = (req,res)=>{
    res.render("users/login.ejs");
};

// postlogin form
module.exports.postLogin = async(req,res)=>{
    req.flash("success","Welcome to wanderlust You are logged in!");
    let redirectUrl = res.locals.redirectUrl||"/listings";
    res.redirect(redirectUrl);
    const currUser = req.user;
    console.log(currUser);
};
// logout
module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
      if(err){
        next(err);
      }
      req.flash("success","you are logged out");
      res.redirect("/listings");
    })
};
module.exports.signup = async(req,res)=>{
    try{
      let {username,email,password}=req.body;
      const newUser = new User({email,username});
      const registeredUser = await User.register(newUser,password);

    //   console.log(registeredUser);
      req.login(registeredUser,(err)=>{
        if(err){
          return next(err);
        }
        req.flash("success","welcome to wanderlust");
        res.redirect("/listings");
      });
      
    }catch(e){
      req.flash("error",e.message);
      res.redirect("/signup");
    }

};