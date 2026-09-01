const express = require("express");
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize('biblioteca', 'root', '', {
    host: 'localhost',
    port: 3306,
    dialect: 'mysql'
});

async function conectarConBD(){
    try {
        await sequelize.authenticate();
        console.log('CONEXION EXITOSA CON BD.');
    } catch (error) {
        console.error('ERROR DE CONEXION CON BD:', error);
    }
}
conectarConBD()

const app = express();

app.get("/", function(req, res){
    return res.json({mensaje: "Hola desde Node.js"});
})

app.get("/libro", async function(req, res){
    
    const [ results ] = await sequelize.query("SELECT * from libros");

    return res.json(results);

});

app.get("/categoria", async function(req, res){
    
    const [ results ] = await sequelize.query("SELECT * from categorias");

    return res.json(results);

});


app.listen(5000, function(){
    console.log("Servidor iniciado en http://localhost:5000");
});