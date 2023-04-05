const Puesto = require("../models/Puesto");
const Eleccion = require("../models/Elecciones");

exports.GetPuestoList = (req, res, next) => {
  
  Puesto.findAll()
  .then((result) => {   
    let puestos = result.map((result) => result.dataValues);
      res.render("puesto/puesto-list", {
        pageTitle: "Puesto",
        puestoActive: true,
        puestos: puestos,
        hasPuestos: puestos.length > 0,
      });
    })  
    .catch((err) => {
        res.render("Error/ErrorInterno", {
            pageTitle: "Error Interno",
            mensaje: err,
          });
    });
};

exports.GetCreatePuesto = (req, res, next) => {

  const EleccionActiva = Eleccion.findOne({raw: true, where: {status: true}})
  
  //? No se puede crear si no hay una eleccion activa
  if (!EleccionActiva) {
    req.flash("errors", "No se puede crear puestos ya que no hay una eleccion activa en el sistema");
    return res.redirect("/user")
  }

  res.render("puesto/save-puesto", {
    pageTitle: "Create Puesto",
    puestoActive: true,
    editMode: false,
  });
};

exports.PostCreatePuesto = (req, res, next) => {
  const name = req.body.name;
  const description = req.body.description;
  const status = true;
  Puesto.create({ name: name, description: description, status: status })
    .then((result) => {
      res.redirect("/puesto");
    })
    .catch((err) => {
        res.render("Error/ErrorInterno", {
            pageTitle: "Error",
            mensaje: err,
          });
    });
};

exports.GetEditPuesto = (req, res, next) => {
  const edit = req.query.edit;
  const puestoId = req.params.puestoId;

  if (!edit) {
    return res.redirect("/puesto");
  }

  Puesto.findOne({ where: { Id: puestoId } })
    .then((result) => {
      const pue = result.dataValues;
      if (!pue) {
        return res.redirect("/puesto");
      }
      res.render("puesto/save-puesto", {
        pageTitle: "Edit Puesto",
        puestoActive: true,
        editMode: edit,
        puesto: pue,
      });
    })
    .catch((err) => {
        res.render("Error/ErrorInterno", {
            pageTitle: "Error Interno",
            mensaje: err,
          });
    });
};

exports.PostEditPuesto = (req, res, next) => {
  const name = req.body.name;
  const description = req.body.description;
  const puestoId = req.body.puestoId;

  Puesto.update({ name: name, description: description }, { where: { Id: puestoId } })
    .then((result) => {
      return res.redirect("/puesto");
    })
    .catch((err) => {
        res.render("Error/ErrorInterno", {
            pageTitle: "Error Interno",
            mensaje: err,
          });
    });
};

exports.PostConfirmDeletePuesto = (req, res, next) => {
  const puestoId = req.body.puestoId;

  const EleccionActiva = Eleccion.findOne({raw: true, where: {status: true}})
  
  //? No se puede eliminar si hay una eleccion
  if (EleccionActiva) {
    req.flash("errors", "No se puede eliminar el Puesto ya que hay una eleccion activa en el sistema");
    return res.redirect("/user")
  }

  Puesto.findOne({ where: { Id: puestoId } })
    .then((result) => {
      const put = result.dataValues;
      if (!put) {
        return res.redirect("/puesto");
      }
    res.render("puesto/confirm-delete-puesto", {
      pageTitle: "Confirmacion",
      puesto: put,
    });
  })
  .catch((err) => {
      res.render("Error/ErrorInterno", {
          pageTitle: "Error Interno",
          mensaje: err,
        });
  });
};

exports.PostDeletePuesto = (req, res, next) => {
    const puestoId = req.body.puestoId;

    // Puesto.destroy({ where: { id: puestoId } })
    // .then((result) => {
    //   return res.redirect("/puesto");
    // })
    // .catch((err) => {
    //     res.render("Error/ErrorInterno", {
    //         pageTitle: "Error Interno",
    //         mensaje: err,
    //       });
    // });
//! NO SE PUEDEN ELIMINAR NADA SOLO MOSTRAR O NO EN BASE A SU ESTATUS
    Puesto.update({ status: false }, { where: { Id: puestoId } })
    .then((result) => {
      return res.redirect("/puesto");
    })
    .catch((err) => {
        res.render("Error/ErrorInterno", {
            pageTitle: "Error Interno",
            mensaje: err,
          });
    });
};
