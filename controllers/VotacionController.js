exports.getVotacionPage = (req, res) => {

    if (!req.session.eleccion) {
        req.flash("errors", "No hay ninguna eleccion activa.");
    }
    console.log(req.session.eleccion)
    res.render('ciudadano/votacion', {
        pageTitle: 'Votacion',
        ciudadano: req.ciudadano.dataValues,
        eleccion: req.session.eleccion, 
           })
}