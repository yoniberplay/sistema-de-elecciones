const Partido = require("../models/Partido");
const Eleccion = require("../models/Elecciones");

exports.GetPartidoList = (req, res, next) => {
  Promise.all([
    Eleccion.findOne({ where: { status: true } }),
    Partido.findAll(),
  ])
    .then(([eleccion, partido]) => {
      res.render("partido/partido-list", {
        pageTitle: "Partido",
        partidoActive: true,
        partido: partido.map((result) => result.dataValues),
        hasPartido: partido.length > 0,
        hasEleccionActive: eleccion ? true : false,
      });
    })
    .catch((err) => {
      res.render("Error/ErrorInterno", {
        pageTitle: "Error Interno",
        mensaje: err,
      });
    });

  // Partido.findAll()
  //   .then((result) => {
  //     let partido = result.map((result) => result.dataValues);
  //     res.render("partido/partido-list", {
  //       pageTitle: "Partido",
  //       partidoActive: true,
  //       partido: partido,
  //       hasPartido: partido.length > 0,
  //     });
  //   })
  //   .catch((err) => {
  //     res.render("Error/ErrorInterno", {
  //       pageTitle: "Error Interno",
  //       mensaje: err,
  //     });
  //   });
};

exports.GetCreatePartido = (req, res, next) => {
  res.render("partido/save-partido", {
    pageTitle: "Create partido",
    partidoActive: true,
    editMode: false,
  });
};

exports.PostCreatePartido = (req, res, next) => {
  const name = req.body.name;
  const description = req.body.description;
  const imgLogo = req.file;
  const status = true;

  Partido.create({
    name: name,
    description: description,
    imgLogo: "/" + imgLogo.path,
    status: status,
  })
    .then((result) => {
      res.redirect("/partido");
    })
    .catch((err) => {
      res.render("Error/ErrorInterno", {
        pageTitle: "Error Interno",
        mensaje: err,
      });
    });
};

exports.GetEditPartido = (req, res, next) => {
  const edit = req.query.edit;
  const partidoId = req.params.partidoId;

  if (!edit) {
    return res.redirect("/partido");
  }

  Partido.findOne({ where: { Id: partidoId } })
    .then((result) => {
      const pue = result.dataValues;
      if (!pue) {
        return res.redirect("/partido");
      }
      res.render("partido/save-partido", {
        pageTitle: "Edit partido",
        partidoActive: true,
        editMode: edit,
        partido: pue,
      });
    })
    .catch((err) => {
      res.render("Error/ErrorInterno", {
        pageTitle: "Error Interno",
        mensaje: err,
      });
    });
};

exports.PostEditPartido = (req, res, next) => {
  const name = req.body.name;
  const description = req.body.description;
  const partidoId = req.body.partidoId;
  const imgLogo = req.file;

  Partido.findOne({ where: { Id: partidoId } })
    .then((result) => {
      const bk = result.dataValues;

      if (!bk) {
        return res.redirect("/partido");
      }
      const imagePath = imgLogo ? "/" + imgLogo.path : bk.img;
      Partido.update(
        {
          name: name,
          description: description,
          partidoId: partidoId,
          imgLogo: imagePath,
        },
        { where: { Id: partidoId } }
      )
        .then((result) => {
          return res.redirect("/partido");
        })
        .catch((err) => {
          res.render("Error/ErrorInterno", {
            pageTitle: "Error Interno",
            mensaje: err,
          });
        });
    })
    .catch((err) => {
      res.render("Error/ErrorInterno", {
        pageTitle: "Error Interno",
        mensaje: err,
      });
    });
};

exports.PostConfirmDeletePartido = (req, res, next) => {
  const partidoId = req.body.partidoId;

  const EleccionActiva = Eleccion.findOne({
    raw: true,
    where: { status: true },
  });

  //? No se puede eliminar si hay una eleccion
  if (EleccionActiva) {
    req.flash(
      "errors",
      "No se puede eliminar el Partido ya que hay una eleccion activa en el sistema"
    );
    return res.redirect("/user");
  }

  Partido.findOne({ where: { Id: partidoId } })
    .then((result) => {
      const put = result.dataValues;
      if (!put) {
        return res.redirect("/partido");
      }
      res.render("partido/confirm-delete-partido", {
        pageTitle: "Confirmacion",
        partido: put,
      });
    })
    .catch((err) => {
      res.render("Error/ErrorInterno", {
        pageTitle: "Error Interno",
        mensaje: err,
      });
    });
};

exports.PostDeletePartido = (req, res, next) => {
  const partidoId = req.body.partidoId;

  //! NO SE PUEDEN ELIMINAR NADA SOLO MOSTRAR O NO EN BASE A SU ESTATUS
  Partido.update({ status: false }, { where: { Id: partidoId } })
    .then((result) => {
      return res.redirect("/partido");
    })
    .catch((err) => {
      res.render("Error/ErrorInterno", {
        pageTitle: "Error Interno",
        mensaje: err,
      });
    });
};

exports.PostActivarPartido = async (req, res, next) => {
  const partidoId = req.body.partidoId;

  const partidoFound = await Partido.findByPk(partidoId);

  if (!partidoFound) {
    req.flash("errors", "Ese partido no fue encontrado en el sistema");
    return res.redirect("/partido");
  }
  //*ACTIVANDO CANDIDATO
  Partido.update({ status: true }, { where: { Id: partidoId } })
    .then((result) => {
      return res.redirect("/partido");
    })
    .catch((err) => {
      res.render("Error/ErrorInterno", {
        pageTitle: "Error Interno",
        mensaje: err,
      });
    });
};
