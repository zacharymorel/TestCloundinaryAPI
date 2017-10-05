const express = require("express");
const cloudinary = require("cloudinary");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const keys = require("./config");
console.log('keys', keys)

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");


// cloudinary.config({
//   cloud_name: process.env.COULDIYFA_CLOUD_NAME || keys.COULDIYFA_CLOUD_NAME,
//   api_key: process.env.COULDIYFA_API_KEY || keys.COULDIYFA_API_KEY,
//   api_secret: process.env.CLOUDIFYA_API_SECRET || keys.CLOUDIFYA_API_SECRET
// });

cloudinary.config({
  cloud_name: "madbeard",
  api_key: "437184119445437",
  api_secret: "QkFrttKYjxfrOrNoFPPLpJZCiwg"  
});

// =============================
// ========== GET ==============
// =============================
app.get("/", (req, res) => {
  res.render("home");
});


// ==============================
// ============ POST ============
// ==============================
app.post("/image", (req, res) => {
  let image = req.body.image
  console.log('2', typeof image, image)
  cloudinary.uploader.upload(image, function(result) {
    console.log("1", result.secure_url);
  })
  res.redirect('/')
});

// upload a image to cloudnary from HTML

// display the secure_url to console

app.listen(3000, () => {
  console.log("Listening on 3000");
});
