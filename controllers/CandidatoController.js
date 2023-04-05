const Candidato = require("../models/Candidato");
const Partido = require("../models/Partido");

const Puesto = require("../models/Puesto")
const Eleccion = require("../models/Elecciones")


exports.GetCandidatoList = (req, res, next) => {
  Candidato.findAll({include: [{ model: Partido }, { model: Puesto }]})
    .then((result) => {
      let candidato = result.map((result) => result.dataValues);

      Partido.findAll()
        .then((result) => {
          let partido = result.map((result) => result.dataValues);

          Puesto.findAll()
          .then((result) => {   
            let puestos = result.map((result) => result.dataValues);

            res.render("candidato/candidato-list", {
              pageTitle: "candidato",
              candidatoActive: true,
              candidato: candidato,
              partido: partido,
              puestos: puestos,
              hasCandidato: candidato.length > 0,
            });
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


const validationsBeforeCreate = async (req, res, next) => {

  const PartidoActivo = await Partido.findOne({raw: true, where: {status: true}});
  
  if (!PartidoActivo) {
    return {status: false, message: "Debe existing al menos 1 partido creado en el sistema"};
  }
  
  const PuestoActivo = await Puesto.findOne({raw: true, where: {status: true}});

  if (!PuestoActivo) {
    return {status: false, message: "Debe existing al menos 1 puesto activo  en el sistema"};

  }

  return true;

}

exports.GetCreateCandidato = async (req, res, next) => {

  const isValid = await validationsBeforeCreate();

  if (isValid.status) {
    res.render("candidato/save-candidato", {
      pageTitle: "Create candidato",
      candidatoActive: true,
      editMode: false,
        partido: partido,
            puestos: puestos,
            hasPuestos: puestos.length > 0,
            hasPartido: partido.length > 0,
    });
  } else {

    req.flash("erros", isValid.message)

    return res.redirect("/user");
  }
 
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

  Candidato.findOne({ where: { Id: candidatoId } })
    .then((result) => {
      const candidato = result.dataValues;

      if (!candidato) {
        return res.redirect("/candidato");
      }
      Partido.findAll()
        .then((result) => {
          let partido = result.map((result) => result.dataValues);

          Puesto.findAll()
            .then((result) => {   
              let puestos = result.map((result) => result.dataValues);

                res.render("candidato/save-candidato", {
                  pageTitle: "Edit candidato",
                  candidatoActive: true,
                  editMode: edit,
                  candidato: candidato,
                  partido: partido,
                  puestos: puestos,
                  hasCandidato: candidato.length > 0,
                  hasPuestos: puestos.length > 0,
                  hasPartido: partido.length > 0,
                });
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

exports.PostEditCandidato = (req, res, next) => {
  const candidatoId = req.body.candidatoId;
  const name = req.body.name;
  const lastName = req.body.lastName;
  const PartidoId = req.body.PartidoId;
  const PuestoId = req.body.PuestoId;
  const imgPerfil = req.file;

  Candidato.findOne({ where: { Id: candidatoId } })
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

  const EleccionActiva = Eleccion.findOne({raw: true, where: {status: true}})
  
  //? No se puede eliminar si hay una eleccion
  if (EleccionActiva) {
    req.flash("errors", "No se puede eliminar el candidato ya que hay una eleccion activa en el sistema");
    return res.redirect("/user")
  }

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
