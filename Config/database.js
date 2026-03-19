const mysql=require('mysql2');
const connection=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'root',
    database:'farmacia'
});
connection.connect((error)=>{
    if(error){
        console.error('Error conectado a la BD',error);
        return;
    }
    console.log('Conectado a la BD de Mysql');
})
module.exports=connection;