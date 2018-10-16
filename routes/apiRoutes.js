const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);
var passport = require("../config/passport");
var db = require("../models");
const jwt = require('jsonwebtoken');
var bcrypt = require("bcrypt-nodejs");

module.exports = function (app) {

  // Using the passport.authenticate middleware with our local strategy.
  // If the user has valid login credentials, send them to the members page.
  // Otherwise the user will be sent an error
  app.post("/api/login", function (req, res) {
    db.User.findOne({
      where: {
        usuario: req.body.usuario
      }
    }).then(project => {

      if (project === null) {
        //console.log("No exite el usuario")
        return res.json({
          mensaje: "No user"
        });
      }
      else {
        const user = {
          usuario: project.usuario,
          role: project.role
        }
        //console.log("El req password es: " + req.body.password)
        //console.log("El project password es: " + project.password)
        //console.log(JSON.stringify(project))
        var passworIsvalid = bcrypt.compareSync(req.body.password, project.password)
        if (passworIsvalid) {
          jwt.sign({ user }, "secretkey", { expiresIn: "24h" }, (err, tk) => {
            res.json({
              token: tk,
              role: user.role,
            });
            console.log("Este es el token: " + token);
          });
        }
        else {
          res.json({
            mensaje: "Incorrect Password"
          })
        }
      }

    })

  })


  app.post("/api/signup", function (req, res) {
    console.log(req.body);
    db.User.create({
      email: req.body.email,
      password: req.body.password
    }).then(function () {
      res.redirect(307, "/api/login");
    }).catch(function (err) {
      console.log(err);
      res.json(err);
      // res.status(422).json(err.errors[0].message);
    });
  });

  // Route for logging user out
  app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
  });

  // Route for getting some data about our user to be used client side
  app.get("/api/user_data", verifyToken, (req, res) => {
    jwt.verify(req.token, "secretkey", (err, authData) => {
      if (err) {
        res.json(null);
      }
      else {
        res.json({
          authData
        })
      }
    })
  });

  //Verify Token
  function verifyToken(req, res, next) {
    //Get auth header value
    const bearerHeader = req.headers["x-token"];
    //Check if bearer is undefined
    if (typeof bearerHeader !== "undefined") {
      //Split at the space
      const bearer = bearerHeader.split(" ");
      //Get token from array
      const bearerToken = bearer[1];
      //Set the token
      req.token = bearerToken;
      //Next Middleware
      next();
    }
    else {
      res.sendStatus(403);
    }

  }

  //Dar de alta usuarios
  app.post("/api/usuarios", (req, res) => {
    db.User.create({
      usuario: req.body.usuario,
      password: req.body.password,
      role: req.body.role
    }).then(data => {
      res.json(data)
    }).catch(function (err) {
      console.log(err)
      res.json(err)
    })
  })

  //Dar de alta operadores
  app.post("/api/operadores", (req, res) => {
    db.Operador.create({
      nomina: req.body.nomina,
      nombre: req.body.nombre
    }).then(data => {
      res.json(data)
    }).catch(function (err) {
      console.log(err)
      res.json(err)
    })
  })

  //Obtener los operadores
  app.get("/api/operadores", (req, res) => {
    db.Operador.findAll({
      order:[
        ["nomina","ASC"]
      ]
    }).then(data => {
      res.json(data)
    }).catch(function (err) {
      console.log(err)
    })
  })

  //Borrar Operador
  app.delete("/borrar/operador/:id", (req,res)=>{
    db.Operador.destroy({
      where:{
        id:req.params.id
      }
    }).then(data=>{
      res.json(data)
    }).catch(function(err){
      console.log(err)
    })
  })

};

