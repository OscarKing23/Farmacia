// js/editar_producto.js
// 1. Obtener el ID del producto desde la URL
function getIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}
const id = getIdFromUrl();
if (!id) {
    document.getElementById('mensaje-form').textContent = 'No se especificó el empleado a editar.';
    document.getElementById('form-editar-empleado').style.display = 'none';
    } else {
        fetch(`http://localhost:3000/empleados/${id}`)
        .then(res => res.json())
        .then(empleado => {
            // Llenar el formulario con los datos
            const form = document.getElementById('form-editar-empleado');
            form.nombre.value = empleado.nombre || '';
            form.apellido.value = empleado.apellido || '';
            form.cedula.value = empleado.cedula || '';
            form.email.value = empleado.email || '';
            form.cargo.value = empleado.cargo || '';
            form.telefono.value = empleado.telefono || '';
            form.direccion.value = empleado.direccion || '';
            form.salario.value = empleado.salario || '';
            form.id_sucursal.value = empleado.id_sucursal || '';
            form.fecha_ingreso.value = empleado.fecha_ingreso ? empleado.fecha_ingreso.split('T')[0] : '';
        })
        .catch(error => {
            document.getElementById('mensaje-form').textContent = 'Error al cargar el empleado.';
            console.error(error);
        });

    // 3. Manejar el envío del formulario
 document.getElementById('form-editar-empleado').addEventListener('submit', function(e) {
    e.preventDefault();
    const form = e.target;
    const data = {
        nombre: form.nombre.value.trim(),
        apellido: form.apellido.value.trim(),
        cedula: form.cedula.value.trim(),
        email: form.email.value.trim(),
        telefono: form.telefono.value.trim(),
        direccion: form.direccion.value.trim(),
        cargo: form.cargo.value.trim(),
        salario: form.salario.value.trim(),
        id_sucursal: form.id_sucursal.value.trim(),
        fecha_ingreso: form.fecha_ingreso.value
        };

       if (!data.nombre) {
        mostrarMensaje('El nombre es obligatorio.');
        return;
    }
    if (!data.apellido) {
        mostrarMensaje('El apellido es obligatorio.');
        return;
    }
    if (!data.cedula) {
        mostrarMensaje('La Cedula es obligatorio.');
        return;
    }
    if (!data.email) {
        mostrarMensaje('El email es obligatorio.');
        return;
    }
    if (!data.id_sucursal || isNaN(data.id_sucursal) || !Number.isInteger(Number(data.id_sucursal)) || Number(data.id_sucursal) < 1) {
        mostrarMensaje('La sucursal debe ser un número entero válido,mayor o igual a 1.');
        return;
    }
    if (!data.salario || isNaN(data.salario)) {
    mostrarMensaje('El salario debe ser un número válido.');
    return;
}

        // Conversión de tipos
        data.salario=parseFloat(data.salario);
       data.cedula = parseFloat(data.cedula);
       data.id_sucursal = parseInt(data.id_sucursal, 10);

        fetch(`http://localhost:3000/empleados/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(respuesta => {
            mostrarMensaje(respuesta.mensaje || 'Empleado actualizado correctamente');
        })
        .catch(error => {
            mostrarMensaje('Error al actualizar el empleado');
            console.error(error);
        });
    });
}

function mostrarMensaje(msg) {
    document.getElementById('mensaje-form').textContent = msg;
}