require('dotenv').config()
var db = require("../models");

db.User.create({
    username: "gcanales",
    password: process.env.passadmin,
    role: "admin"
  },
  ).then(data => {

    console.log("Usuario Creado")
    })
  .catch(function (err) {
    console.log(err);
  });