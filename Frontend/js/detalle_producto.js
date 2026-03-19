const params=new URLSearchParams(window.location.search);
const id=params.get('id');

if(!id){
    document.getElementById('detalle-producto').innerHTML='<p>Error: no se especifico el producto</p>';
}else{
    fetch(`http://localhost:3000/productos/${id}`)
        .then(response=>response.json())
        .then(producto=>{
            if(producto.error){
                document.getElementById('detalle-producto').innerHTML='<p>Error</p>';
            }else{
                document.getElementById('detalle-producto').innerHTML=`
                <ul>
                    <li><strong>ID:</strong>${producto.id_producto}</li>
                    <li><strong>Nombre:</strong>${producto.nombre}</li>
                    <li><strong>Precio Venta:</strong>${producto.precio_venta}</li>
                    <li><strong>Marca:</strong>${producto.Marca || '-'}</li>
                    <li><strong>Presentacion:</strong>${producto.presentacion || '-' }</li>
                    <li><strong>Categoria:</strong>${producto.id_categoria}</li>
                    </ul>
                `;
            }
        })
        .catch(error=>{
            document.getElementById('detalle-producto').innerHTML='<p> Error al cargar el producto.</p>'
            console.error(error);
        }); 
}

