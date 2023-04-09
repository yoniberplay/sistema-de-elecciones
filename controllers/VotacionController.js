const Candidato = require("../models/Candidato");
const Partido = require("../models/Partido");
const Puesto = require("../models/Puesto");
const Eleccion = require("../models/Elecciones");
const Votos = require("../models/Votos");

exports.getPage = (req, res) => {
  res.render("ciudadano/votacion", {
    pageTitle: "Votacion",
  });
};

exports.getVotacionPage = (req, res, next) => {
  if (!req.session.eleccion) {
    req.flash("errors", "No hay ninguna eleccion activa.");
  }
  res.status(200).render("ciudadano/votacion", {
    pageTitle: "Votacion",
    ciudadano: req.ciudadano.dataValues,
    eleccion: req.session.eleccion,
    votacionActive: true,
  });
};

exports.puestosNoVotadosCiudadano = (req, res) => {
  const PuestosNoVotados = req.session.puestosNoVotados;

  if (!PuestosNoVotados || PuestosNoVotados.length < 1) {
    return res.json({
      ok: true,
      hasPuestos: false,
      mensaje: "no hay puestos por votar",
    });
  }

  return res.json({
    ok: true,
    hasPuestos: true,
    PuestosNoVotados,
  });
};

exports.GetCandidatoList = async (req, res, next) => {
  const puestoId = req.params.puestoId;

  if (!puestoId) {
    return res.json({
      ok: false,
      msg: "No se ha enviado el puesto",
    });
  }
  const candidatos = await Candidato.findAll({
    raw: true,
    where: { PuestoId: puestoId },
    include: [{ model: Partido }],
  });
  return res.json({
    candidatos: candidatos,
    hasCandidatos: candidatos.length > 0,
  });
};

exports.PostAddVotacion = (req, res, next) => {
  const CandidatoId = req.body.CandidatoId;
  const PuestoId = req.body.PuestoId;
  const CiudadanoId = req.session.ciudadano.Id;
  const EleccionesId = req.session.eleccion.Id;

  Votos.create({
    CandidatoId: CandidatoId,
    PuestoId: PuestoId,
    CiudadanoId: CiudadanoId,
    EleccioneId: EleccionesId,
  })
    .then((result) => {
      return res.json({
        ok: true,
      });
    })
    .catch((err) => {
      console.log(err);

      return res.json({
        ok: false,
      });
    });
};
