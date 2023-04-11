const Elecciones = require("../models/Elecciones");
const Voto = require("../models/Votos");

const Candidato = require("../models/Candidato");
const Partido = require("../models/Partido");
const Puesto = require("../models/Puesto");

function myFunction() {
  alert("Hello! I am an alert box!");
}

exports.GetEleccionesList = (req, res, next) => {
  Elecciones.findAll()
    .then((result) => {
      
      let eleccion = result
        .map((result) => result.dataValues)
        .sort((a, b) => b.status - a.status);


      let canCreateEleccion = eleccion.find((e) => e.status === true);
      res.render("eleccion/eleccion-list", {
        pageTitle: "eleccion",
        eleccionActive: true,
        eleccion: eleccion,
        canCreateEleccion: canCreateEleccion,
        hasEleccion: eleccion.length > 0,
      });
    })
    .catch((err) => {
      res.render("Error/ErrorInterno", {
        pageTitle: "Error Interno",
        mensaje: err,
      });
    });
};

exports.GetCreateEleccion = (req, res, next) => {
  res.render("eleccion/save-eleccion", {
    pageTitle: "Create eleccion",
    eleccionActive: true,
    editMode: false,
  });
};

exports.PostCreateEleccion = (req, res, next) => {
  const name = req.body.name;
  const fechaRealizacion = req.body.fechaRealizacion;
  const status = true;

  Elecciones.create({
    name: name,
    fechaRealizacion: fechaRealizacion,
    status: status,
  })
    .then((result) => {
      res.redirect("/eleccion");
    })
    .catch((err) => {
      res.render("Error/ErrorInterno", {
        pageTitle: "Error",
        mensaje: err,
      });
    });
};

exports.GetEditEleccion = (req, res, next) => {
  const edit = req.query.edit;
  const eleccionId = req.params.eleccionId;

  if (!edit) {
    return res.redirect("/eleccion");
  }

  Elecciones.findOne({ where: { Id: eleccionId } })
    .then((result) => {
      const pue = result.dataValues;
      if (!pue) {
        return res.redirect("/eleccion");
      }
      res.render("eleccion/save-eleccion", {
        pageTitle: "Edit eleccion",
        eleccionActive: true,
        editMode: edit,
        eleccion: pue,
      });
    })
    .catch((err) => {
      res.render("Error/ErrorInterno", {
        pageTitle: "Error Interno",
        mensaje: err,
      });
    });
};

exports.PostEditEleccion = (req, res, next) => {
  const name = req.body.name;
  const fechaRealizacion = req.body.fechaRealizacion;
  const eleccionId = req.body.eleccionId;

  Elecciones.update(
    { name: name, fechaRealizacion: fechaRealizacion },
    { where: { Id: eleccionId } }
  )
    .then((result) => {
      return res.redirect("/eleccion");
    })
    .catch((err) => {
      res.render("Error/ErrorInterno", {
        pageTitle: "Error Interno",
        mensaje: err,
      });
    });
};

exports.PostConfirmDeleteEleccion = (req, res, next) => {
  const eleccionId = req.body.eleccionId;

  Elecciones.findOne({ where: { Id: eleccionId } })
    .then((result) => {
      const put = result.dataValues;
      if (!put) {
        return res.redirect("/eleccion");
      }
      res.render("eleccion/confirm-delete-eleccion", {
        pageTitle: "Confirmacion",
        eleccion: put,
      });
    })
    .catch((err) => {
      res.render("Error/ErrorInterno", {
        pageTitle: "Error Interno",
        mensaje: err,
      });
    });
};

exports.PostDeleteElecciones = (req, res, next) => {
  const eleccionId = req.body.eleccionId;

  //! NO SE PUEDEN ELIMINAR NADA SOLO MOSTRAR O NO EN BASE A SU ESTATUS
  Elecciones.update({ status: false }, { where: { Id: eleccionId } })
    .then((result) => {
      return res.redirect("/eleccion");
    })
    .catch((err) => {
      res.render("Error/ErrorInterno", {
        pageTitle: "Error Interno",
        mensaje: err,
      });
    });
};

exports.GetResultadosElecciones = async (req, res, next) => {
  const eleccionId = req.params.eleccionId;

  if (!eleccionId) {
    return res.redirect("/user");
  }

  const eleccion = await Elecciones.findByPk(eleccionId, { raw: true });

  const eleccionInfo = await eleccionPuestosInfo(eleccionId);
  // res.json({
  //   eleccionInfo
  // })
  res.status(200).render("eleccion_resultado/resultado", {
    puestos: eleccionInfo,
    hasPuestos: eleccionPuestosInfo.length > 0,
    eleccion,
  });
};

async function eleccionPuestosInfo(eleccionId) {
  const Votos = await Voto.findAll({
    raw: true,
    where: { EleccioneId: eleccionId },
    include: [{ model: Elecciones }, { model: Candidato }, { model: Puesto }],
  });

  const Candidatos = await Candidato.findAll({ raw: true });

  const Puestos = await Puesto.findAll({ raw: true, where: { eleccionId } });

  const Partidos = await Partido.findAll({ raw: true });

  const candidatosEleccion = Candidatos.map((p) => {
    const candidato = {
      id: p.Id,
      name: p.name,
      lastName: p.lastName,
      puestoId: p.PuestoId,
      img: p.imgPerfil,
      partidoId: p.PartidoId,
    };
    candidato.votos = Votos.filter(
      (v) => v["Candidato.Id"] === candidato.id
    ).length;
    candidato.partido = Partidos.filter((v) => v.Id === candidato.partidoId);
    candidato.porcentaje = Math.round((candidato.votos / Votos.length) * 100);
    return candidato;
  });

  const eleccionPuestos = Puestos.map((p) => {
    const id = p.Id;
    const candidatos = candidatosEleccion.filter((f) => f.puestoId === id);
    candidatos.sort((a, b) => b.votos - a.votos);

    return {
      id: id,
      name: p.name,
      candidatos,
    };
  });

  return eleccionPuestos;
}
