// js/editar_producto.js
// 1. Obtener el ID del producto desde la URL
function getIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}
const id = getIdFromUrl();
if (!id) {
    document.getElementById('mensaje-form').textContent = 'No se especificó el producto a editar.';
    document.getElementById('form-editar-producto').style.display = 'none';
    } else {
        fetch(`http://localhost:3000/productos/${id}`)
        .then(res => res.json())
        .then(producto => {
            // Llenar el formulario con los datos
            const form = document.getElementById('form-editar-producto');
            form.nombre.value = producto.nombre || '';
            form.descripcion.value = producto.descripcion || '';
            form.marca.value = producto.marca || '';
            form.presentacion.value = producto.presentacion || '';
            form.principio_activo.value = producto.principio_activo || '';
            form.concentracion.value = producto.concentracion || '';
            form.codigo_barras.value = producto.codigo_barras || '';
            form.lote.value = producto.lote || '';
            form.laboratorio.value = producto.laboratorio || '';
            form.precio_compra.value = producto.precio_compra || '';
            form.precio_venta.value = producto.precio_venta || '';
            form.id_categoria.value = producto.id_categoria || '';
            form.requiere_receta.checked = producto.requiere_receta === 1 || producto.requiere_receta === true;
            form.fecha_vencimiento.value = producto.fecha_vencimiento ? producto.fecha_vencimiento.split('T')[0] : '';
        })
        .catch(error => {
            document.getElementById('mensaje-form').textContent = 'Error al cargar el producto.';
            console.error(error);
        });

    // 3. Manejar el envío del formulario
 document.getElementById('form-editar-producto').addEventListener('submit', function(e) {
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

        // Validaciones básicas (puedes agregar más)
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
        if (!data.id_categoria || isNaN(data.id_categoria) || Number(data.id_categoria) < 1) {
            mostrarMensaje('La categoría debe ser un número válido.');
            return;
        }

        // Conversión de tipos
        data.precio_compra = parseFloat(data.precio_compra);
        data.precio_venta = parseFloat(data.precio_venta);
        data.id_categoria = parseInt(data.id_categoria, 10);

        fetch(`http://localhost:3000/productos/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(respuesta => {
            mostrarMensaje(respuesta.mensaje || 'Producto actualizado correctamente');
        })
        .catch(error => {
            mostrarMensaje('Error al actualizar el producto');
            console.error(error);
        });
    });
}

function mostrarMensaje(msg) {
    document.getElementById('mensaje-form').textContent = msg;
}