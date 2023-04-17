const Puesto = require("../models/Puesto");
const Votos = require("../models/Votos");
const transporter = require("../service/Emailservice");

exports.ciudadanoAuth = (req, res, next) => {
  if (!req.session.ciudadano) {
    req.flash("errors", "You are not authorized to access this section");
    return res.redirect("/");
  }
  next();
};

exports.votingCiudadanoTracking = async (req, res, next) => {
  const Ciudadano = req.session.ciudadano;

  let puestos;
  try {
    puestos = await Puesto.findAll({ where: { status: true } });
    puestos = puestos.map((result) => {
      return { ...result.dataValues, utilizado: false };
    });
    let votos = await Votos.findAll({
      where: {
        CiudadanoId: Ciudadano.Id, // Segunda condición
      },
    });

    if (votos.length >= puestos.length) {
      await transporter.sendMail({
        from: "Elecciones notifications",
        to: Ciudadano.email,
        subject: `Participacion en eleccion electoral`,
        html: `Saludos, ${Ciudadano.name} usted ha completado satisfactoriamente su participacion en estas elecciones.`,
      });

      req.session.destroy((err) => {
        if (err) {
          console.log(err);
        } else {
          const successMessages = ["Usted ya ha ejercido su derecho al voto."];
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
  } catch (error) {
    console.error("Error:", error);
  }
};
