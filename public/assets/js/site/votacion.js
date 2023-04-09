
fetch("http://localhost:5000/puestosNoVotados")
  .then((response) => response.json())
  .then((data) => {
    const titulo = document.querySelector("#textToDo");

    if (data.hasPuestos) {
      printPuestos(data.PuestosNoVotados);
    } else {
      titulo.textContent = "Usted ya ha ejercido su derecho al voto!";
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

function postAddVotacion(candidato) {

  const voto = {
    CandidatoId: candidato.Id,
    PuestoId: candidato.PuestoId
  }

  fetch('http://localhost:5000/votar', {
    method: 'POST',
    body: JSON.stringify(voto),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.json())
  .then(data => {
    if (data.ok) {
      
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Gracias por votar!',
        showConfirmButton: false,
        timer: 1500
      })
      
      setTimeout( location.reload(), 1500);

    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Algo ha salido mal! Comunicate con tu administrador'
      })
    }
  })
  .catch(error => console.error(error));
  
}