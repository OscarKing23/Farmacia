const express=require('express');
const mysql=require('mysql2');
const app=express();
const port=3000;
const db=require('./Config/database');
const cors=require('cors')
const path =require('path')
app.use(express.static(path.join(__dirname,'Frontend')));
app.use(express.json());
app.get('/',(req,res)=> {
    res.json({
        mensaje:'servidor farmacia funcionando correctamente',
        version:'1.0.0'
    });
});
app.listen(port,()=>{
    console.log(`Servidor conectado en http://localhost:${port}`);
});

app.get('/test-db',(req,res)=>{
    db.query('SELECT COUNT(*) as total FROM productos',(error,resultado)=>{
    
        if(error){
        return res.status(500).json({error:'Error en la BD'});
    }
    res.json({
        mensaje:'Conexion a la base de datos existentes',
        total_productos: resultado[0].total
     });
    });
});



//Tabla de productos
app.get('/productos', (req, res) => {
    db.query('SELECT * FROM productos', (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Error al obtener productos' });
        }
        res.json(results);
    });
});

app.post('/productos', (req, res) => {
    const {
        nombre, descripcion, marca, presentacion, principio_activo, concentracion,
        codigo_barras, lote, laboratorio, precio_compra, precio_venta, 
        id_categoria, requiere_receta, fecha_vencimiento
    } = req.body;

    // Validación básica de campos obligatorios
    if (!nombre || precio_compra === undefined || precio_venta === undefined || !id_categoria) {
        return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }

    // Prepara la consulta SQL
    const sql = `
        INSERT INTO productos
        (codigo_barras,nombre, descripcion, marca, presentacion, 
        principio_activo, concentracion, precio_compra, precio_venta, 
        requiere_receta, fecha_vencimiento, lote, laboratorio, id_categoria,estado)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, "activo")
    `;

    // Prepara los valores en el mismo orden que la consulta
    const valores = [
        codigo_barras,nombre, descripcion, marca, presentacion, 
        principio_activo, concentracion, precio_compra, precio_venta, 
        requiere_receta, fecha_vencimiento, lote, laboratorio, id_categoria
    ];

    db.query(sql, valores, (error, result) => {
        if (error) {
            console.error('Error al agregar producto:', error);
            return res.status(500).json({ error: 'Error al agregar producto' });
        }
        res.json({ mensaje: 'Producto agregado correctamente', id: result.insertId });
    });
});


app.post('/empleados', (req, res) => {
    const {
        cedula, nombre, apellido, email, telefono, direccion, cargo, salario, fecha_ingreso,id_sucursal
    } = req.body;

    // Validación básica de campos obligatorios
    if (!cedula === undefined || email=== undefined || !id_sucursal  ) {
        return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }

 
    // Prepara la consulta SQL
    const sql = `
        INSERT INTO empleados
        (cedula, nombre, apellido, email, telefono, direccion, cargo, salario, fecha_ingreso,id_sucursal,estado)
        VALUES (?,?,?,?,?,?,?,?,?,?,"activo")
    `;

    // Prepara los valores en el mismo orden que la consulta
    const valores = [
        cedula, nombre, apellido, email, telefono, direccion, cargo, salario, fecha_ingreso,id_sucursal
    ];

    db.query(sql, valores, (error, result) => {
        if (error) {
            console.error('Error al agregar empleado:', error);
            return res.status(500).json({ error: 'Error al agregar empleado' });
        }
        res.json({ mensaje: 'empleado agregado correctamente', id: result.insertId });
    });
});

//actualizar producto
app.put('/productos/:id',(req, res)=>{
     const id = req.params.id;
     const {
        codigo_barras,nombre, descripcion, marca, presentacion, 
        principio_activo, concentracion, precio_compra, precio_venta, 
        requiere_receta, fecha_vencimiento, lote, laboratorio, id_categoria
    }=req.body;

    if (!nombre || precio_compra === undefined || precio_venta === undefined || !id_categoria) {
        return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }
 const sql=`
        UPDATE Productos SET
            codigo_barras=?,
            nombre=?, 
            descripcion=?,
            marca=?, 
            presentacion=?, 
            principio_activo=?,
            concentracion=?,
            precio_compra=?, 
            precio_venta=?, 
            requiere_receta=?, 
            fecha_vencimiento=?, 
            lote=?, 
            laboratorio=?, 
            id_categoria=?
        WHERE id_producto=?
        `;

const valores = [
        codigo_barras,nombre, descripcion, marca, presentacion, 
        principio_activo, concentracion, precio_compra, precio_venta, 
        requiere_receta, fecha_vencimiento, lote, laboratorio, id_categoria,id
    ];

    db.query(sql, valores, (error, result) => {
        if (error) {
            console.error('Error al actualizar producto:', error);
            return res.status(500).json({ error: 'Error al actualizar producto' });
        }
        if(result.affectedRows===0){ 
            return res.status(404).json({error:'Error al actualizar producto'});
        }
        res.json({ mensaje: 'Producto actualizado correctamente' });
    });
});  


app.get('/productos/:id', (req, res) => {
    const id =req.params.id;
    db.query('SELECT * FROM productos WHERE id_producto=?',[id], (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Error al obtener productos' });
        }
        if(results.length===0){
            return res.status(400).json({error:'producto no encontrado'});
        }
        res.json(results[0]);
    });
});



app.put('/empleados/:id',(req, res)=>{
     const id = req.params.id;
     const {
        cedula, nombre, apellido, email, telefono, direccion, cargo, salario, fecha_ingreso,id_sucursal
    }=req.body;

    if (cedula === undefined || email=== undefined || id_sucursal===undefined ) {
        return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }
 const sql=`
        UPDATE empleados SET
            cedula=?,
            nombre=?, 
            apellido=?, 
            email=?, 
            telefono=?, 
            direccion=?, 
            cargo=?, 
            salario=?, 
            fecha_ingreso=?,
            id_sucursal=?
        WHERE id_empleado=?
        `;

const valores = [
        cedula, nombre, apellido, email, telefono, direccion, cargo, salario, fecha_ingreso,id_sucursal,id
    ];

    db.query(sql, valores, (error, result) => {
        if (error) {
            console.error('Error al actualizar empleados:', error);
            return res.status(500).json({ error: 'Error al actualizar empleados' });
        }
        if(result.affectedRows===0){ 
            return res.status(404).json({error:'Error al actualizar empleados'});
        }
        res.json({ mensaje: 'empleado actualizado correctamente' });
    });
});  




app.get('/empleados/:id', (req, res) => {
    const id =req.params.id;
    db.query('SELECT * FROM empleados WHERE id_empleado=?',[id], (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Error al obtener empleado' });
        }
        if(results.length===0){
            return res.status(400).json({error:'empleado no encontrado'});
        }
        res.json(results[0]);
    });
});

//Tabla de empleados
app.get('/empleados', (req, res) => {
    db.query('SELECT * FROM empleados', (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Error al obtener los empleados' });
        }
        res.json(results);
    });
});

app.delete('/empleados/:id', (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM empleados WHERE id_empleado = ?', [id], (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Error al eliminar el empleado' });
        }
        if(results.affectedRows === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json({ message: 'Empleado eliminado correctamente' });
    });
});

app.delete('/productos/:id', (req, res) => {
    const id = req.params.id;
    db.query('DELETE FROM productos WHERE id_producto = ?', [id], (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Error al eliminar el producto' });
        }
        if(results.affectedRows === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json({ mensaje: 'Producto eliminado correctamente' });
    });
});

