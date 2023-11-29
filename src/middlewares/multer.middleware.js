import multer from "multer";

const storage = multer.diskStorage({
  // Setting the destination directory for storing uploaded files.
    destination: function (req, file, cb) {
      cb(null, "./public/temp")
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })
  
export const upload = multer({ storage })


// alternative to look into
const multer = require("multer");
const express = require("express");

const app = express();
const port = 3000;

const storage1 = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/temp");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage1 });

app.post("/upload", upload.single("file"), (req, res) => {
  // Handle the uploaded file here
  res.send("File uploaded successfully!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
