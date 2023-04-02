const Elecciones = require("../models/Elecciones");

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

  Elecciones.findOne({ where: { id: eleccionId } })
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
    { name: name, fechaRealizacion: fechaRealizacion, },
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
