
async function printCandidatos(puestoId) {
  
    const candidatos = await getCandidatos(puestoId);
  
    if (candidatos.length < 1) {
    } else {
      console.log(candidatos);
  
      const posicionesContainer = document.querySelector("#posicionesContainer");
      posicionesContainer.innerHTML = "";
  
      candidatos.forEach((element) => {
        // Crear div
        const div = document.createElement("div");
        div.className = "col-2 d-flex flex-column align-items-center";
  
        // Crear card
        const card = document.createElement("div");
        card.className = "card";
  
        // Crear imagen
        const img = document.createElement("img");
        img.className = "card-img-top img-candidato-card w-100";
        img.src = element.imgPerfil;
        img.alt = `${element.name} img`;
  
        // Crear card body
        const cardBody = document.createElement("div");
        cardBody.className = "card-body d-flex flex-column align-items-center";
  
        // Crear título
        const title = document.createElement("h5");
        title.className = "card-title mb-4";
        title.textContent = element.name;
  
        // Crear botón
        const button = document.createElement("button");
        button.className = "btn btn-outline-info";
        button.textContent = "Detalles";
        button.addEventListener('click', () => {
          printCandidato(element)
        });
  
        // Agregar elementos al DOM
        cardBody.appendChild(title);
        cardBody.appendChild(button);
        card.appendChild(img);
        card.appendChild(cardBody);
        div.appendChild(card);
  
        posicionesContainer.appendChild(div);
      });
    }
  }
  