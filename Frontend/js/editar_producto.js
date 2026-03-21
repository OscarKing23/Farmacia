// ─── Toast System ───────────────────────────────
function showToast(message, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        container.id = 'toast-container';
        document.body.appendChild(container);
    }
    const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <span class="toast-icon">${icons[type] || icons.info}</span>
        <span class="toast-message">${message}</span>
        <button class="toast-close" onclick="this.parentElement.classList.add('toast-exit'); setTimeout(()=>this.parentElement.remove(),300)">✕</button>
    `;
    container.appendChild(toast);
    setTimeout(() => { toast.classList.add('toast-exit'); setTimeout(() => toast.remove(), 300); }, 4000);
}

function mostrarMensaje(msg, type = 'error') {
    const el = document.getElementById('mensaje-form');
    el.textContent = msg;
    el.className = `mensaje visible ${type}`;
    setTimeout(() => el.classList.remove('visible'), 5000);
}

// ─── Load product data into form ────────────────
const params = new URLSearchParams(window.location.search);
const id = params.get('id');

if (!id) {
    showToast('No se especificó el producto a editar', 'error');
} else {
    fetch(`http://localhost:3000/productos/${id}`)
        .then(res => res.json())
        .then(producto => {
            if (producto.error) {
                showToast('Producto no encontrado', 'error');
                return;
            }
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
            form.requiere_receta.checked = producto.requiere_receta == 1;
            if (producto.fecha_vencimiento) {
                form.fecha_vencimiento.value = producto.fecha_vencimiento.split('T')[0];
            }
        })
        .catch(error => {
            showToast('Error al cargar el producto', 'error');
            console.error(error);
        });
}

// ─── Form Submit ────────────────────────────────
document.getElementById('form-editar-producto').addEventListener('submit', function (e) {
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

    if (!data.nombre || !data.precio_compra || !data.precio_venta || !data.id_categoria) {
        showToast('Por favor completa los campos obligatorios', 'warning');
        return;
    }

    data.precio_compra = parseFloat(data.precio_compra);
    data.precio_venta = parseFloat(data.precio_venta);
    data.id_categoria = parseInt(data.id_categoria, 10);

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = '⏳ Guardando...';

    fetch(`http://localhost:3000/productos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
        .then(res => res.json())
        .then(respuesta => {
            if (respuesta.error) {
                showToast(respuesta.error, 'error');
                mostrarMensaje(respuesta.error, 'error');
            } else {
                showToast(respuesta.mensaje || 'Producto actualizado correctamente', 'success');
                mostrarMensaje(respuesta.mensaje || 'Producto actualizado correctamente', 'success');
            }
        })
        .catch(error => {
            showToast('Error al actualizar producto', 'error');
            console.error(error);
        })
        .finally(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = '💾 Guardar Cambios';
        });
});