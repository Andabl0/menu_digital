document.addEventListener('DOMContentLoaded', () => {
  const formulario = document.querySelector('#form-pedido');
  const contenedorResumen = document.querySelector('#resumen-pedido');

  if (formulario) {
    formulario.addEventListener('submit', (evento) => {
      evento.preventDefault();

      const inputNombre = document.querySelector('#nombre');
      const inputTelefono = document.querySelector('#telefono');
      const selectTaco = document.querySelector('#taco');
      const inputCantidad = document.querySelector('#cantidad');
      const textareaNotas = document.querySelector('#notas');
      const botonEnviar = formulario.querySelector('button[type="submit"]');

      // 1. Validación 
      if (!inputNombre.value.trim() || !inputTelefono.value.trim() || !selectTaco.value || inputCantidad.value < 1) {
        inputNombre.classList.add('is-invalid');
        Swal.fire({
          icon: 'warning',
          title: 'Campos incompletos',
          text: 'Por favor llena todos los datos requeridos para tu orden.',
          confirmButtonColor: '#C8281E'
        });
        return;
      }

      inputNombre.classList.remove('is-invalid');
      inputNombre.classList.add('is-valid');

      // 2. Guardamos los datos de la orden
      const pedido = {
        cliente: inputNombre.value.trim(),
        telefono: inputTelefono.value.trim(),
        especialidad: selectTaco.value,
        piezas: inputCantidad.value,
        notas: textareaNotas.value.trim() || 'Sin notas especiales',
        fecha: new Date().toLocaleTimeString()
      };

  
      // 3. Animacion de carga (Simulando envio a cocina)
    
      
      // Cambiamos el botón para que muestre una ruedita giratoria de Bootstrap
      botonEnviar.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Enviando a cocina...';
      botonEnviar.disabled = true; // Desactiva el botón para evitar doble clic

      // Mostramos modal de SweetAlert2 con animación de carga
      Swal.fire({
        title: 'Enviando tu pedido a cocina...',
        html: 'Estamos confirmando los ingredientes con el taquero 🌮',
        timer: 3000, // Tarda 2 segundos simulando la conexión
        timerProgressBar: true,
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading(); // Activa el icono giratorio oficial de SweetAlert2
        }
      }).then(() => {
        // Cuando terminan los segundos:
        
        // Guardamos en localStorage
        localStorage.setItem('ultimoPedidoAndablo', JSON.stringify(pedido));

        // Renderizamos el resumen en el DOM
        renderizarConfirmacion(pedido);

        // Restauramos el botón a su estado normal
        botonEnviar.innerHTML = '<i class="fa-solid fa-paper-plane me-2"></i>Confirmar Pedido';
        botonEnviar.disabled = false;

        // Mostramos el mensaje final de éxito
        Swal.fire({
          icon: 'success',
          title: '¡Orden recibida!',
          text: `Gracias ${pedido.cliente}, tu pedido de ${pedido.piezas} orden(es) de ${pedido.especialidad} ya está en preparación.`,
          confirmButtonColor: '#1B7A3D'
        });

        // Limpiamos el formulario
        formulario.reset();
        inputNombre.classList.remove('is-valid');
      });
    });
  }

  // Función para pintar la tarjeta verde en la pantalla
  function renderizarConfirmacion(pedido) {
    if (!contenedorResumen) return;

    contenedorResumen.innerHTML = `
      <div class="alert alert-success mt-4 p-3 border-2" role="alert">
        <h4 class="alert-heading mb-2"> ¡Resumen de tu pedido confirmado!</h4>
        <p class="mb-1"><strong>Cliente:</strong> ${pedido.cliente}</p>
        <p class="mb-1"><strong>Teléfono:</strong> ${pedido.telefono}</p>
        <p class="mb-1"><strong>Orden:</strong> ${pedido.piezas} orden(es) de ${pedido.especialidad}</p>
        <p class="mb-1"><strong>Indicaciones:</strong> ${pedido.notas}</p>
        <hr>
        <p class="mb-0 text-muted"><small>Registrado a las: ${pedido.fecha}</small></p>
      </div>
    `;
  }
});