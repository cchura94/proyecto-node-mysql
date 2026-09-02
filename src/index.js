// importar paquetes (express, sequelize)
const express = require("express");
const { Sequelize } = require("sequelize");
var cors = require('cors')
// cors


// conexion con BD
const sequelize = new Sequelize('biblioteca', 'root', '', {
    host: 'localhost',
    port: 3306,
    dialect: 'mysql'
});

// Verificación de conexion con BD
async function conectarConBD(){
    try {
        await sequelize.authenticate();
        console.log('CONEXION EXITOSA CON BD.');
    } catch (error) {
        console.error('ERROR DE CONEXION CON BD:', error);
    }
}
conectarConBD()


// inicialización de app con express
const app = express();

app.use(cors())

// recibir datos en formato JSON
app.use(express.json()); // req.body

// creación de Rutas (URLS) End Points (API REST)
app.get("/", function(req, res){
    return res.json({mensaje: "Hola desde Node.js"});
})
// Lista de Libros
app.get("/libro", async function(req, res){
    const [ results ] = await sequelize.query("SELECT * from libros");
    return res.json(results);
});
// guardar libro
app.post('/libro', async function(req, res){
    await sequelize.query(`INSERT INTO libros (titulo, anio_publicacion, editorial, categoria_id, numero_pagina) VALUES ('${req.body.titulo}', ${req.body.anio_publicacion}, '${req.body.editorial}', ${req.body.categoria_id}, ${req.body.numero_pagina})`)
    return res.json({mensaje: "Libro registrado"});
});
// mostrar un libro por id
app.get('/libro/:id', async function(req, res){
    const [ results ] = await sequelize.query(`select * from libros where id = ${req.params.id}`);
    return res.json(results);
});
// modificar un libro por id
app.put('/libro/:id', async function(req, res){
    await sequelize.query(`update libros set titulo = '${req.body.titulo}', editorial = '${req.body.editorial}', anio_publicacion = ${req.body.anio_publicacion}, categoria_id=${req.body.categoria_id}, numero_pagina=${req.body.numero_pagina} where id = ${req.params.id}`);
    return res.json({mensaje: "Libro modificado"});
});
// eliminar libro por id
app.delete('/libro/:id', async function(req, res){
    await sequelize.query(`delete from libros where id = ${req.params.id}`);
    return res.json({mensaje: "Libro Eliminado"});
});



// Lista de Categorías
app.get("/categoria", async function(req, res){
    const [ results ] = await sequelize.query("SELECT * FROM categorias");
    return res.json(results);
});

// Guardar categoría
app.post("/categoria", async function(req, res){
    await sequelize.query(`
        INSERT INTO categorias (nombre, descripcion)
        VALUES ('${req.body.nombre}', '${req.body.descripcion}')
    `);

    return res.json({mensaje: "Categoría registrada"});
});

// Mostrar una categoría por id
app.get("/categoria/:id", async function(req, res){
    const [ results ] = await sequelize.query(`
        SELECT * FROM categorias
        WHERE id = ${req.params.id}
    `);

    return res.json(results);
});

// Modificar una categoría por id
app.put("/categoria/:id", async function(req, res){
    await sequelize.query(`
        UPDATE categorias
        SET nombre = '${req.body.nombre}',
            descripcion = '${req.body.descripcion}'
        WHERE id = ${req.params.id}
    `);

    return res.json({mensaje: "Categoría modificada"});
});

// Eliminar categoría por id
app.delete("/categoria/:id", async function(req, res){
    await sequelize.query(`
        DELETE FROM categorias
        WHERE id = ${req.params.id}
    `);

    return res.json({mensaje: "Categoría eliminada"});
});


// Lista de Autores
app.get("/autor", async function(req, res){
    const [ results ] = await sequelize.query("SELECT * FROM autores");
    return res.json(results);
});

// Guardar autor
app.post("/autor", async function(req, res){
    await sequelize.query(`
        INSERT INTO autores 
        (nombres, apellidos, nacionalidad, fecha_nac)
        VALUES (
            '${req.body.nombres}',
            '${req.body.apellidos}',
            '${req.body.nacionalidad}',
            '${req.body.fecha_nac}'
        )
    `);

    return res.json({mensaje: "Autor registrado"});
});

// Mostrar un autor por id
app.get("/autor/:id", async function(req, res){
    const [ results ] = await sequelize.query(`
        SELECT * FROM autores
        WHERE id = ${req.params.id}
    `);

    return res.json(results);
});

