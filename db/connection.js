const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/database.sqlite', (err)=>{
    if(err) console.log(err);
 db.run('CREATE TABLE IF NOT EXISTS categories (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)');
 db.run('CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, code TEXT NOT NULL, price REAL, description TEXT, color TEXT, guy TEXT, category_id INTEGER, FOREIGN KEY(category_id) REFERENCES categories(id))');
 db.run('CREATE TABLE IF NOT EXISTS image (id INTEGER PRIMARY KEY AUTOINCREMENT, url TEXT,  destacado INTEGER, product_id INTEGER, FOREIGN KEY(product_id) REFERENCES products(id))');
 db.run('CREATE TABLE IF NOT EXISTS clients (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT, password TEXT)');
 db.run('CREATE TABLE IF NOT EXISTS purchases (id INTEGER PRIMARY KEY AUTOINCREMENT, client_id INTEGER, product_id INTEGER, quantity INTEGER, total_paid REAL, fecha TEXT, ip_cliente TEXT, FOREIGN KEY(client_id) REFERENCES clients(id), FOREIGN KEY(product_id) REFERENCES products(id))');
 db.run('CREATE TABLE IF NOT EXISTS ratings (id INTEGER PRIMARY KEY AUTOINCREMENT, product_id INTEGER REFERENCES products(id) ON DELETE CASCADE, client_id INTEGER REFERENCES clients(id) ON DELETE CASCADE, rating INTEGER CHECK (rating >= 1 AND rating <= 5), UNIQUE (product_id, client_id))');
 console.log('Base de datos creada');
});

module.exports = db;