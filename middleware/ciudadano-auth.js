const Candidato = require("../models/Candidato");
const Puesto = require("../models/Puesto");
const Votos = require("../models/Votos");
const Partido = require("../models/Partido");
const transporter = require("../service/Emailservice");

exports.ciudadanoAuth = (req, res, next) => {
  if (!req.session.ciudadano) {
    req.flash("errors", "You are not authorized to access this section");
    return res.redirect("/");
  }
  next();
};

exports.votingCiudadanoTracking = async (req, res, next) => {
  const Ciudadano = req.session.ciudadano;
  const eleccionActiva = req.session.eleccion;

  let puestos;
  try {
    puestos = await Puesto.findAll({ where: { status: true } });
    puestos = puestos.map((result) => {
      return { ...result.dataValues, utilizado: false };
    });
    let votos = await Votos.findAll({
      raw: true,
      where: {
        CiudadanoId: Ciudadano.Id,
        EleccioneId: eleccionActiva.Id, // Segunda condición
      },
      include: [
        { model: Puesto },
        {
          model: Candidato,
          include: { model: Partido },
        },
      ],
    });

    if (votos.length >= puestos.length) {
      const ciudadanoBoleta = votos
        .map((voto) => {
          return `
      <tr>
        <td>${voto["Puesto.name"]}</td>
        <td>${voto["Candidato.name"]}</td>
        <td>${voto["Candidato.Partido.name"]}</td>
      </tr>
    `;
        })
        .join("");

      const emailHTML = `
  <html>
    <head>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-KK94CHFLLe+nY2dmCWGMq91rCGa5gtU4mk92HdvYe+M/SXH301p5ILy+dN9+nJOZ" crossorigin="anonymous">
    <style>
      table {
        font-family: arial, sans-serif;
        border-collapse: collapse;
        width: 100%;
      }

      td, th {
        border: 1px solid #dddddd;
        text-align: left;
        padding: 8px;
      }

      tr:nth-child(even) {
        background-color: #dddddd;
      }

      th {
        background-color: #4CAF50;
        color: white;
      }
    </style>

    </head>
    <body>
      <h2>Saludos, ${Ciudadano.name}. Usted ha completado satisfactoriamente su participación en estas elecciones.</h2>
      <p>A continuación, le presentamos la lista de sus votos:</p>
      <table>
        <thead>
          <tr>
            <th>Puesto</th>
            <th>Candidato</th>
            <th>Partido</th>
          </tr>
        </thead>
        <tbody>
          ${ciudadanoBoleta}
        </tbody>
      </table>
    </body>
  </html>
`;

      await transporter.sendMail({
        from: "Elecciones notifications",
        to: Ciudadano.email,
        subject: `Participación en elección electoral`,
        html: emailHTML,
      });

      req.session.destroy((err) => {
        if (err) {
          console.log(err);
        } else {
          const successMessages = ["Usted ya ha ejercido su derecho al voto."];
          res.render("auth/loginCiudadano", {
            pageTitle: "Sistema de Elecciones",
            hasSuccessMessages: true,
            isCiudadano: false,
            successMessages: successMessages,
          });
        }
      });
    } else {
      next();
    }
  } catch (error) {
    console.error("Error:", error);
  }
};
