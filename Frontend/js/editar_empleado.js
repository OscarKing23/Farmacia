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

// ─── Load employee data ─────────────────────────
const params = new URLSearchParams(window.location.search);
const id = params.get('id');

if (!id) {
    showToast('No se especificó el empleado a editar', 'error');
} else {
    fetch(`http://localhost:3000/empleados/${id}`)
        .then(res => res.json())
        .then(empleado => {
            if (empleado.error) {
                showToast('Empleado no encontrado', 'error');
                return;
            }
            const form = document.getElementById('form-editar-empleado');
            form.nombre.value = empleado.nombre || '';
            form.apellido.value = empleado.apellido || '';
            form.email.value = empleado.email || '';
            form.telefono.value = empleado.telefono || '';
            form.direccion.value = empleado.direccion || '';
            form.cargo.value = empleado.cargo || '';
            form.salario.value = empleado.salario || '';
            form.cedula.value = empleado.cedula || '';
            form.id_sucursal.value = empleado.id_sucursal || '';
            if (empleado.fecha_ingreso) {
                form.fecha_ingreso.value = empleado.fecha_ingreso.split('T')[0];
            }
        })
        .catch(error => {
            showToast('Error al cargar el empleado', 'error');
            console.error(error);
        });
}

// ─── Form Submit ────────────────────────────────
document.getElementById('form-editar-empleado').addEventListener('submit', function (e) {
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
        id_sucursal: form.id_sucursal.value.trim()
    };

    if (!data.cedula || !data.email) {
        showToast('Cédula y email son obligatorios', 'warning');
        return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = '⏳ Guardando...';

    fetch(`http://localhost:3000/empleados/${id}`, {
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
                showToast(respuesta.mensaje || 'Empleado actualizado correctamente', 'success');
                mostrarMensaje(respuesta.mensaje || 'Empleado actualizado correctamente', 'success');
            }
        })
        .catch(error => {
            showToast('Error al actualizar empleado', 'error');
            console.error(error);
        })
        .finally(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = '💾 Guardar Cambios';
        });
});