// Modificar un autor por id
app.put("/autor/:id", async function(req, res){
    await sequelize.query(`
        UPDATE autores
        SET nombres = '${req.body.nombres}',
            apellidos = '${req.body.apellidos}',
            nacionalidad = '${req.body.nacionalidad}',
            fecha_nac = '${req.body.fecha_nac}'
        WHERE id = ${req.params.id}
    `);

    return res.json({mensaje: "Autor modificado"});
});

// Eliminar autor por id
app.delete("/autor/:id", async function(req, res){
    await sequelize.query(`
        DELETE FROM autores
        WHERE id = ${req.params.id}
    `);

    return res.json({mensaje: "Autor eliminado"});
});


// Lista de relaciones autor-libro
app.get("/autor-libro", async function(req, res){
    const [ results ] = await sequelize.query(`
        SELECT * FROM autor_libro
    `);

    return res.json(results);
});

// Mostrar autores de un libro
app.get("/libro/:id/autores", async function(req, res){
    const [ results ] = await sequelize.query(`
        SELECT 
            autores.id,
            autores.nombres,
            autores.apellidos,
            autores.nacionalidad,
            autores.fecha_nac
        FROM autores
        INNER JOIN autor_libro
            ON autores.id = autor_libro.autor_id
        WHERE autor_libro.libro_id = ${req.params.id}
    `);

    return res.json(results);
});

// Mostrar libros de un autor
app.get("/autor/:id/libros", async function(req, res){
    const [ results ] = await sequelize.query(`
        SELECT 
            libros.id,
            libros.titulo,
            libros.anio_publicacion,
            libros.editorial,
            libros.categoria_id,
            libros.numero_pagina
        FROM libros
        INNER JOIN autor_libro
            ON libros.id = autor_libro.libro_id
        WHERE autor_libro.autor_id = ${req.params.id}
    `);

    return res.json(results);
});

// Asignar autor a libro
app.post("/autor-libro", async function(req, res){
    await sequelize.query(`
        INSERT INTO autor_libro (libro_id, autor_id)
        VALUES (${req.body.libro_id}, ${req.body.autor_id})
    `);

    return res.json({mensaje: "Autor asignado al libro"});
});

// Eliminar autor de un libro
app.delete("/autor-libro/:libro_id/:autor_id", async function(req, res){
    await sequelize.query(`
        DELETE FROM autor_libro
        WHERE libro_id = ${req.params.libro_id}
        AND autor_id = ${req.params.autor_id}
    `);

    return res.json({mensaje: "Autor eliminado del libro"});
});


// Lista de ejemplares
app.get("/ejemplar", async function(req, res){
    const [ results ] = await sequelize.query("SELECT * FROM ejemplares");
    return res.json(results);
});

// Guardar ejemplar
app.post("/ejemplar", async function(req, res){
    await sequelize.query(`
        INSERT INTO ejemplares 
        (isbn, ubicacion, estado_fisico_libro, libro_id, disponible)
        VALUES (
            '${req.body.isbn}',
            '${req.body.ubicacion}',
            '${req.body.estado_fisico_libro}',
            ${req.body.libro_id},
            ${req.body.disponible}
        )
    `);

    return res.json({mensaje: "Ejemplar registrado"});
});

// Mostrar ejemplar por id
app.get("/ejemplar/:id", async function(req, res){
    const [ results ] = await sequelize.query(`
        SELECT * FROM ejemplares
        WHERE id = ${req.params.id}
    `);

    return res.json(results);
});

// Modificar ejemplar
app.put("/ejemplar/:id", async function(req, res){
    await sequelize.query(`
        UPDATE ejemplares
        SET isbn = '${req.body.isbn}',
            ubicacion = '${req.body.ubicacion}',
            estado_fisico_libro = '${req.body.estado_fisico_libro}',
            libro_id = ${req.body.libro_id},
            disponible = ${req.body.disponible}
        WHERE id = ${req.params.id}
    `);

    return res.json({mensaje: "Ejemplar modificado"});
});

// Eliminar ejemplar
app.delete("/ejemplar/:id", async function(req, res){
    await sequelize.query(`
        DELETE FROM ejemplares
        WHERE id = ${req.params.id}
    `);

    return res.json({mensaje: "Ejemplar eliminado"});
});


// Lista de usuarios
app.get("/usuario", async function(req, res){
    const [ results ] = await sequelize.query("SELECT * FROM usuarios");
    return res.json(results);
});

