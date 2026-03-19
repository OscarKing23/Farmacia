// js/agregar_producto.js
document.getElementById('form-producto').addEventListener('submit', function(e) {
    e.preventDefault();
    const form = e.target;
    const data = {
        nombre: form.nombre.value.trim(),
        descripcion: form.descripcion.value.trim(),
        marca: form.marca.value.trim(),
        presentacion: form.presentacion.value.trim(),
        principio_activo: form.principio_activo.value.trim(),
        concentracion: form.concentracion.value.trim(),
        codigo_barras: form.codigo_barras.value.trim(),
        lote: form.lote.value.trim(),
        laboratorio: form.laboratorio.value.trim(),
        precio_compra: form.precio_compra.value.trim(),
        precio_venta: form.precio_venta.value.trim(),
        id_categoria: form.id_categoria.value.trim(),
        requiere_receta: form.requiere_receta.checked ? 1 : 0,
        fecha_vencimiento: form.fecha_vencimiento.value
    };

    // Validaciones obligatorias
    if (!data.nombre) {
        mostrarMensaje('El nombre es obligatorio.');
        return;
    }
    if (!data.precio_compra || isNaN(data.precio_compra) || Number(data.precio_compra) < 0) {
        mostrarMensaje('El precio de compra debe ser un número válido y mayor o igual a 0.');
        return;
    }
    if (!data.precio_venta || isNaN(data.precio_venta) || Number(data.precio_venta) < 0) {
        mostrarMensaje('El precio de venta debe ser un número válido y mayor o igual a 0.');
        return;
    }
    if (!data.id_categoria || isNaN(data.id_categoria) || !Number.isInteger(Number(data.id_categoria)) || Number(data.id_categoria) < 1) {
        mostrarMensaje('La categoría debe ser un número entero válido y mayor o igual a 1.');
        return;
    }


    // Validación opcional: fecha_vencimiento (si se llena, debe ser fecha válida y posterior a hoy)
    if (data.fecha_vencimiento) {
        const hoy = new Date();
        const fecha = new Date(data.fecha_vencimiento);
        if (isNaN(fecha.getTime())) {
            mostrarMensaje('La fecha de vencimiento no es válida.');
            return;
        }
        // Si quieres que la fecha sea posterior a hoy:
        // if (fecha <= hoy) {
        //     mostrarMensaje('La fecha de vencimiento debe ser posterior a hoy.');
        //     return;
        // }
    }

    // Conversión de tipos
    data.precio_compra = parseFloat(data.precio_compra);
    data.precio_venta = parseFloat(data.precio_venta);
    data.id_categoria = parseInt(data.id_categoria, 10);

    fetch('http://localhost:3000/productos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(respuesta => {
        mostrarMensaje(respuesta.mensaje || 'Producto agregado');
        form.reset();
    })
    .catch(error => {
        mostrarMensaje('Error al agregar producto');
        console.error(error);
    });
});

function mostrarMensaje(msg) {
    document.getElementById('mensaje-form').textContent = msg;
}



