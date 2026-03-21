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

// ─── Modal System ───────────────────────────────
let pendingDeleteId = null;

function mostrarModalEliminar(id, nombre) {
    const modal = document.getElementById('modal-confirm');
    const msgEl = document.getElementById('modal-message');
    msgEl.textContent = `¿Estás seguro de que deseas eliminar a "${nombre || 'este empleado'}"? Esta acción no se puede deshacer.`;
    pendingDeleteId = id;
    modal.style.display = 'flex';
}

function cerrarModal() {
    document.getElementById('modal-confirm').style.display = 'none';
    pendingDeleteId = null;
}

// Close modal on overlay click
document.getElementById('modal-confirm')?.addEventListener('click', function (e) {
    if (e.target === this) cerrarModal();
});

// Confirm delete
document.getElementById('modal-confirm-btn')?.addEventListener('click', function () {
    if (!pendingDeleteId) return;
    const id = pendingDeleteId;
    cerrarModal();
    eliminarEmpleado(id);
});

// ─── Search ─────────────────────────────────────
document.getElementById('buscar-empleado')?.addEventListener('input', function () {
    const term = this.value.toLowerCase();
    const rows = document.querySelectorAll('#tabla-empleados tbody tr');
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(term) ? '' : 'none';
    });
});

// ─── Load Employees ─────────────────────────────
fetch('http://localhost:3000/empleados')
    .then(response => response.json())
    .then(empleados => {
        document.getElementById('loading-empleados').style.display = 'none';

        if (!empleados.length) {
            document.getElementById('empty-empleados').style.display = 'block';
            return;
        }

        document.getElementById('tabla-container').style.display = 'block';
        const tbody = document.querySelector('#tabla-empleados tbody');

        empleados.forEach((empleado, i) => {
            const fila = document.createElement('tr');
            fila.style.animation = `fadeInUp 0.4s ease ${i * 0.05}s backwards`;
            fila.innerHTML = `
                <td>${empleado.id_empleado}</td>
                <td><strong>${empleado.nombre || '—'}</strong></td>
                <td>${empleado.apellido || '—'}</td>
                <td>${empleado.cedula || '—'}</td>
                <td><span class="badge badge-info">${empleado.cargo || '—'}</span></td>
                <td>${empleado.email || '—'}</td>
                <td><span class="badge badge-success">${empleado.id_sucursal || '—'}</span></td>
                <td>
                    <div class="table-actions">
                        <a href="detalle_empleado.html?id=${empleado.id_empleado}" class="btn btn-ghost btn-sm">👁 Ver</a>
                        <a href="editar_empleado.html?id=${empleado.id_empleado}" class="btn btn-ghost btn-sm">✏️ Editar</a>
                        <button class="btn btn-danger btn-sm" onclick="mostrarModalEliminar(${empleado.id_empleado}, '${(empleado.nombre || '').replace(/'/g, "\\'")} ${(empleado.apellido || '').replace(/'/g, "\\'")}')"">🗑 Eliminar</button>
                    </div>
                </td>
            `;
            tbody.appendChild(fila);
        });
    })
    .catch(error => {
        document.getElementById('loading-empleados').style.display = 'none';
        document.getElementById('empty-empleados').style.display = 'block';
        document.querySelector('#empty-empleados h3').textContent = 'Error al cargar los empleados';
        document.querySelector('#empty-empleados p').textContent = 'No se pudo conectar al servidor';
        showToast('Error al cargar los empleados', 'error');
        console.error(error);
    });

// ─── Delete Employee ─────────────────────────────
function eliminarEmpleado(id) {
    fetch(`http://localhost:3000/empleados/${id}`, { method: 'DELETE' })
        .then(res => res.json())
        .then(respuesta => {
            showToast(respuesta.mensaje || respuesta.message || 'Empleado eliminado correctamente', 'success');
            setTimeout(() => location.reload(), 800);
        })
        .catch(error => {
            showToast('Error al eliminar el empleado', 'error');
            console.error(error);
        });
}

// Global reference for inline onclick
window.eliminarEmpleado = eliminarEmpleado;
window.mostrarModalEliminar = mostrarModalEliminar;
window.cerrarModal = cerrarModal;