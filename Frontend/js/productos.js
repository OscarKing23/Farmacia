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
                <td>
                    <a href="detalle_producto.html?id=${producto.id_producto}" class="boton">ver detalles</a>
                </td>
                <td><a href="editar_producto.html?id=${producto.id_producto}" class="boton">Editar</a></td>
                <td><button class="boton-eliminar" onclick="eliminarProducto(${producto.id_producto})">Eliminar</button></td>
            `;
            tbody.appendChild(fila);
        });
    })
    .catch(error=>{
        alert('error al cargar los productos');
        console.error(error);
    });

    function eliminarProducto(id) {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
        fetch(`http://localhost:3000/productos/${id}`, {
            method: 'DELETE'
        })
        .then(res => res.json())
        .then(respuesta => {
            alert(respuesta.mensaje || 'Producto eliminado');
            // Recarga la tabla de productos
            location.reload();
        })
        .catch(error => {
            alert('Error al eliminar el producto');
            console.error(error);
        });
    }
}