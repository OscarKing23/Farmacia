const params=new URLSearchParams(window.location.search);
const id=params.get('id');

if(!id){
    document.getElementById('detalle-empleado').innerHTML='<p>Error: no se especifico el empleado</p>';
}else{
    fetch(`http://localhost:3000/empleados/${id}`)
        .then(response=>response.json())
        .then(empleado=>{
            if(empleado.error){
                document.getElementById('detalle-empleado').innerHTML='<p>Error</p>';
            }else{
                document.getElementById('detalle-empleado').innerHTML=`
                <ul>
                    <li><strong>ID:</strong>${empleado.id_empleado}</li>
                    <li><strong>Nombre:</strong>${empleado.nombre}</li>
                    <li><strong>apellido:</strong>${empleado.apellido}</li>
                    <li><strong>cedula:</strong>${empleado.cedula}</li>
                    <li><strong>cargo:</strong>${empleado.cargo}</li>
                    <li><strong>email:</strong>${empleado.email}</li>
                    <li><strong>id_sucursal:</strong>${empleado.id_sucursal}</li>
                    </ul>
                `;
            }
        })
        .catch(error=>{
            document.getElementById('detalle-empleado').innerHTML='<p> Error al cargar el empleado.</p>'
            console.error(error);
        }); 
}

