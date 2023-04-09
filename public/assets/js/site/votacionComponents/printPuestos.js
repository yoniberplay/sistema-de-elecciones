function printPuestos(puestosList) {
    const posicionesContainer = document.querySelector("#posicionesContainer");

    puestosList.forEach((element) => {
      // Crear el elemento div principal
      const divPrincipal = document.createElement("div");
      divPrincipal.classList.add(
        "col-2",
        "d-flex",
        "flex-column",
        "align-items-center"
      );
  
      // Crear el div interno para la imagen
      const divImagen = document.createElement("div");
      divImagen.classList.add("mb-3");
  
      // Crear la imagen y establecer sus atributos
      const img = document.createElement("img");
      img.classList.add("img-card", "w-100");
      img.src = "/assets/img/votacion.jpg";
      img.alt = "";
  
      // Agregar la imagen al div interno
      divImagen.appendChild(img);
  
      // Crear el segundo div interno
      const divTitulo = document.createElement("div");
      divTitulo.classList.add("d-flex", "flex-column", "align-items-center");
  
      // Crear el título y establecer su contenido
      const titulo = document.createElement("h5");
      titulo.classList.add("text-white", "mb-4");
      titulo.textContent = element.name;
  
      // Crear el botón y establecer su contenido
      const boton = document.createElement("button");
      boton.classList.add("btn", "btn-outline-success");
      boton.textContent = "Empezar votación";
      boton.addEventListener("click", () => {
        printCandidatos(element.Id);
      });
      // Agregar el título y el botón al segundo div interno
      divTitulo.appendChild(titulo);
      divTitulo.appendChild(boton);
  
      // Agregar ambos div internos al div principal
      divPrincipal.appendChild(divImagen);
      divPrincipal.appendChild(divTitulo);
  
      posicionesContainer.appendChild(divPrincipal);
    });
  }
  