const params = new URLSearchParams(window.location.search);
const id = params.get('id');

const loadingEl = document.getElementById('loading-detalle');
const detalleEl = document.getElementById('detalle-empleado');

if (!id) {
    loadingEl.style.display = 'none';
    detalleEl.style.display = 'block';
    detalleEl.innerHTML = `
        <div class="empty-state" style="background: var(--bg-card); border-radius: var(--radius-lg); border: 1px solid var(--border);">
            <div class="empty-icon">⚠️</div>
            <h3>Empleado no especificado</h3>
            <p>No se proporcionó un ID de empleado válido</p>
            <a href="empleado.html" class="btn btn-primary">← Volver a empleados</a>
        </div>
    `;
} else {
    fetch(`http://localhost:3000/empleados/${id}`)
        .then(response => response.json())
        .then(empleado => {
            loadingEl.style.display = 'none';
            detalleEl.style.display = 'block';

            if (empleado.error) {
                detalleEl.innerHTML = `
                    <div class="empty-state" style="background: var(--bg-card); border-radius: var(--radius-lg); border: 1px solid var(--border);">
                        <div class="empty-icon">❌</div>
                        <h3>Empleado no encontrado</h3>
                        <a href="empleado.html" class="btn btn-primary">← Volver a empleados</a>
                    </div>
                `;
                return;
            }

            detalleEl.innerHTML = `
                <div class="detail-card">
                    <div class="detail-header">
                        <h2>👤 ${empleado.nombre || ''} ${empleado.apellido || ''}</h2>
                    </div>
                    <div class="detail-grid">
                        <div class="detail-item">
                            <div class="detail-label">ID</div>
                            <div class="detail-value">${empleado.id_empleado}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Nombre</div>
                            <div class="detail-value">${empleado.nombre || '—'}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Apellido</div>
                            <div class="detail-value">${empleado.apellido || '—'}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Cédula</div>
                            <div class="detail-value">${empleado.cedula || '—'}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Email</div>
                            <div class="detail-value">${empleado.email || '—'}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Teléfono</div>
                            <div class="detail-value">${empleado.telefono || '—'}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Dirección</div>
                            <div class="detail-value">${empleado.direccion || '—'}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Cargo</div>
                            <div class="detail-value"><span class="badge badge-info">${empleado.cargo || '—'}</span></div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Salario</div>
                            <div class="detail-value" style="color: var(--success); font-weight: 700;">$${Number(empleado.salario || 0).toFixed(2)}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Sucursal</div>
                            <div class="detail-value"><span class="badge badge-success">${empleado.id_sucursal || '—'}</span></div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Fecha de Ingreso</div>
                            <div class="detail-value">${empleado.fecha_ingreso ? new Date(empleado.fecha_ingreso).toLocaleDateString('es') : '—'}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Estado</div>
                            <div class="detail-value"><span class="badge badge-success">${empleado.estado || 'Activo'}</span></div>
                        </div>
                    </div>
                </div>
                <div class="form-actions" style="margin-top: 20px;">
                    <a href="editar_empleado.html?id=${empleado.id_empleado}" class="btn btn-primary">✏️ Editar Empleado</a>
                    <a href="empleado.html" class="btn btn-secondary">← Volver a empleados</a>
                </div>
            `;
        })
        .catch(error => {
            loadingEl.style.display = 'none';
            detalleEl.style.display = 'block';
            detalleEl.innerHTML = `
                <div class="empty-state" style="background: var(--bg-card); border-radius: var(--radius-lg); border: 1px solid var(--border);">
                    <div class="empty-icon">❌</div>
                    <h3>Error al cargar el empleado</h3>
                    <p>No se pudo conectar al servidor</p>
                    <a href="empleado.html" class="btn btn-primary">← Volver a empleados</a>
                </div>
            `;
            console.error(error);
        });
}
