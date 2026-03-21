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

// ─── Form Message ───────────────────────────────
function mostrarMensaje(msg, type = 'error') {
    const el = document.getElementById('mensaje-form');
    el.textContent = msg;
    el.className = `mensaje visible ${type}`;
    setTimeout(() => el.classList.remove('visible'), 5000);
}

// ─── Form Submit ────────────────────────────────
document.getElementById('form-empleado').addEventListener('submit', function (e) {
    e.preventDefault();
    clearFieldErrors();

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
        id_sucursal: form.id_sucursal.value.trim()
    };

    // Validations
    let hasError = false;

    if (!data.cedula) {
        showFieldError('cedula', 'La cédula es obligatoria');
        hasError = true;
    }
    if (!data.email) {
        showFieldError('email', 'El email es obligatorio');
        hasError = true;
    }

    if (hasError) {
        showToast('Por favor corrige los errores en el formulario', 'warning');
        return;
    }

    // Disable button
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = '⏳ Agregando...';

    fetch('http://localhost:3000/empleados', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
        .then(res => res.json())
        .then(respuesta => {
            if (respuesta.error) {
                showToast(respuesta.error, 'error');
                mostrarMensaje(respuesta.error, 'error');
            } else {
                showToast(respuesta.mensaje || 'Empleado agregado correctamente', 'success');
                mostrarMensaje(respuesta.mensaje || 'Empleado agregado correctamente', 'success');
                form.reset();
            }
        })
        .catch(error => {
            showToast('Error al agregar empleado', 'error');
            mostrarMensaje('Error al agregar empleado', 'error');
            console.error(error);
        })
        .finally(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = '💾 Agregar Empleado';
        });
});