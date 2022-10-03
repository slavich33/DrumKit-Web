//jshint esversion:6
var _ = require("lodash");
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
// const data = require(__dirname + "/data.js");
const mongoose = require("mongoose");

// let posts = [];
// let trancatedPosts = [];

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/myBlog");

const composeSchema = new mongoose.Schema({
  title: String,
  bodyText: String
});

const Post = mongoose.model("Post", composeSchema)

const listSchema = new mongoose.Schema({
  posts: [composeSchema]
});

const List = mongoose.model("List", listSchema);

app.get("/", function(req, res){

  List.find({}, function(err, pos){

    res.render("home", {startingContent: homeStartingContent, newPosts: pos});
  });


});

app.get('/posts/:curPost', (req, res) => {
  // res.send(req.params.curPost);

  // const reqTitle = req.params.curPost;

  // if (posts.some(post => _.lowerCase(post.title) === _.lowerCase(req.params.curPost)) ) {
  //   res.render("post", {newTitle: post.title, newDesc: posts});
  // } else {
  //   console.log("not a match");
  // };

  const reqTitle = req.params.curPost;

  List.find({}, (err, postsObj) => {

    if (err) {
      console.log(err);
    }

  postsObj.forEach(function(posts) {

    posts.posts.forEach(function(post) {
      const storedTitle = post.title;
      const storedDesc = post.bodyText;

      if (_.lowerCase(storedTitle) === _.lowerCase(reqTitle)) {
        res.render("post", {newTitle: storedTitle, newDesc: storedDesc});
      }
    })
  });
});
});

app.get("/about", function(req, res){
  res.render("about", {aboutCon: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactCon: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res) {

  var post = {
    title: req.body.newText,
    bodytext: req.body.newDesc
  }

  const newPost = new Post({
    title: post.title,
    bodyText: post.bodytext
  });
  // var trP = {
  //   title: req.body.newText,
  //   bodytext: truncateString(req.body.newDesc,100)
  // }
  const list = new List({
    posts: newPost
  });
  list.save();
  newPost.save();
  // posts.push(post)
  // trancatedPosts.push(trP)
  res.redirect("/");

});

var stringTruncate = function(str, length){
  var dots = str.length > length ? '...' : '';
  return str.substring(0, length)+dots;
};

function truncateString(str, num) {
  if (str.length > num) {
    return str.slice(0, num) + "...";
  } else {
    return str;
  }
};






app.listen(3000, function() {
  console.log("Server started on port 3000");
});
