exports.getVotacionPage = (req, res) => {

    if (!req.session.eleccion) {
        req.flash("errors", "No hay ninguna eleccion activa.");
    }

    res.render('ciudadano/votacion', {
        pageTitle: 'Votacion'
    })
}