const { Client } = require('pg');

const client = new Client({
  host: '127.0.0.1',
  port: 5432,
  database: 'qrdb',
  user: 'postgres',
  password: 'postgres',
});

client.connect((err) => {
  if (err) {
    console.error('❌ Error de conexión:', err.message);
    process.exit(1);
  }
  console.log('✅ Conexión exitosa a PostgreSQL!');

  client.query('SELECT COUNT(*) as count FROM "Property"', (err, res) => {
    if (err) {
      console.error('❌ Error en query:', err.message);
    } else {
      console.log('✅ Query exitoso. Propiedades:', res.rows[0].count);
    }
    client.end();
  });
});
