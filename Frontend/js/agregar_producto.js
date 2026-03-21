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
    setTimeout(() => {
        toast.classList.add('toast-exit');
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// ─── Inline Validation ──────────────────────────
function showFieldError(fieldName, message) {
    const input = document.querySelector(`[name="${fieldName}"]`);
    const errorEl = document.getElementById(`error-${fieldName}`);
    if (input) input.classList.add('input-error');
    if (errorEl) {
        errorEl.textContent = message;
        errorEl.classList.add('visible');
    }
}

function clearFieldErrors() {
    document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
    document.querySelectorAll('.field-error').forEach(el => el.classList.remove('visible'));
}

function showFieldSuccess(fieldName) {
    const input = document.querySelector(`[name="${fieldName}"]`);
    if (input) {
        input.classList.remove('input-error');
        input.classList.add('input-success');
    }
}

// ─── Form Message ───────────────────────────────
function mostrarMensaje(msg, type = 'error') {
    const el = document.getElementById('mensaje-form');
    el.textContent = msg;
    el.className = `mensaje visible ${type}`;
    setTimeout(() => {
        el.classList.remove('visible');
    }, 5000);
}

// ─── Form Submit ────────────────────────────────
document.getElementById('form-producto').addEventListener('submit', function (e) {
    e.preventDefault();
    clearFieldErrors();

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

    // Validations
    let hasError = false;

    if (!data.nombre) {
        showFieldError('nombre', 'El nombre es obligatorio');
        hasError = true;
    }
    if (!data.precio_compra || isNaN(data.precio_compra) || Number(data.precio_compra) < 0) {
        showFieldError('precio_compra', 'Debe ser un número mayor o igual a 0');
        hasError = true;
    }
    if (!data.precio_venta || isNaN(data.precio_venta) || Number(data.precio_venta) < 0) {
        showFieldError('precio_venta', 'Debe ser un número mayor o igual a 0');
        hasError = true;
    }
    if (!data.id_categoria || isNaN(data.id_categoria) || !Number.isInteger(Number(data.id_categoria)) || Number(data.id_categoria) < 1) {
        showFieldError('id_categoria', 'Debe ser un número entero mayor o igual a 1');
        hasError = true;
    }

    if (hasError) {
        showToast('Por favor corrige los errores en el formulario', 'warning');
        return;
    }

    if (data.fecha_vencimiento) {
        const fecha = new Date(data.fecha_vencimiento);
        if (isNaN(fecha.getTime())) {
            showFieldError('fecha_vencimiento', 'Fecha no válida');
            return;
        }
    }

    // Convert types
    data.precio_compra = parseFloat(data.precio_compra);
    data.precio_venta = parseFloat(data.precio_venta);
    data.id_categoria = parseInt(data.id_categoria, 10);

    // Disable button while submitting
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = '⏳ Agregando...';

    fetch('http://localhost:3000/productos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
        .then(res => res.json())
        .then(respuesta => {
            showToast(respuesta.mensaje || 'Producto agregado correctamente', 'success');
            mostrarMensaje(respuesta.mensaje || 'Producto agregado correctamente', 'success');
            form.reset();
        })
        .catch(error => {
            showToast('Error al agregar producto', 'error');
            mostrarMensaje('Error al agregar producto', 'error');
            console.error(error);
        })
        .finally(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = '💾 Agregar Producto';
        });
});
