const Puesto = require("../models/Puesto");
const Voto = require("../models/Votos");

exports.ciudadanoAuth = (req, res, next) => {
  if (!req.session.ciudadano) {
    req.flash("errors", "You are not authorized to access this section");
    return res.redirect("/");
  }
  next();
};

exports.votingCiudadanoTracking = async (req, res, next) => {
  const Ciudadano = req.session.ciudadano

  // const Votos = await Voto.findAll({raw: true, where: {CiudadanoId: Ciudadano.Id}})
  // const Puestos = await Puesto.findAll({raw: true})
  const Votos = [];
  const Puestos = [];

  Voto.findAll({where: {CiudadanoId: Ciudadano.Id}}).then((r) => {
    const x = r.map(p => p.getDataValue)

    x.forEach(e => {
      Puestos.push(e)
      console.log(e);
    })
  })

  const pendingForVote = Puestos.filter(p => p.id != Ciudadano.Id)

  console.log(Votos, "\n", Puestos, "\n", pendingForVote);

  next();
}