const User = require("../models/User");

exports.GetUserList = (req, res, next) => {
  User.findAll()
    .then((result) => {
      let user = result.map((result) => result.dataValues);
      res.render("user/user-list", {
        pageTitle: "Usuarios",
        userActive: true,
        user: user,
        hasUser: user.length > 0,
      });
    })
    .catch((err) => {
      res.render("Error/ErrorInterno", {
        pageTitle: "Error Interno",
        mensaje: err,
      });
    });
};

exports.GetCreateUser = (req, res, next) => {
  res.render("user/save-user", {
    pageTitle: "Create user",
    userActive: true,
    editMode: false,
  });
};

exports.PostCreateUser = (req, res, next) => {
  const name = req.body.name;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const userName = req.body.userName;
  const password = req.body.password;
  const status = true;

  User.create({
    name: name,
    lastName: lastName,
    email: email,
    userName: userName,
    password: password,
    status: status,
  })
    .then((result) => {
      res.redirect("/user");
    })
    .catch((err) => {
      res.render("Error/ErrorInterno", {
        pageTitle: "Error",
        mensaje: err,
      });
    });
};

exports.GetEditUser = (req, res, next) => {
  const edit = req.query.edit;
  const userId = req.params.userId;

  if (!edit) {
    return res.redirect("/user");
  }

  User.findOne({ where: { id: userId } })
    .then((result) => {
      const pue = result.dataValues;
      if (!pue) {
        return res.redirect("/user");
      }
      res.render("user/save-user", {
        pageTitle: "Edit user",
        userActive: true,
        editMode: edit,
        user: pue,
      });
    })
    .catch((err) => {
      res.render("Error/ErrorInterno", {
        pageTitle: "Error Interno",
        mensaje: err,
      });
    });
};

exports.PostEditUser = (req, res, next) => {
  const userId = req.body.userId;
  const name = req.body.name;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const userName = req.body.userName;
  const password = req.body.password;

  User.update(
    { name: name, lastName: lastName, email: email, password: password, userName: userName },
    { where: { Id: userId } }
  )
    .then((result) => {
      return res.redirect("/user");
    })
    .catch((err) => {
      res.render("Error/ErrorInterno", {
        pageTitle: "Error Interno",
        mensaje: err,
      });
    });
};

exports.PostConfirmDeleteUser = (req, res, next) => {
  const userId = req.body.userId;

  User.findOne({ where: { Id: userId } })
    .then((result) => {
      const put = result.dataValues;
      if (!put) {
        return res.redirect("/user");
      }
      res.render("user/confirm-delete-user", {
        pageTitle: "Confirmacion",
        user: put,
      });
    })
    .catch((err) => {
      res.render("Error/ErrorInterno", {
        pageTitle: "Error Interno",
        mensaje: err,
      });
    });
};

exports.PostDeleteUser = (req, res, next) => {
  const userId = req.body.userId;

  //! NO SE PUEDEN ELIMINAR NADA SOLO MOSTRAR O NO EN BASE A SU ESTATUS
  User.update({ status: false }, { where: { Id: userId } })
    .then((result) => {
      return res.redirect("/user");
    })
    .catch((err) => {
      res.render("Error/ErrorInterno", {
        pageTitle: "Error Interno",
        mensaje: err,
      });
    });
};
