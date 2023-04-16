const Puesto = require("../models/Puesto");
const Votos = require("../models/Votos");

exports.ciudadanoAuth = (req, res, next) => {
  if (!req.session.ciudadano) {
    req.flash("errors", "You are not authorized to access this section");
    return res.redirect("/");
  }
  next();
};

exports.votingCiudadanoTracking = async (req, res, next) => {
  const Ciudadano = req.session.ciudadano;
  const Eleccion = req.session.eleccion;

  let puestos;
  try {
    puestos = await Puesto.findAll({ where: { EleccioneId: Eleccion.Id } });
    puestos = puestos.map((result) => {
      return { ...result.dataValues, utilizado: false };
    });
    let votos = await Votos.findAll({
      where: {
        CiudadanoId: Ciudadano.Id,
        EleccioneId: Eleccion.Id, // Segunda condición
      },
    });
    if (puestos.length > 0) {
      if (votos.length >= puestos.length) {
        req.session.destroy((err) => {
          if (err) {
            console.log(err);
          } else {
            const successMessages = [
              "Usted ya ha ejercido su derecho al voto.",
            ];
            res.render("auth/loginCiudadano", {
              pageTitle: "Sistema de Elecciones",
              hasSuccessMessages: true,
              isCiudadano: false,
              successMessages: successMessages,
            });
          }
        });
      } else {
        next();
      }
    } else {
      next();
    }
  } catch (error) {
    console.error("Error:", error);
  }
};
