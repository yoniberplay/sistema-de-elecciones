const Puesto = require("../models/Puesto");
const Voto = require("../models/Votos");

exports.ciudadanoAuth = (req, res, next) => {
  if (!req.session.ciudadano) {
    req.flash("errors", "You are not authorized to access this section");
    return res.redirect("/");
  }
  next();
};

exports.votingCiudadanoTracking = async (req, res, next) => {
  const Ciudadano = req.session.ciudadano
  //! SE DEBE VALIDAR QUE EL VOTO Y EL PUESTO SEA DE LA SELECCION EN CURSO
  const Votos = await Voto.findAll({raw: true, where: {CiudadanoId: Ciudadano.Id}});
  const Puestos = await Puesto.findAll({raw: true});
  let hasPuestos = true;
  if( Puestos.length <= 0 ){
    hasPuestos = false;
  }
  let hasVotos = true;
  if( Votos.length <= 0 ){
    hasVotos = false;
  } 
    
  //? mi logica es recorrer en un bucle anidado los votos que tiene el ciudadano
  //? y mapear los puestos a los que no ha votado asi puedo elegir que puesto votara 
  //? a continuacion

  const puestosYaVotados = [];

  Votos.forEach(e => {
   
    Puestos.forEach( p => {
   
      if (e.PuestoId === p.Id) {
        puestosYaVotados.push(p)
      }
    })
  })

  const puestosNoVotados = Puestos.filter(puesto => !puestosYaVotados.find(p => p.Id === puesto.Id));
 
  

  // console.log(puestosNoVotados)
  //?Almacenar el listado de los puestos
  req.session.puestosNoVotados = puestosNoVotados
  req.session.hasPuestos = hasPuestos
  req.session.hasVotos = hasVotos
  
  next();
}