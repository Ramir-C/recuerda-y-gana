const express = require('express');
const path = require('path');
const app = express();
require('dotenv').config();
const mysql = require('mysql2');
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const db = mysql.createConnection({
    host: process.env.MYSQLHOST || 'localhost',
    user: process.env.MYSQLUSER || 'root',
    password: process.env.MYSQLPASSWORD || '',
    database: process.env.MYSQLDATABASE || 'juego',
    port: process.env.MYSQLPORT || 3306
});

db.connect((err) => {
    if (err) {
        console.error('Error de conexión a MySQL:', err);
        process.exit(1);
    } else {
        console.log('✅ Conectado a MySQL');
    }
});

app.post('/save', (req, res) => {
    const { nombre, puntaje } = req.body;
    if (!nombre || !puntaje) {
        return res.status(400).json({ mensaje: 'Faltan datos' });
    }
    db.query('INSERT INTO resultados (nombre, puntaje) VALUES (?, ?)', [nombre, puntaje], (err) => {
        if (err) {
            return res.status(500).json({ mensaje: 'Error al guardar en la base de datos' });
        }
        res.status(200).json({ mensaje: 'Datos guardados correctamente' });
    });
});

app.get('/resultados', (req, res) => {
    db.query('SELECT * FROM resultados ORDER BY puntaje DESC', (err, results) => {
        if (err) {
            return res.status(500).json({ mensaje: 'Error al consultar la base de datos' });
        }
        res.json(results);
    });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/resultados.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'resultados.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor escuchando en puerto ${PORT}`);
});