// Guardar usuario
app.post("/usuario", async function(req, res){
    await sequelize.query(`
        INSERT INTO usuarios
        (nombres, apellidos, nro_documento, telefono, correo, genero, estado)
        VALUES (
            '${req.body.nombres}',
            '${req.body.apellidos}',
            '${req.body.nro_documento}',
            '${req.body.telefono}',
            '${req.body.correo}',
            '${req.body.genero}',
            ${req.body.estado}
        )
    `);

    return res.json({mensaje: "Usuario registrado"});
});

// Mostrar usuario por id
app.get("/usuario/:id", async function(req, res){
    const [ results ] = await sequelize.query(`
        SELECT * FROM usuarios
        WHERE id = ${req.params.id}
    `);

    return res.json(results);
});

// Modificar usuario
app.put("/usuario/:id", async function(req, res){
    await sequelize.query(`
        UPDATE usuarios
        SET nombres = '${req.body.nombres}',
            apellidos = '${req.body.apellidos}',
            nro_documento = '${req.body.nro_documento}',
            telefono = '${req.body.telefono}',
            correo = '${req.body.correo}',
            genero = '${req.body.genero}',
            estado = ${req.body.estado}
        WHERE id = ${req.params.id}
    `);

    return res.json({mensaje: "Usuario modificado"});
});

// Eliminar usuario
app.delete("/usuario/:id", async function(req, res){
    await sequelize.query(`
        DELETE FROM usuarios
        WHERE id = ${req.params.id}
    `);

    return res.json({mensaje: "Usuario eliminado"});
});


// Lista de carnets
app.get("/carnet", async function(req, res){
    const [ results ] = await sequelize.query("SELECT * FROM carnets");
    return res.json(results);
});

// Guardar carnet
app.post("/carnet", async function(req, res){
    await sequelize.query(`
        INSERT INTO carnets
        (nro_kardex, fecha_emision, fecha_caducidad, estado, usuario_id)
        VALUES (
            '${req.body.nro_kardex}',
            '${req.body.fecha_emision}',
            '${req.body.fecha_caducidad}',
            '${req.body.estado}',
            ${req.body.usuario_id}
        )
    `);

    return res.json({mensaje: "Carnet registrado"});
});

// Mostrar carnet por id
app.get("/carnet/:id", async function(req, res){
    const [ results ] = await sequelize.query(`
        SELECT * FROM carnets
        WHERE id = ${req.params.id}
    `);

    return res.json(results);
});

// Modificar carnet
app.put("/carnet/:id", async function(req, res){
    await sequelize.query(`
        UPDATE carnets
        SET nro_kardex = '${req.body.nro_kardex}',
            fecha_emision = '${req.body.fecha_emision}',
            fecha_caducidad = '${req.body.fecha_caducidad}',
            estado = '${req.body.estado}',
            usuario_id = ${req.body.usuario_id}
        WHERE id = ${req.params.id}
    `);

    return res.json({mensaje: "Carnet modificado"});
});

// Eliminar carnet
app.delete("/carnet/:id", async function(req, res){
    await sequelize.query(`
        DELETE FROM carnets
        WHERE id = ${req.params.id}
    `);

    return res.json({mensaje: "Carnet eliminado"});
});


// Lista de préstamos
app.get("/prestamo", async function(req, res){
    const [ results ] = await sequelize.query("SELECT * FROM prestamo");
    return res.json(results);
});

// Guardar préstamo
app.post("/prestamo", async function(req, res){
    await sequelize.query(`
        INSERT INTO prestamo
        (
            ejemplar_id,
            usuario_id,
            fecha_prestamo,
            fecha_devolucion,
            fecha_devolucion_real,
            estado_prestamo
        )
        VALUES (
            ${req.body.ejemplar_id},
            ${req.body.usuario_id},
            '${req.body.fecha_prestamo}',
            '${req.body.fecha_devolucion}',
            ${req.body.fecha_devolucion_real ? `'${req.body.fecha_devolucion_real}'` : "NULL"},
            ${req.body.estado_prestamo}
        )
    `);

    return res.json({mensaje: "Préstamo registrado"});
});

// Mostrar préstamo por id
app.get("/prestamo/:id", async function(req, res){
    const [ results ] = await sequelize.query(`
        SELECT * FROM prestamo
        WHERE id = ${req.params.id}
    `);

    return res.json(results);
});

