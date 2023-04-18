$(document).ready(function(){

      
    $(".btn-create-validations").on("click",function(){
        
      (function () {
          'use strict'
         
          var forms = document.querySelectorAll('.needs-validation')
      
          Array.prototype.slice.call(forms)
          .forEach(function (form) {
              form.addEventListener('submit', function (event) {
              if (!form.checkValidity()) {
                  event.preventDefault()
                  event.stopPropagation()
              }
      
              form.classList.add('was-validated')
              }, false)
          })
      })()
    });

    const miInput = document.getElementById("IdDoc");

        miInput.addEventListener("input", (e) => {
        let input = e.target.value;

        // Elimina todos los caracteres que no sean números
        const numeros = input.replace(/\D/g, "");

        // Agrega los guiones en las posiciones correctas
        let valorFinal = "";
        for (let i = 0; i < numeros.length; i++) {
            if (i === 3 || i === 10) {
            valorFinal += "-";
            }

            valorFinal += numeros[i];
        }

        // Actualiza el valor del input
        miInput.value = valorFinal;

    });

    
    $('#IdDoc').on('input', function() {
        let cedula = $(this).val();
        
        // Limita la longitud de la cadena a 13 caracteres (incluyendo los guiones)
        if (cedula.length > 13) {
          cedula = cedula.slice(0, 13);
        }
      
        $(this).val(cedula);
      });


});
