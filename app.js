const express = require('express');
const path = require('path');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

// Middleware para manejar datos de formularios
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware para servir archivos estáticos desde la raíz
app.use(express.static(path.join(__dirname)));

// Conexión a la base de datos MySQL (sustituye con tus propios detalles de conexión)
const mysql = require('mysql2');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Halo_2017',
    database: 'dbPagWeb'
});

connection.connect((err) => {
    if (err) {
        console.error('Error conectando a la base de datos:', err.stack);
        return;
    }
    console.log('Conexión exitosa a la base de datos con id ' + connection.threadId);
});

// Ruta para manejar el registro de usuarios
app.post('/registro', async (req, res) => {
    const { nombre, email, contraseña, address, phone } = req.body;
    console.log('Datos recibidos del formulario:', nombre, email, contraseña, address, phone);

    // Asegúrate de que los datos estén definidos y no sean undefined
    if (!nombre || !email || !contraseña) {
        res.status(400).send('Faltan campos requeridos');
        return;
    }

    try {
        // Hash de la contraseña utilizando bcrypt
        const hashedPassword = await bcrypt.hash(contraseña, 10); // 10 es el número de rondas de hashing

        // Insertar usuario en la base de datos
        const insertQuery = 'INSERT INTO usuarios (nombre_usuario, correo_electronico, contrasena, direccion_envio, telefono) VALUES (?, ?, ?, ?, ?)';
        connection.query(insertQuery, [nombre, email, hashedPassword, address, phone], (err, result) => {
            if (err) {
                console.error('Error al registrar usuario:', err);
                res.status(500).send('Error al registrar usuario');
                return;
            }
            console.log('Usuario registrado con éxito');
            res.redirect('/registro_exitoso.html'); // Redirigir a una página de registro exitoso
        });
    } catch (error) {
        console.error('Error al generar hash de contraseña:', error);
        res.status(500).send('Error al registrar usuario');
    }
});
// Servir archivo HTML principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor encendido en http://localhost:${port}`);
});
