const Candidato = require("../models/Candidato");
const Partido = require("../models/Partido");
const Puesto = require("../models/Puesto");
const Eleccion = require("../models/Elecciones");
const Votos = require("../models/Votos");

// exports.getPage = (req, res) => {
//   res.render("ciudadano/votacion", {
//     pageTitle: "Votacion",
//   });
// };

exports.getVotacionPage = async (req, res, next) => {
  if (!req.session.eleccion) {
    req.flash("errors", "No hay ninguna eleccion activa.");
  }
  let puestos;
  try {
    puestos = await Puesto.findAll();
    puestos = puestos.map((result) => result.dataValues);
  } catch (error) {
    console.error('Error:', error);
  }


  res.status(200).render("ciudadano/votacion", {
    pageTitle: "Votacion",
    ciudadano: req.ciudadano.dataValues,
    eleccion: req.session.eleccion,
    puestos: puestos,
    votacionActive: true,
  });
};



exports.getVotacionPuestosPage = async (req, res, next) => {

  if (!req.session.eleccion) {
    req.flash("errors", "No hay ninguna eleccion activa.");
  }

  const puestoId = req.params.puestoId;
  const Ciudadano = req.session.ciudadano;

//! 
  let candidatos;
  let puesto;
  try {
    puesto = await Puesto.findOne({where: {Id: puestoId}});

    candidatos = await Candidato.findAll({include: { all: true } , where: {PuestoId: puestoId}});

    candidatos = candidatos.map((result) => {
      let temp = {...result.dataValues};
      temp.Puesto = temp.Puesto.dataValues;
      temp.Partido = temp.Partido.dataValues;
      return temp;
    });
    console.log(candidatos)
  } catch (error) {
    console.error('Error:', error);
  }
  res.status(200).render("ciudadano/votacion-puesto", {
    pageTitle: `${puesto.name} Votacion`,
    votacionActive: true,
    candidato: candidatos,
    ciudadano: Ciudadano,
    // puesto: puesto.name,
  });
};
// exports.puestosNoVotadosCiudadano = (req, res) => {
//   const PuestosNoVotados = req.session.puestosNoVotados;
//   let hasPuestos = req.session.hasPuestos;
//   let hasVotos = req.session.hasVotos;
//   if (!PuestosNoVotados || PuestosNoVotados.length < 1) {
//     return res.json({
//       ok: true,
//       hasPuestos: hasPuestos,
//       hasVotos:hasVotos,
//       mensaje: "No hay puestos por votar",
//     });
//   }

//   return res.json({
//     ok: true,
//     hasPuestos: hasPuestos,
//     hasVotos:hasVotos,
//     PuestosNoVotados,
//   });
// };

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
