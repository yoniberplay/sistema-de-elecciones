


fetch("http://localhost:5000/puestosNoVotados")
  .then((response) => response.json())
  .then((data) => {
    const titulo = document.querySelector("#textToDo");

    if (data.hasPuestos) {
      printPuestos(data.PuestosNoVotados);
    } else {
      titulo.textContent = "No hay puestos creados!";
      titulo.classList.remove("text-white");
      titulo.classList.add("text-danger");
    }
  })
  .catch((error) => console.error(error));

function getCandidatos(puestoId) {
  return fetch(`http://localhost:5000/getCandidatoList/${puestoId}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.hasCandidatos) {
        return data.candidatos;
      } else {
        return [];
      }
    })
    .catch((error) => console.error(error));
}
