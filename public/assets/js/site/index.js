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

  
      $('#IdDoc').on('input', function() {
        var cedula = $(this).val();
        cedula = cedula.replace(/[^0-9-]/g, ''); // Elimina todos los caracteres que no sean números o '-'
        
        $(this).val(cedula);
      });



});