// Modificar préstamo
app.put("/prestamo/:id", async function(req, res){
    await sequelize.query(`
        UPDATE prestamo
        SET ejemplar_id = ${req.body.ejemplar_id},
            usuario_id = ${req.body.usuario_id},
            fecha_prestamo = '${req.body.fecha_prestamo}',
            fecha_devolucion = '${req.body.fecha_devolucion}',
            fecha_devolucion_real = ${req.body.fecha_devolucion_real ? `'${req.body.fecha_devolucion_real}'` : "NULL"},
            estado_prestamo = ${req.body.estado_prestamo}
        WHERE id = ${req.params.id}
    `);

    return res.json({mensaje: "Préstamo modificado"});
});

// Eliminar préstamo
app.delete("/prestamo/:id", async function(req, res){
    await sequelize.query(`
        DELETE FROM prestamo
        WHERE id = ${req.params.id}
    `);

    return res.json({mensaje: "Préstamo eliminado"});
});


app.get("/prestamos/activos", async function(req, res){
    const [ results ] = await sequelize.query(`
        SELECT
            prestamo.id,
            prestamo.fecha_prestamo,
            prestamo.fecha_devolucion,
            usuarios.nombres,
            usuarios.apellidos,
            ejemplares.isbn,
            libros.titulo
        FROM prestamo
        INNER JOIN usuarios
            ON prestamo.usuario_id = usuarios.id
        INNER JOIN ejemplares
            ON prestamo.ejemplar_id = ejemplares.id
        INNER JOIN libros
            ON ejemplares.libro_id = libros.id
        WHERE prestamo.estado_prestamo = TRUE
    `);

    return res.json(results);
});


app.get("/usuario/:id/prestamos", async function(req, res){
    const [ results ] = await sequelize.query(`
        SELECT
            prestamo.id,
            prestamo.fecha_prestamo,
            prestamo.fecha_devolucion,
            prestamo.fecha_devolucion_real,
            prestamo.estado_prestamo,
            libros.titulo,
            ejemplares.isbn
        FROM prestamo
        INNER JOIN ejemplares
            ON prestamo.ejemplar_id = ejemplares.id
        INNER JOIN libros
            ON ejemplares.libro_id = libros.id
        WHERE prestamo.usuario_id = ${req.params.id}
        ORDER BY prestamo.fecha_prestamo DESC
    `);

    return res.json(results);
});


app.put("/prestamo/:id/devolver", async function(req, res){

    const [prestamo] = await sequelize.query(`
        SELECT ejemplar_id
        FROM prestamo
        WHERE id = ${req.params.id}
    `);

    if (prestamo.length === 0) {
        return res.status(404).json({
            mensaje: "Préstamo no encontrado"
        });
    }

    await sequelize.query(`
        UPDATE prestamo
        SET fecha_devolucion_real = NOW(),
            estado_prestamo = FALSE
        WHERE id = ${req.params.id}
    `);

    await sequelize.query(`
        UPDATE ejemplares
        SET disponible = TRUE
        WHERE id = ${prestamo[0].ejemplar_id}
    `);

    return res.json({
        mensaje: "Libro devuelto correctamente"
    });
});


app.get("/ejemplares/disponibles", async function(req, res){
    const [ results ] = await sequelize.query(`
        SELECT
            ejemplares.id,
            ejemplares.isbn,
            ejemplares.ubicacion,
            ejemplares.estado_fisico_libro,
            libros.titulo
        FROM ejemplares
        INNER JOIN libros
            ON ejemplares.libro_id = libros.id
        WHERE ejemplares.disponible = TRUE
    `);

    return res.json(results);
});


app.get("/libros-detalle", async function(req, res){
    const [ results ] = await sequelize.query(`
        SELECT
            libros.id,
            libros.titulo,
            libros.anio_publicacion,
            libros.editorial,
            libros.numero_pagina,
            categorias.nombre AS categoria
        FROM libros
        INNER JOIN categorias
            ON libros.categoria_id = categorias.id
    `);

    return res.json(results);
});


app.get("/libros-completo", async function(req, res){
    const [ results ] = await sequelize.query(`
        SELECT
            libros.id,
            libros.titulo,
            libros.anio_publicacion,
            libros.editorial,
            libros.numero_pagina,
            categorias.nombre AS categoria,
            autores.nombres,
            autores.apellidos
        FROM libros
        INNER JOIN categorias
            ON libros.categoria_id = categorias.id
        LEFT JOIN autor_libro
            ON libros.id = autor_libro.libro_id
        LEFT JOIN autores
            ON autores.id = autor_libro.autor_id
        ORDER BY libros.id
    `);

    return res.json(results);
});




// Levantando el servidor
app.listen(5000, function(){
    console.log("Servidor iniciado en http://localhost:5000");
});