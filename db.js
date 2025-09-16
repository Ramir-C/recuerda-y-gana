const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: process.env.MYSQLHOST.replace(/^.*:/, ''), // fuerza quitar IPv6 si la da Railway
  port: process.env.MYSQLPORT,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE
});

connection.connect((err) => {
  if (err) {
    console.error('Error de conexión a MySQL:', err);
    return;
  }
  console.log('Conectado a la base de datos MySQL 🚀');
});
