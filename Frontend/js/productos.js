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
    msgEl.textContent = `¿Estás seguro de que deseas eliminar "${nombre || 'este producto'}"? Esta acción no se puede deshacer.`;
    pendingDeleteId = id;
    modal.style.display = 'flex';
}

function cerrarModal() {
    document.getElementById('modal-confirm').style.display = 'none';
    pendingDeleteId = null;
}

// Close modal on overlay click
document.getElementById('modal-confirm')?.addEventListener('click', function(e) {
    if (e.target === this) cerrarModal();
});

// Confirm delete
document.getElementById('modal-confirm-btn')?.addEventListener('click', function() {
    if (!pendingDeleteId) return;
    const id = pendingDeleteId;
    cerrarModal();
    eliminarProducto(id);
});

// ─── Search ─────────────────────────────────────
document.getElementById('buscar-producto')?.addEventListener('input', function() {
    const term = this.value.toLowerCase();
    const rows = document.querySelectorAll('#tabla-productos tbody tr');
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(term) ? '' : 'none';
    });
});

// ─── Load Products ──────────────────────────────
fetch('http://localhost:3000/productos')
    .then(response => response.json())
    .then(productos => {
        document.getElementById('loading-productos').style.display = 'none';

        if (!productos.length) {
            document.getElementById('empty-productos').style.display = 'block';
            return;
        }

        document.getElementById('tabla-container').style.display = 'block';
        const tbody = document.querySelector('#tabla-productos tbody');
        
        productos.forEach((producto, i) => {
            const fila = document.createElement('tr');
            fila.style.animation = `fadeInUp 0.4s ease ${i * 0.05}s backwards`;
            fila.innerHTML = `
                <td>${producto.id_producto}</td>
                <td><strong>${producto.nombre}</strong></td>
                <td>$${Number(producto.precio_venta).toFixed(2)}</td>
                <td><span class="badge badge-info">${producto.id_categoria}</span></td>
                <td>
                    <div class="table-actions">
                        <a href="detalle_producto.html?id=${producto.id_producto}" class="btn btn-ghost btn-sm">👁 Ver</a>
                        <a href="editar_producto.html?id=${producto.id_producto}" class="btn btn-ghost btn-sm">✏️ Editar</a>
                        <button class="btn btn-danger btn-sm" onclick="mostrarModalEliminar(${producto.id_producto}, '${producto.nombre.replace(/'/g, "\\'")}')">🗑 Eliminar</button>
                    </div>
                </td>
            `;
            tbody.appendChild(fila);
        });
    })
    .catch(error => {
        document.getElementById('loading-productos').style.display = 'none';
        document.getElementById('empty-productos').style.display = 'block';
        document.querySelector('#empty-productos h3').textContent = 'Error al cargar los productos';
        document.querySelector('#empty-productos p').textContent = 'No se pudo conectar al servidor';
        showToast('Error al cargar los productos', 'error');
        console.error(error);
    });

// ─── Delete Product ─────────────────────────────
function eliminarProducto(id) {
    fetch(`http://localhost:3000/productos/${id}`, { method: 'DELETE' })
        .then(res => res.json())
        .then(respuesta => {
            showToast(respuesta.mensaje || 'Producto eliminado correctamente', 'success');
            setTimeout(() => location.reload(), 800);
        })
        .catch(error => {
            showToast('Error al eliminar el producto', 'error');
            console.error(error);
        });
}