const express = require('express');

const mongoose = require('mongoose');
const session = require('express-session');
require('./db/mongoose');
const fs = require('fs');
const passport = require('passport');
const userRouter = require('./routers/user');
const cors = require('cors');
const app = express();
const User = require('./models/user');
const loginhistoryRouter = require('./routers/loginhistory')

const LoginHistory = require('./models/loginhistory');

app.use(express.urlencoded({
	extended: true
}));
app.use(cors());
app.use(express.json());
app.set('view engine', 'ejs');

app.use(userRouter);
app.use(loginhistoryRouter);
app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'SECRET' 
}));








app.listen(process.env.PORT, ()=>{
	console.log(`listening at port ${process.env.PORT}`);
})





var userProfile;

app.use(passport.initialize());
app.use(passport.session());



app.get('/success', (req, res) => res.send(userProfile));
app.get('/error', (req, res) => res.send("error logging in"));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});



const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "https://uniaccoassignment1.herokuapp.com/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
      userProfile=profile;
      return done(null, userProfile);
  }
));

app.get('/', (req, res)=>{
	res.render('auth');
});
app.get('/auth/google', passport.authenticate('google', {scope: ['profile','email']}));


app.get('/success', (req, res)=>{
	res.render('success');
})



app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/error' }),
  async (req, res)=> {


  console.log(req.user.emails[0].value);
  var history = new LoginHistory({
    "user": req.user.emails[0].value,
    "ip": req.socket.remoteAddress
  });
  
  history = await history.save();

  res.redirect('/success');
  // res.send('/success');
});