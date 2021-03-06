var db = require("../models");
var isAuthenticated = require("../config/middleware/isAuthenticated");

module.exports = function (app) {
  // Load index page
  app.get("/", function (req, res) {
    res.status(200)
          res.render("index", {
          title: "home",
          active_home: {
            Register: true,
          },
         
        });
  

  });


  //Get produccion page
  app.get("/produccion", isAuthenticated, function (req, res) {
    //console.log(req.user)
    if (req.user.role === "admin" || req.user.role === "produccion") {
      res.status(200);
      db.Daimler.findAll({
        limit: 6,
        order: [["createdAt", "DESC"]],

      })
        .then(function (dbDaimler) {
          res.render("produccion", {
            title: "produccion",
            active_produccion: {
              Register: true,
            },
            etiqueta: dbDaimler,
          });
        });
    }
    else{
      res.render("404")
    }
  });


  //Esto sirve para cambiar el CSS cuando entras a consulta, con el actvie_consulta
  app.get("/consulta", isAuthenticated, function (req, res) {
    if (req.user.role === "admin") {
      res.status(200);
      res.render("consulta", {
        title: "consulta",
        active_consulta: {
          Register: true,
        },
      })
    }
    else{
      res.render("404")
    }
  });

  //Este te permite ver los datos de una etiqueta en particular
  app.get("/consulta/:serie", isAuthenticated, function (req, res) {
    if (req.user.role === "admin") {
      db.Daimler.findAll({

        where: {
          $or: {
            serial: req.params.serie,
            etiqueta_remplazada: req.params.serie,
          }
        },

      })
        .then(function (dbDaimler) {
          res.render("consulta", {
            title: "consulta",
            active_consulta: {
              Register: true,
            },
            etiqueta: dbDaimler,
          });
          //console.log(dbDaimler);
        });
    }
    else{
      res.render("404")
    }
  });

  //Cargar la tabla de registros
  app.get("/tabla/:registros", isAuthenticated, function (req, res) {
    if (req.user.role === "admin") {
      db.Daimler.findAll({
        limit: parseInt(req.params.registros),
        order: [["createdAt", "DESC"]],

      })
        .then(function (dbDaimler) {
          res.render("tabla", {
            title: "tabla",
            active_consulta: {
              Register: true,
            },
            etiqueta: dbDaimler,

          });
          //console.log(dbDaimler)
        });
    }
    else{
      res.render(404)
    }
  });

  // Carga la pagina tabla
  app.get("/tabla", isAuthenticated, function (req, res) {
    if (req.user.role === "admin") {
      res.status(200);
      res.render("tabla", {
        title: "tabla",
        active_consulta: {
          Register: true,
        },
      });
    }
    else{
      res.render("404")
    }
  });

  // Carga la pagina para dar de alta usuarios
  app.get("/alta", isAuthenticated, function (req, res) {
    if(req.user.role==="admin"){
    res.status(200);
    res.render("alta", {
      title: "alta",
      active_alta: {
        Register: true,
      },
    });
  }
  else{
    res.render("404")
  }
  });



  // Load example page and pass in an example by id
  app.get("/cambiar", isAuthenticated, function (req, res) {
    res.sendFile(path.join(__dirname, ".cambiar.html"));
  });

  //Load GP12 inspection page
  app.get("/gp12", isAuthenticated, function (req, res) {
    if(req.user.role==="admin" || req.user.role==="inspector"){
    res.status(200);
    db.Daimler.findAll({
      limit: 6,
      order: [["createdAt", "DESC"]],

    })
      .then(function (dbDaimler) {
        res.render("gp12", {
          title: "gpq2",
          active_gp12: {
            Register: true,
          },
          etiqueta: dbDaimler,
        });
      });
    }
    else{
      res.render("404")
    }
  });


  // Render 404 page for any unmatched routes
  app.get("*", function (req, res) {
    res.render("404");
  });


}
