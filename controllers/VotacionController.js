
exports.getPage = (req, res) => {
    res.render('ciudadano/votacion', {
        pageTitle: 'Votacion',
    })
}

exports.getVotacionPage = (req, res, next) => {
    
    if (!req.session.eleccion) {
        req.flash("errors", "No hay ninguna eleccion activa.");
    }        
     res.status(200).render('ciudadano/votacion', {
        pageTitle: 'Votacion',
        ciudadano: req.ciudadano.dataValues,
        eleccion: req.session.eleccion, 
    })
}