// js/agregar_empleado.js
document.getElementById('form-empleado').addEventListener('submit', function(e) {
    e.preventDefault();
    const form = e.target;
    const data = {
        cedula: form.cedula.value.trim(),
        nombre: form.nombre.value.trim(),
        apellido: form.apellido.value.trim(),
        email: form.email.value.trim(),
        telefono: form.telefono.value.trim(),
        direccion: form.direccion.value.trim(),
        cargo: form.cargo.value.trim(), 
        salario: form.salario.value.trim(),
        fecha_ingreso: form.fecha_ingreso.value,
        id_sucursal: form.id_sucursal.value.trim(),
       
    };

    // Validaciones obligatorias
    if (!data.cedula || data.cedula.length > 20) {
        mostrarMensaje('La cédula es obligatoria y no debe exceder los 20 caracteres.');
        return;
    }
    if (!data.nombre || !data.apellido) {
        mostrarMensaje('El nombre y apellido son obligatorios.');
        return;
    }
    if (!data.email || !data.email.includes('@')) {
        mostrarMensaje('Email no válido.');
        return;
    }
    if (!data.salario || isNaN(data.salario) || Number(data.salario) < 0) {
        mostrarMensaje('El salario debe ser un número válido mayor o igual a 0.');
        return;
    }
    if (!data.id_sucursal || isNaN(data.id_sucursal) || !Number.isInteger(Number(data.id_sucursal)) || Number(data.id_sucursal) < 1) {
        mostrarMensaje('El ID de sucursal debe ser un número entero válido y mayor o igual a 1.');
        return;
    }

    // Validación opcional: fecha_ingreso
    if (data.fecha_ingreso) {
        const fecha = new Date(data.fecha_ingreso);
        if (isNaN(fecha.getTime())) {
            mostrarMensaje('La fecha de ingreso no es válida.');
            return;
        }
    }

    // Conversión de tipos
    data.salario = parseFloat(data.salario);
    data.id_sucursal = parseInt(data.id_sucursal, 10);

    fetch('http://localhost:3000/empleados', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(respuesta => {
        mostrarMensaje(respuesta.mensaje || 'Empleado agregado');
        form.reset();
    })
    .catch(error => {
        mostrarMensaje('Error al agregar empleado');
        console.error(error);
    });
});

function mostrarMensaje(msg) {
    document.getElementById('mensaje-form').textContent = msg;
}