module.exports = (req, res, next) => {
    if (req.session.user) {
      return res.redirect("/admin");
    }
    if (req.session.ciudadano) {
        //! VALIDAR LOS VOTOS QUE HA ECHO ESE CIUDADANO Y EN BASE A ESO REDIRECCIONARLO A SU PAGINA CORRESPONDIENTE PARA QUE ACABE EL PROCESO DE ELECCION
        return res.redirect("/asdf");
      }
    next();
  };