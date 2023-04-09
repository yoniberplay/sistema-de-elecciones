
function printCandidato(candidato) {
    const posicionesContainer = document.querySelector("#posicionesContainer");
    posicionesContainer.innerHTML = "";
  
    const section = document.createElement("section");
    section.className = "py-2";
  
    const container = document.createElement("div");
    container.className = "container px-4 px-lg-5 my-5";
  
    const row = document.createElement("div");
    row.className = "row gx-4 gx-lg-5 align-items-center";
  
    const colImg = document.createElement("div");
    colImg.className = "col-md-6";
  
    const img = document.createElement("img");
    img.className = "card-img-top mb-5 mb-md-0";
    img.src = candidato.imgPerfil;
    img.alt = `${candidato.name} img`;
  
    colImg.appendChild(img);
  
    const colDetails = document.createElement("div");
    colDetails.className = "col-md-6";
  
    const h1 = document.createElement("h1");
    h1.className = "display-5 fw-bolder text-white";
    h1.textContent = `Nombre: ${candidato.name}`;
  
    const div = document.createElement("div");
    div.className = "fs-5 mb-5";
  
    const span1 = document.createElement("span");
    span1.className = "text-white";
    span1.textContent = "Partido: ";
  
    const span2 = document.createElement("span");
    span2.className = "text-white";
    span2.textContent = candidato['Partido.name'];
  
    div.appendChild(span1);
    div.appendChild(span2);
  
    const imgPartido = document.createElement("img");
    imgPartido.className = "img-partido-detalle";
    imgPartido.src = candidato['Partido.imgLogo'];
    imgPartido.alt = `${candidato['Partido.name']} img`;
  
    const p = document.createElement("p");
    p.className = "lead text-white";
    p.textContent = `Descripcion partido: ${candidato['Partido.description']}`;
  
    const divBtn = document.createElement("div");
    divBtn.className = "d-flex";
  
    const button = document.createElement("button");
    button.className = "btn btn-outline-light flex-shrink-0";
    button.type = "button";
    button.textContent = "Votar";
    button.addEventListener('click' ,() => {
      postAddVotacion(candidato)
    })
  
    divBtn.appendChild(button);
  
    colDetails.appendChild(h1);
    colDetails.appendChild(div);
    colDetails.appendChild(imgPartido);
    colDetails.appendChild(p);
    colDetails.appendChild(divBtn);
  
    row.appendChild(colImg);
    row.appendChild(colDetails);
  
    container.appendChild(row);
  
    section.appendChild(container);
  
    posicionesContainer.appendChild(section);

    console.log(candidato);
  }