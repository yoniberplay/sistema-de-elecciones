const Elecciones = require("../models/Elecciones");
const Voto = require("../models/Votos");

const Candidato = require("../models/Candidato");
const Partido = require("../models/Partido");
const Puesto = require("../models/Puesto");

async function hay2CandidatosPorPuesto() {
  const candidatos = await Candidato.findAll({
    raw: true,
    where: { status: true },
    include: {
      model: Puesto,
      where: { status: true },
    },
  });
  if (candidatos?.length > 0) {
    console.log(candidatos);

    const candidatosAgrupados = candidatos.reduce((acc, curr) => {
      const puestoName = curr["Puesto.name"];
      if (!acc[puestoName]) {
        acc[puestoName] = [];
      }
      acc[puestoName].push(curr);
      return acc;
    }, {});

    let hay2CandidatosPorPuesto = true;

    for (const puesto in candidatosAgrupados) {
      if (candidatosAgrupados[puesto].length < 3) {
        hay2CandidatosPorPuesto = false;
        break;
      }
    }
    return hay2CandidatosPorPuesto;
  } else {
    return false;
  }
}

exports.GetEleccionesList = async (req, res, next) => {
  let thereisCandidatos = await hay2CandidatosPorPuesto();
  // console.log(thereisCandidatos);

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
        thereisCandidatos: thereisCandidatos,
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

exports.PostCreateEleccion = async (req, res, next) => {
  const name = req.body.name;
  const fechaRealizacion = req.body.fechaRealizacion || Date.now();
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

exports.PostActivarEleccion = async (req, res, next) => {
  const eleccionId = req.body.eleccionId;

  const eleccionFound = await Elecciones.findByPk(eleccionId);

  if (!eleccionFound) {
    req.flash("errors", "Esa eleccion no fue encontrado en el sistema");
    return res.redirect("/eleccion");
  }
  //*ACTIVANDO ELECCION
  Elecciones.update({ status: true }, { where: { Id: eleccionId } })
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
  let eleccionInfo;

  if (!eleccionId) {
    return res.redirect("/eleccion");
  }
  const eleccion = await Elecciones.findByPk(eleccionId, { raw: true });

  if (eleccion !== null) {
    eleccionInfo = await eleccionPuestosInfo(eleccionId);
  } else {
    return res.redirect("/eleccion");
  }

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

  // const Puestos = await Puesto.findAll({ raw: true, where: { eleccionId } });
  const Puestos = await Puesto.findAll({
    raw: true,
    where: { EleccioneId: eleccionId },
  });

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
