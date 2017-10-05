const express = require("express");
const cloudinary = require("cloudinary");
const bodyParser = require("body-parser");
const path = require("path");
const fileUpload = require("express-fileupload");
const fs = require("fs")
const async = require("async")

const app = express();
const keys = require("./config");
// console.log("keys", keys);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(fileUpload());

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

cloudinary.config({
  cloud_name: process.env.COULDIYFA_CLOUD_NAME || keys.COULDIYFA_CLOUD_NAME,
  api_key: process.env.COULDIYFA_API_KEY || keys.COULDIYFA_API_KEY,
  api_secret: process.env.CLOUDIFYA_API_SECRET || keys.CLOUDIFYA_API_SECRET
});


// =============================
// ========== GET ==============
// =============================
app.get("/", (req, res) => {
  res.render("home");
});

const genGuid = () => {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return (
    s4() +
    s4() +
    "-" +
    s4() +
    "-" +
    s4() +
    "-" +
    s4() +
    "-" +
    s4() +
    s4() +
    s4()
  );
};

// ==============================
// ============ POST ============
// ==============================
// app.post("/image-old", (req, res) => {
  
//   // add the file to server to a temp folder -- so we can get a file path
//   const _filePath = __dirname + "/uploads/" + genGuid() + "_" + req.files.image.name;
//   console.log("saving to ", _filePath);
//   req.files.image.mv(_filePath, err => {
//     console.log("saved file","err:", err);
//     // upload the file with that new path
//     cloudinary.uploader.upload(_filePath, (result) => {
//       console.log("uploaded", result);
//       // delete the file from the temp folder after we have confirmed the upload
//       fs.unlink(_filePath, (err)=>{
//         console.log("deleted file", "err =>", err)
//         // save secure_url to database
//         res.redirect("/");
//       })
//     });
//   });

//   // console.log('2', req.files.image,req.files.image.data.length, typeof _data)
// });

// ==============================
// ============ POST ============
// ==============================
app.post("/image", (req, res) => {

  const _filePath = __dirname + "/uploads/" + genGuid() + "_" + req.files.image.name;
  let secure_url = "";
  // add the file to server to a temp folder -- so we can get a file path
  const saveFile = (next) => {
    console.log("saving to ", _filePath);
    req.files.image.mv(_filePath, err => {
      console.log("saved file","err:", err);
      next();
    });
  }

  // upload the file with that new path
  const uploadToStorage = (next) => {
    cloudinary.uploader.upload(_filePath, (result) => {
      console.log("uploaded", result);
      secure_url = result.secure_url;
      next()
    });
  }
  
  // delete the file from the temp folder after we have confirmed the upload
  const deleteFile = (next) => {
    fs.unlink(_filePath, (err)=>{
      console.log("deleted file", "err =>", err)
      next();
    });
  }

  // TODO: save secure_url to database
  const saveToDatabase = (next) =>{
    // do that here
    console.log("saving to databse", secure_url)
    next();
  }

  const tasks = [saveFile, uploadToStorage, deleteFile, saveToDatabase]

  async.waterfall(tasks, (err) => {
    console.log("complete", "error was" ,err)
    res.redirect("/");
  })
})

app.listen(3000, () => {
  console.log("the current dir is", __dirname)
  console.log("Listening on 3000");
});
