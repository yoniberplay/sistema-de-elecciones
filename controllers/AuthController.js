const User = require("../models/User");
const Ciudadano = require("../models/Ciudadano");
const Elecciones = require("../models/Elecciones");
const bcrypt = require("bcryptjs");

exports.GetLoginCiudadano = (req, res, next) => {
  res.render("auth/loginCiudadano", {
    pageTitle: "Sistema de Elecciones",
  });
};

exports.GetAdminHome = (req, res, next) => {
  res.render("auth/admin-home", {
    pageTitle: "Sistema de Elecciones",
  });
};

exports.PostLoginCiudadano = async (req, res, next) => {
  const cedula = req.body.cedula;
  
  try{
    const ciudadano = await Ciudadano.findOne({raw: true, where: { IdDoc: cedula } });

    if (!ciudadano) {
      req.flash("errors", "No existe ningun ciudadano con ese numero de cedula.");
      return res.redirect("/");
    }
    if(!ciudadano.status){
      req.flash("errors", "El ciudadano ingresado no esta activo.");
      return res.redirect("/");
    }

    const EleccionActiva =  await Elecciones.findOne({raw: true, where: { status: true }} )
    
    if (!EleccionActiva) {       
      req.flash("errors", "No hay ninguna eleccion activa.");
      return res.redirect("/");
    }

    req.flash("success", `Gracias por participar en ${EleccionActiva.name}`);

    req.session.eleccion = EleccionActiva;
    req.session.ciudadano = ciudadano;

    return req.session.save((err) => {
    
      return res.redirect("/votacion");
    })      

  } catch (err) {
    console.log(err);
    req.flash("errors", "Ha ocurrido un erro contacte a su administrador.");
    res.redirect("/");
  }
 
};

exports.GetLogin = (req, res, next) => {

  res.render("auth/login", {
    pageTitle: "Login",
    loginCSS: true,
    loginActive: true,   
  });
};

exports.PostLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ where: { email: email } })
    .then((user) => {
      if (!user) {
        req.flash("errors", "email is invalid ");
        return res.redirect("/login");
      }
      bcrypt
        .compare(password, user.password)
        .then((result) => {
          if (result) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save((err) => {
              console.log(err);
              res.redirect("/admin");
            });
          }
          req.flash("errors", "password is invalid");
          res.redirect("/login");
        })
        .catch((err) => {
          console.log(err);
           req.flash("errors", "An error has occurred contact the administrator.");
          res.redirect("/login");
        });
    })
    .catch((err) => {
      console.log(err);
          req.flash(
            "errors",
            "An error has occurred contact the administrator."
          );
      res.redirect("/login");
    });
};

exports.Logout = (req, res, next) => {
  req.session.destroy((err) => {
    if(err) {
      console.log(err);
    } else {
      res.redirect('/');
    }
  });
};

exports.GetSignup = (req, res, next) => {
  res.render("auth/signup", {
    pageTitle: "Signup",
    signupActive: true,
  });
};

exports.PostSignup = (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  if(password != confirmPassword){
       req.flash(
          "errors",
          "Password and confirm password no equals"
        );
        return res.redirect("/signup");
  }

  User.findOne({ where: { email: email } })
    .then((user) => {
      if (user) {
        req.flash(
          "errors",
          "email exits already, please pick a different one "
        );
        return res.redirect("/signup");
      }

      bcrypt
        .hash(password, 12)
        .then((hashedPassword) => {
          User.create({name: name, email: email, password: hashedPassword })
            .then((user) => {
              res.redirect("/login");
            })            
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};
