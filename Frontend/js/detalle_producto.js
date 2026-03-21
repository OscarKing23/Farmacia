const params = new URLSearchParams(window.location.search);
const id = params.get('id');

const loadingEl = document.getElementById('loading-detalle');
const detalleEl = document.getElementById('detalle-producto');

if (!id) {
    loadingEl.style.display = 'none';
    detalleEl.style.display = 'block';
    detalleEl.innerHTML = `
        <div class="empty-state" style="background: var(--bg-card); border-radius: var(--radius-lg); border: 1px solid var(--border);">
            <div class="empty-icon">⚠️</div>
            <h3>Producto no especificado</h3>
            <p>No se proporcionó un ID de producto válido</p>
            <a href="productos.html" class="btn btn-primary">← Volver a productos</a>
        </div>
    `;
} else {
    fetch(`http://localhost:3000/productos/${id}`)
        .then(response => response.json())
        .then(producto => {
            loadingEl.style.display = 'none';
            detalleEl.style.display = 'block';

            if (producto.error) {
                detalleEl.innerHTML = `
                    <div class="empty-state" style="background: var(--bg-card); border-radius: var(--radius-lg); border: 1px solid var(--border);">
                        <div class="empty-icon">❌</div>
                        <h3>Producto no encontrado</h3>
                        <a href="productos.html" class="btn btn-primary">← Volver a productos</a>
                    </div>
                `;
                return;
            }

            detalleEl.innerHTML = `
                <div class="detail-card">
                    <div class="detail-header">
                        <h2>📦 ${producto.nombre}</h2>
                    </div>
                    <div class="detail-grid">
                        <div class="detail-item">
                            <div class="detail-label">ID</div>
                            <div class="detail-value">${producto.id_producto}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Nombre</div>
                            <div class="detail-value">${producto.nombre}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Marca</div>
                            <div class="detail-value">${producto.marca || '—'}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Presentación</div>
                            <div class="detail-value">${producto.presentacion || '—'}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Principio Activo</div>
                            <div class="detail-value">${producto.principio_activo || '—'}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Concentración</div>
                            <div class="detail-value">${producto.concentracion || '—'}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Precio Compra</div>
                            <div class="detail-value">$${Number(producto.precio_compra || 0).toFixed(2)}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Precio Venta</div>
                            <div class="detail-value" style="color: var(--success); font-weight: 700;">$${Number(producto.precio_venta || 0).toFixed(2)}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Categoría</div>
                            <div class="detail-value"><span class="badge badge-info">${producto.id_categoria}</span></div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Código de Barras</div>
                            <div class="detail-value">${producto.codigo_barras || '—'}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Lote</div>
                            <div class="detail-value">${producto.lote || '—'}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Laboratorio</div>
                            <div class="detail-value">${producto.laboratorio || '—'}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Requiere Receta</div>
                            <div class="detail-value">${producto.requiere_receta ? '<span class="badge badge-warning">Sí</span>' : '<span class="badge badge-success">No</span>'}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Fecha Vencimiento</div>
                            <div class="detail-value">${producto.fecha_vencimiento ? new Date(producto.fecha_vencimiento).toLocaleDateString('es') : '—'}</div>
                        </div>
                    </div>
                </div>
                <div class="form-actions" style="margin-top: 20px;">
                    <a href="editar_producto.html?id=${producto.id_producto}" class="btn btn-primary">✏️ Editar Producto</a>
                    <a href="productos.html" class="btn btn-secondary">← Volver a productos</a>
                </div>
            `;
        })
        .catch(error => {
            loadingEl.style.display = 'none';
            detalleEl.style.display = 'block';
            detalleEl.innerHTML = `
                <div class="empty-state" style="background: var(--bg-card); border-radius: var(--radius-lg); border: 1px solid var(--border);">
                    <div class="empty-icon">❌</div>
                    <h3>Error al cargar el producto</h3>
                    <p>No se pudo conectar al servidor</p>
                    <a href="productos.html" class="btn btn-primary">← Volver a productos</a>
                </div>
            `;
            console.error(error);
        });
}
