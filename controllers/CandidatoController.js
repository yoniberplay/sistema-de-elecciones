const Candidato = require("../models/Candidato");
const Partido = require("../models/Partido");

const Puesto = require("../models/Puesto");
const Eleccion = require("../models/Elecciones");

exports.GetCandidatoList = (req, res, next) => {
  Promise.all([
    Candidato.findAll({
      include: [{ model: Partido }, { model: Puesto }],
    }),
    Eleccion.findOne({ raw: true, where: { status: true } }),
  ])
    .then(([candidatos, eleccion]) => {
      res.render("candidato/candidato-list", {
        pageTitle: "candidato",
        candidatoActive: true,
        candidatos: candidatos.map((p) => p.dataValues),
        hasCandidato: candidatos.length > 0,
        eleccionActiva: eleccion ? true : false,
      });
    })
    .catch((err) => {
      res.render("Error/ErrorInterno", {
        pageTitle: "Error Interno",
        mensaje: err,
      });
    });
};

async function insertDefaultCandidate() {
  const puestos = await Puesto.findAll({ raw: true, where: { status: true } });

  if (puestos) {
    for (puestoIndex in puestos) {
      const puestoId = puestos[puestoIndex]?.Id;
      const candidato = await Candidato.findOne({
        where: { name: "NINGUNO", puestoId: puestoId },
      });

      if (!candidato) {
        await Candidato.create({
          name: "NINGUNO",
          lastName: "NINGUNO",
          status: true,
          PartidoId: 1,
          PuestoId: puestoId,
          imgPerfil: "/",
        });
      }
    }
  }
}
exports.GetCreateCandidato = async (req, res, next) => {
  try {
    const [partidos, puestos] = await Promise.all([
      Partido.findAll({ raw: true, where: { status: true } }),
      Puesto.findAll({ raw: true, where: { status: true } }),
    ]);

    if(partidos.length <= 0){
      req.flash("errors", "Para la creacion de un candidado es necesario crear la menos un partido politico.");
      return res.redirect("/candidato");
    }
    

    await insertDefaultCandidate();

    return res.render("candidato/save-candidato", {
      pageTitle: "Create candidato",
      candidatoActive: true,
      editMode: false,
      partido: partidos,
      puestos: puestos,
      hasPuestos: puestos.length > 0,
      hasPartido: partidos.length > 0,
    });
  } catch (err) {
    console.log(err);
    res.render("Error/ErrorInterno", {
      pageTitle: "Error",
      mensaje: err,
    });
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
      Partido.findAll().then((result) => {
        let partido = result.map((result) => result.dataValues);

        Puesto.findAll().then((result) => {
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
          imgPerfil: imagePath,
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

  const EleccionActiva = Eleccion.findOne({
    raw: true,
    where: { status: true },
  });

  //? No se puede eliminar si hay una eleccion
  if (EleccionActiva) {
    req.flash(
      "errors",
      "No se puede eliminar el candidato ya que hay una eleccion activa en el sistema"
    );
    return res.redirect("/user");
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

exports.PostActivarCandidato = async (req, res, next) => {
  const candidatoId = req.body.candidatoId;
  const candidatoFound = await Candidato.findByPk(candidatoId);

  if (!candidatoFound) {
    req.flash("errors", "Ese candidato no fue encontrado en el sistema");
    return res.redirect("/candidato");
  }
  //*ACTIVANDO CANDIDATO
  Candidato.update({ status: true }, { where: { Id: candidatoId } })
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
