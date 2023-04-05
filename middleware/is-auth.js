module.exports = (req, res, next) => {
  if (!req.session.user) {
    req.flash("errors", "Usuario no autorizado.");
    return res.redirect("/");
  }
  next();
};
