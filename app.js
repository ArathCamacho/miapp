const express = require('express');
const path = require('path');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

// Middleware para manejar datos de formularios
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware para servir archivos estáticos desde el directorio principal
app.use(express.static(path.dirname(__dirname)));

// Conexión a la base de datos MySQL (configuración básica, ajusta según tu entorno)
const mysql = require('mysql2');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Halo_2017',
    database: 'dbPagWeb'
});

// Manejar errores de conexión a la base de datos
connection.connect((err) => {
    if (err) {
        console.error('Error conectando a la base de datos:', err.stack);
        return;
    }
    console.log('Conexión exitosa a la base de datos con id ' + connection.threadId);
});

// Ruta para manejar el registro de usuarios
app.post('/registro', async (req, res) => {
    const { nombre, email, contraseña, direccion_envio, telefono } = req.body;
    console.log('Datos recibidos del formulario:', nombre, email, direccion_envio, telefono);

    // Asegurar que los datos requeridos están presentes
    if (!nombre || !email || !contraseña) {
        return res.status(400).send('Faltan campos requeridos');
    }

    try {
        // Hash de la contraseña utilizando bcrypt
        const hashedPassword = await bcrypt.hash(contraseña, 10);

        // Insertar usuario en la base de datos
        const insertQuery = 'INSERT INTO usuarios (nombre_usuario, correo_electronico, contrasena, direccion_envio, telefono) VALUES (?, ?, ?, ?, ?)';
        connection.query(insertQuery, [nombre, email, hashedPassword, direccion_envio, telefono], (err, result) => {
            if (err) {
                console.error('Error al registrar usuario:', err);
                return res.status(500).send('Error al registrar usuario');
            }
            console.log('Usuario registrado con éxito');
            res.redirect('/registro_exitoso.html'); // Redirigir a una página de registro exitoso
        });
    } catch (error) {
        console.error('Error al generar hash de contraseña:', error);
        res.status(500).send('Error al registrar usuario');
    }
});

// Ruta principal para servir el archivo HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor encendido en http://localhost:${port}`);
});
