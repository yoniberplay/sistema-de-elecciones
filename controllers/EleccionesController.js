const Elecciones = require("../models/Elecciones");
const Voto = require("../models/Votos");

const Candidato = require("../models/Candidato");
const Partido = require("../models/Partido");
const Puesto = require("../models/Puesto");

exports.GetEleccionesList = (req, res, next) => {
  Elecciones.findAll()
    .then((result) => {
      let eleccion = result.map((result) => result.dataValues);
      res.render("eleccion/eleccion-list", {
        pageTitle: "eleccion",
        eleccionActive: true,
        eleccion: eleccion,
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
  //? En la opción de Elecciones, se muestra un listado con las elecciones realizado, en
  //? este listado debe existir una opcion que me permita ver los resultados de esa
  //? elección( se debe mostrar los puestos que se disputaron, los candidatos para cada
  //? puesto, la cantidad de votos que recibieron y el porcentaje que sacaron organizado
  //? del más alto el ganador hasta el más bajo).
  
  //Todo: En ese listado debe mostrar cual es la elección que está activa y sobre la elección
  //Todo: activa solo debe mostrar la opción de finalizar, una vez pulsado sobre finalizar
  //Todo: ningún elector podrá seguir votando sobre la misma y se podrá acceder a la opción
  //Todo: de resultados para ver los ganadores de los comicios.

  const eleccionId = req.params.eleccionId;
  
  if (!eleccionId) {
    return res.redirect("/user");
  }

  const Votos = await Voto.findAll({
    raw: true,
    where: { EleccioneId: eleccionId },
    include: [{model: Elecciones}, {model: Candidato}, {model: Puesto}]
  });

  const candidatosEleccion = Votos.map(p => {
    const candidato = {
      id: p['Candidato.Id'],
      name: p['Candidato.name'],
      lastName: p['Candidato.lastName'],
      puestoId: p['Candidato.PuestoId'],
      img: p['Candidato.imgPerfil'],
      partidoId: p['Candidato.PartidoId'],
    }
    candidato.votos = Votos.filter(v => v['Candidato.Id'] === candidato.id).length;
    return candidato
  })

  const eleccionPuestos = Votos.map(p => {
    const id = p['Puesto.Id']
    const candidatos = candidatosEleccion.filter(f => f.puestoId === id)
    candidatos.sort((a, b) => b.votos - a.votos)
    return {
      id: id,
      name: p['Puesto.name'],
      candidatos
    }
  })

  return res.status(200).json({
    eleccionPuestos,
    ok: true
  })
};
