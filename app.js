const path = require("path");
const express = require("express");
const expressHbs = require("express-handlebars");
const sequelize = require("./util/database");
const Candidato = require("./models/Candidato");
const Elecciones = require("./models/Elecciones");
const Partido = require("./models/Partido");
const Puesto = require("./models/Puesto");
const User = require("./models/User");
const Ciudadano = require("./models/Ciudadano");
const EleccionPuesto = require("./models/EleccionPuesto");
const Votos = require("./models/Votos");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const session = require("express-session");
const flash = require("connect-flash");
require("dotenv").config();

//? Mejor manejo de rutas
const authRouter = require("./routes/auth");
const candidatoRoute = require("./routes/candidatoRoute");
const ciudadanoRoute = require("./routes/ciudadanoRoute");
const eleccionesRoute = require("./routes/eleccionesRoute");
const partidoRoute = require("./routes/partidoRoute");
const puestoRoute = require("./routes/puestoRoute");
const usuarioRouter = require("./routes/usuarioRouter");
const votacionRouter = require("./routes/votacionRouter");

const errorController = require("./controllers/ErrorController");

const app = express();

const compareHelpers = require("./util/helpers/hbs/compare");
const sumaHelpers = require("./util/helpers/hbs/sumar");

app.engine(
  "hbs",
  expressHbs({
    layoutsDir: "views/layouts/",
    defaultLayout: "main-layout",
    extname: "hbs",
    helpers: {
      equalValue: compareHelpers.EqualValue,
      sumarValue: sumaHelpers.sumar,
    },
  })
);

app.set("view engine", "hbs");
app.set("views", "views");

// Configura el middleware para analizar las solicitudes entrantes con el tipo de contenido "application/x-www-form-urlencoded" utilizando la biblioteca "qs".
app.use(express.urlencoded({ extended: false }));

// Convertir la data recibida por post en un json
app.use(express.json());

//Hacer los datos de la dentro de la carpeta public e images publicos
// app.use("/public",express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, uuidv4() + "-" + file.originalname);
  },
});

app.use(multer({ storage: fileStorage }).single("img"));

app.use(
  session({ secret: "anything", resave: true, saveUninitialized: false })
);

//? permite almacenar mensajes que deben ser mostrados
//? en la siguiente respuesta del servidor. Esto se utiliza
//? comúnmente para mostrar mensajes de error o éxito después
//? de una acción realizada por el usuario.
//! En este caso la usaremos para mostrar msj de error.
app.use(flash());

//? Guardar la persistencia del usuario, no solo los datos del mismo.
app.use((req, res, next) => {
  if (!req.session) {
    return next();
  } else if (req.session.user) {
    User.findByPk(req.session.user.Id)
      .then((user) => {
        req.user = user;

        next();
      })
      .catch((err) => {
        console.log(err);
      });
    //! CREAR CONTROLADOR DE LOGGIN CIUDADANO Y AGREGAR LO QUE SE NECESITARIA AQUI
  } else if (req.session.ciudadano) {
    Ciudadano.findByPk(req.session.ciudadano.Id)
      .then((ciudadano) => {
        req.ciudadano = ciudadano;
        //! agregar la persistencia de eleccion que viene en la session
        // console.log(ciudadano.dataValues);

        next();
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    return next();
  }
});

//? Con este middleware podemos tener estas propiedades disponibles en
//? las vistas hbs
app.use((req, res, next) => {
  const errors = req.flash("errors");
  const success = req.flash("success");

  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.isCiudadano = req.session.ciudadano ? true : false;

  res.locals.errorMessages = errors;
  res.locals.hasErrorMessages = errors.length > 0;

  res.locals.successMessages = success;
  res.locals.hasSuccessMessages = success.length > 0;

  next();
});

app.use(authRouter);
app.use(candidatoRoute);
app.use(ciudadanoRoute);
app.use(eleccionesRoute);
app.use(partidoRoute);
app.use(puestoRoute);
app.use(usuarioRouter);
app.use(votacionRouter);

app.use(errorController.Get404);

//? Relaciones de las tablas
Puesto.hasMany(Candidato);
Candidato.belongsTo(Puesto, { constraint: true, onDelete: "CASCADE" });

Elecciones.hasMany(Puesto);
Puesto.belongsTo(Elecciones, { constraint: true, onDelete: "CASCADE" });

Partido.hasMany(Candidato);
Candidato.belongsTo(Partido, { constraint: true, onDelete: "CASCADE" });

// Elecciones.belongsToMany(Puesto, { through: EleccionPuesto });
// Puesto.belongsToMany(Elecciones, { through: EleccionPuesto });
Elecciones.belongsToMany(Ciudadano, { through: Votos });
Ciudadano.belongsToMany(Elecciones, { through: Votos });

Votos.belongsTo(Candidato);
Votos.belongsTo(Ciudadano);
Votos.belongsTo(Puesto);
Votos.belongsTo(Elecciones);

Candidato.hasMany(Votos);
Ciudadano.hasMany(Votos);
Puesto.hasMany(Votos);
Elecciones.hasMany(Votos);

const PORT = process.env.PORT || 5000;

sequelize
  .sync()
  .then((result) => {
    app.listen(PORT);
    console.log(`Server running on http://localhost:${PORT}`);
  })
  .catch((err) => {
    console.log(err);
  });
