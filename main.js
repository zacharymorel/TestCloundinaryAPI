const express = require('express') 
const cloudinary = require('cloudinary');

const app = express()
const keys = require('/config');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

cloudinary.config({
    cloud_name: process.env.COULDIYFA_CLOUD_NAME || keys.COULDIYFA_CLOUD_NAME,
    api_key: process.env.COULDIYFA_API_KEY || keys.COULDIYFA_API_KEY,
    api_secret: process.env.CLOUDIFYA_API_SECRET || keys.CLOUDIFYA_API_SECRET
});



// GET




// POST 

cloudinary.uploader.upload('stuffs and things', function(result) {
  console.log(result.secure_url);
});



// upload a image to cloudnary from HTML 

// display the secure_url to console
