const express = require("express");
// const bodyParser = require("body-parser");
const app = express();
// app.use(bodyParser.urlencoded({extended: true}));

exports.getTitle = function() {
app.post("/compose", function(req, res) {

  const title = req.body.newText;
  console.log(title);
  return title

})};
