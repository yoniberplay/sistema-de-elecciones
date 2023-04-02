const Candidato = require("../models/Candidato");

exports.GetCandidatoList = (req, res, next) => {
  Candidato.findAll()
    .then((result) => {
      let candidato = result.map((result) => result.dataValues);
      res.render("candidato/candidato-list", {
        pageTitle: "candidato",
        candidatoActive: true,
        candidato: candidato,
        hasCandidato: candidato.length > 0,
      });
    })
    .catch((err) => {
      res.render("Error/ErrorInterno", {
        pageTitle: "Error Interno",
        mensaje: err,
      });
    });
};

exports.GetCreateCandidato = (req, res, next) => {
  res.render("candidato/save-candidato", {
    pageTitle: "Create candidato",
    candidatoActive: true,
    editMode: false,
  });
};

exports.PostCreateCandidato = (req, res, next) => {
  const name = req.body.name;
  const lastName = req.body.lastName;
  const PartidoId = req.body.PartidoId;
  const PuestoId = req.body.PuestoId;
  const imgPerfil = req.file;
  const status = true;

  Candidato.create({
    name: name,
    lastName: lastName,
    status: status,
    PartidoId: PartidoId,
    PuestoId: PuestoId,
    imgPerfil: "/" + imgPerfil.path,
  })
    .then((result) => {
      res.redirect("/candidato");
    })
    .catch((err) => {
      res.render("Error/ErrorInterno", {
        pageTitle: "Error",
        mensaje: err,
      });
    });
};

exports.GetEditCandidato = (req, res, next) => {
  const edit = req.query.edit;
  const candidatoId = req.params.candidatoId;

  if (!edit) {
    return res.redirect("/candidato");
  }

  Candidato.findOne({ where: { id: candidatoId } })
    .then((result) => {
      const pue = result.dataValues;
      if (!pue) {
        return res.redirect("/candidato");
      }
      res.render("candidato/save-candidato", {
        pageTitle: "Edit candidato",
        candidatoActive: true,
        editMode: edit,
        candidato: pue,
      });
    })
    .catch((err) => {
      res.render("Error/ErrorInterno", {
        pageTitle: "Error Interno",
        mensaje: err,
      });
    });
};

exports.PostEditCandidato = (req, res, next) => {
  const candidatoId = req.candidatoId;
  const name = req.body.name;
  const lastName = req.body.lastName;
  const PartidoId = req.body.PartidoId;
  const PuestoId = req.body.PuestoId;
  const imgPerfil = req.file;

  Candidato.findOne({ where: { id: candidatoId } })
    .then((result) => {
      const bk = result.dataValues;
      if (!bk) {
        return res.redirect("/");
      }
      const imagePath = imgPerfil ? "/" + imgPerfil.path : bk.img;
      Candidato.update(
        {
          name: name,
          PartidoId: PartidoId,
          lastName: lastName,
          PuestoId: PuestoId,
          imgPerfil: imagePath
        },
        { where: { Id: candidatoId } }
      )
        .then((result) => {
          return res.redirect("/candidato");
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      res.render("Error/ErrorInterno", {
        pageTitle: "Error Interno",
        mensaje: err,
      });
    });
};

exports.PostConfirmDeleteCandidato = (req, res, next) => {
  const candidatoId = req.body.candidatoId;

  Candidato.findOne({ where: { Id: candidatoId } })
    .then((result) => {
      const put = result.dataValues;
      if (!put) {
        return res.redirect("/candidato");
      }
      res.render("candidato/confirm-delete-candidato", {
        pageTitle: "Confirmacion",
        candidato: put,
      });
    })
    .catch((err) => {
      res.render("Error/ErrorInterno", {
        pageTitle: "Error Interno",
        mensaje: err,
      });
    });
};

exports.PostDeleteCandidato = (req, res, next) => {
  const candidatoId = req.body.candidatoId;

  //! NO SE PUEDEN ELIMINAR NADA SOLO MOSTRAR O NO EN BASE A SU ESTATUS
  Candidato.update({ status: false }, { where: { Id: candidatoId } })
    .then((result) => {
      return res.redirect("/candidato");
    })
    .catch((err) => {
      res.render("Error/ErrorInterno", {
        pageTitle: "Error Interno",
        mensaje: err,
      });
    });
};
