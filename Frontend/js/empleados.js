fetch('http://localhost:3000/empleados')
    .then(response=>response.json())
    .then(empleados=>{
        const tbody=document.querySelector('#tabla-empleados tbody');
        empleados.forEach(empleado=>{
            const fila = document.createElement('tr');
            fila.innerHTML=`
                <td>${empleado.id_empleado}</td>
                <td>${empleado.nombre}</td>
                <td>${empleado.apellido}</td>
                <td>${empleado.cedula}</td>
                <td>${empleado.cargo}</td>
                <td>${empleado.email}</td>
                <td>${empleado.id_sucursal}</td>
                <td>
                    <a href="detalle_empleado.html?id=${empleado.id_empleado}" class="boton">ver detalles</a>
                </td>
                <td><a href="editar_empleado.html?id=${empleado.id_empleado}" class="boton">Editar</a></td>
                <td><button class="boton-eliminar" onclick="eliminarEmpleado(${empleado.id_empleado})">
                Eliminar
                </button>
                </td>
            `;
            tbody.appendChild(fila);
        });
    })
    .catch(error=>{
        alert('error al cargar los empleados');
        console.error(error);
    });

    function eliminarEmpleado(id) {
    if (confirm('¿Estás seguro de que deseas eliminar este empleado?')) {
        fetch(`http://localhost:3000/empleados/${id}`, {
            method: 'DELETE'
        })
        .then(res => res.json())
        .then(respuesta => {
            alert(respuesta.mensaje || 'Empleado eliminado');
            
            location.reload();
        })
        .catch(error => {
            alert('Error al eliminar el empleado');
            console.error(error);
        });
    }

    
window.eliminarEmpleado = function(id) {
    if (confirm('¿Estás seguro de que deseas eliminar este empleado?')) {
        fetch(`http://localhost:3000/empleados/${id}`, {
            method: 'DELETE'
        })
        .then(res => res.json())
        .then(respuesta => {
            alert(respuesta.mensaje || 'Empleado eliminado');
            location.reload();
        })
        .catch(error => {
            alert('Error al eliminar el empleado');
            console.error(error);
        });
    }
};


}