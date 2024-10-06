const express = require("express");
const app = express();
const userModel = require("./models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const path = require("path");
const cookieParser = require("cookie-parser");

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

app.get("/", (req, res) => {
  // res.send is use to show some thing on /route
  // res.render is use to display the whole page on the route
  res.render("index");
});

// post from the method of form
app.post("/create", (req, res) => {
  let { username, email, password, age } = req.body;

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, async (err, hash) => {
      // usermodel is used to create one
      let createdUser = await userModel.create({
        username,
        email,
        password: hash,
        age,
      });

      let token = jwt.sign({ email }, "shhhhh");
      res.cookie("token", token);
      // res.send(createdUser);
      res.render('login')
    });
  });
});

app.get("/logout", function (req, res) {
  res.cookie("token", "");
  res.redirect("/");
});

app.get("/login", function (req, res) {
  res.render('login')
});

app.post("/login", async (req, res) => {
  // For checking Email, if it exists
  let user = await userModel.findOne({email: req.body.email})
  if(!user){
      let token = jwt.sign({email: user.email }, "shhhhh");
      res.cookie("token", token);
      res.send("Something Went Wrong.")
  }
  // Foe checking Password if it matches
  bcrypt.compare(req.body.password, user.password, (err, result)=>{
    // if (result) res.send("Yes you can login")
    if (result){
      res.render('loggedin')
    } 
    else{
      res.render('notloggedin')
    } 
  });
  
});

app.listen(3000);
