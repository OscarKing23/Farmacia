

function mostrarDetalles(producto){
    const detallesDiv= document.getElementById('detalles-producto');
    detallesDiv.innerHTML=` 
    <h2>Detalles del Producto</h2>
    <p><strong>ID:</strong>${producto.id_producto}</p>
    <p><strong>Nombre:</strong>${producto.nombre}</p>
    <p><strong>Precio Venta:</strong>${producto.precio_venta}</p>
    <p><strong>Marca:</strong>${producto.Marca}</p>
    <p><strong>presentacion:</strong>${producto.presentacion}</p>
    <p><strong>Categoria:</strong>${producto.id_categoria}</p>
    <!--Agregar mas campos si quieres-->
    `;

}

fetch('http://localhost:3000/productos')
.then(response=>response.json())
.then(productos=>{
    const tbody=document.querySelector('#tabla-productos tbody');
    productos.forEach(producto=>{
        const fila = document.createElement('tr');
        fila.innerHTML=`
        <td>${producto.id_producto}</td>
        <td>${producto.nombre}</td>
        <td>${producto.precio_venta}</td>
        <td>${producto.id_categoria}</td>
        `;
         
fila.addEventListener('click',()=>{
    fetch(`http://localhost:3000/productos/${producto.id_producto}`)
    .then(res=> res.json())
    .then(detalle=> mostrarDetalles(detalle))
    .catch(error=> {
        alert('Error al cargar los detalles');
        console.error(error);
        });
    });

tbody.appendChild(fila);
  });
})

.catch(error=>{
    alert('error al cargar los productos');
});



function mostrarDetalles(empleado){
    const detallesDiv= document.getElementById('detalle-empleado');
    detallesDiv.innerHTML=` 
    <h2>Detalles del empleado</h2>
    <p><strong>ID:</strong>${empleado.id_empleado}</p>
    <p><strong>Nombre:</strong>${empleado.nombre}</p>
    <p><strong>Apellido:</strong>${empleado.apellido}</p>
    <p><strong>Cedula:</strong>${empleado.cedula}</p>
    <p><strong>Cargo:</strong>${empleado.cargo}</p>
    <p><strong>Email:</strong>${empleado.email}</p>
    <p><strong>id_sucursal:</strong>${empleado.id_sucursal}</p>
    <!--Agregar mas campos si quieres-->
    `;

}

fetch('http://localhost:3000/empleados')
.then(response=>response.json())
.then(empleados=>{
    const tbody=document.querySelector('#tabla-empleado tbody');
    empleados.forEach(empleado=>{
        const fila = document.createElement('tr');
        fila.innerHTML=`
        <td>${empleados.id_empleado}</td>
        <td>${empleados.nombre}</td>
        <td>${empleados.apellido}</td>
        <td>${empleados.cedula}</td>
        <td>${empleados.cargo}</td>
        <td>${empleados.email}</td>
        <td>${empleados.id_sucursal}</td>
        `;
         
fila.addEventListener('click',()=>{
    fetch(`http://localhost:3000/empleados/${empleado.id_empleado}`)
    .then(res=> res.json())
    .then(detalle=> mostrarDetalles(detalle))
    .catch(error=> {
        alert('Error al cargar los detalles');
        console.error(error);
        });
    });

tbody.appendChild(fila);
  });
})

.catch(error=>{
    alert('error al cargar los empleados');
});