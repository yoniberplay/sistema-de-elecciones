const Ciudadano = require("../models/Ciudadano");
const Eleccion = require("../models/Elecciones");

exports.GetCiudadanoList = (req, res, next) => {
  Promise.all([
    Eleccion.findOne({ where: { status: true } }),
    Ciudadano.findAll(),
  ])
    .then(([eleccion, ciudadanos]) => {
      res.render("ciudadano/ciudadano-list", {
        pageTitle: "ciudadano",
        ciudadanoActive: true,
        ciudadano: ciudadanos.map((result) => result.dataValues),
        hasCiudadano: ciudadanos.length > 0,
        hasEleccionActive: eleccion ? true : false,
      });
    })
    .catch((err) => {
      res.render("Error/ErrorInterno", {
        pageTitle: "Error Interno",
        mensaje: err,
      });
    });
};

exports.GetCreateCiudadano = (req, res, next) => {
  res.render("ciudadano/save-ciudadano", {
    pageTitle: "Create Ciudadano",
    ciudadanoActive: true,
    editMode: false,
  });
};

exports.PostCreateCiudadano = (req, res, next) => {
  const IdDoc = req.body.IdDoc;
  const name = req.body.name;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const status = true;

  Ciudadano.create({
    name: name,
    IdDoc: IdDoc,
    lastName: lastName,
    status: status,
    email: email,
  })
    .then((result) => {
      res.redirect("/ciudadano");
    })
    .catch((err) => {
      res.render("Error/ErrorInterno", {
        pageTitle: "Error",
        mensaje: err,
      });
    });
};

exports.GetEditCiudadano = (req, res, next) => {
  const edit = req.query.edit;
  const ciudadanoId = req.params.ciudadanoId;

  if (!edit) {
    return res.redirect("/ciudadano");
  }

  Ciudadano.findOne({ where: { Id: ciudadanoId } })
    .then((result) => {
      const pue = result.dataValues;
      if (!pue) {
        return res.redirect("/ciudadano");
      }
      res.render("ciudadano/save-ciudadano", {
        pageTitle: "Edit ciudadano",
        ciudadanoActive: true,
        editMode: edit,
        ciudadano: pue,
      });
    })
    .catch((err) => {
      res.render("Error/ErrorInterno", {
        pageTitle: "Error Interno",
        mensaje: err,
      });
    });
};

exports.PostEditCiudadano = (req, res, next) => {
  const IdDoc = req.body.IdDoc;
  const name = req.body.name;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const ciudadanoId = req.body.ciudadanoId;

  Ciudadano.update(
    {
      name: name,
      IdDoc: IdDoc,
      lastName: lastName,
      email: email,
    },
    { where: { Id: ciudadanoId } }
  )
    .then((result) => {
      return res.redirect("/ciudadano");
    })
    .catch((err) => {
      res.render("Error/ErrorInterno", {
        pageTitle: "Error Interno",
        mensaje: err,
      });
    });
};

exports.PostConfirmDeleteCiudadano = (req, res, next) => {
  const ciudadanoId = req.body.ciudadanoId;

  const EleccionActiva = Eleccion.findOne({
    raw: true,
    where: { status: true },
  });

  //? No se puede eliminar si hay una eleccion
  if (EleccionActiva) {
    req.flash(
      "errors",
      "No se puede eliminar el Ciudadano ya que hay una eleccion activa en el sistema"
    );
    return res.redirect("/user");
  }

  Ciudadano.findOne({ where: { Id: ciudadanoId } })
    .then((result) => {
      const put = result.dataValues;
      if (!put) {
        return res.redirect("/ciudadano");
      }
      res.render("ciudadano/confirm-delete-ciudadano", {
        pageTitle: "Confirmacion",
        ciudadano: put,
      });
    })
    .catch((err) => {
      res.render("Error/ErrorInterno", {
        pageTitle: "Error Interno",
        mensaje: err,
      });
    });
};

exports.PostDeleteCiudadano = (req, res, next) => {
  const ciudadanoId = req.body.ciudadanoId;

  //! NO SE PUEDEN ELIMINAR NADA SOLO MOSTRAR O NO EN BASE A SU ESTATUS
  Ciudadano.update({ status: false }, { where: { Id: ciudadanoId } })
    .then((result) => {
      return res.redirect("/ciudadano");
    })
    .catch((err) => {
      res.render("Error/ErrorInterno", {
        pageTitle: "Error Interno",
        mensaje: err,
      });
    });
};

exports.PostActivarCiudadano = async (req, res, next) => {
  const ciudadanoId = req.body.ciudadanoId;

  const ciudadanoFound = await Ciudadano.findByPk(ciudadanoId);

  if (!ciudadanoFound) {
    req.flash("errors", "Ese ciudadano no fue encontrado en el sistema");
    return res.redirect("/ciudadano");
  }
  //*ACTIVANDO CIUDADANO
  Ciudadano.update({ status: true }, { where: { Id: ciudadanoId } })
    .then((result) => {
      return res.redirect("/ciudadano");
    })
    .catch((err) => {
      res.render("Error/ErrorInterno", {
        pageTitle: "Error Interno",
        mensaje: err,
      });
    });
};
